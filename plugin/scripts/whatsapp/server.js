// Lector de WhatsApp de SOLO LECTURA. Escucha únicamente en 127.0.0.1.
// No hay ningún código que envíe mensajes: no añadas uno.
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import pkg from 'whatsapp-web.js';
import { chatToMarkdown } from './format.js';
import { openCommand, findChrome, isLaunchFailure } from './browser.js';
import { HOST, PORT, DATA_DIR, EXPORT_ROOT } from './config.js';

const { Client, LocalAuth } = pkg;

const estado = { status: 'loading', qr: null, error: null };

await fs.mkdir(DATA_DIR, { recursive: true });

function crearCliente(executablePath) {
  const c = new Client({
    authStrategy: new LocalAuth({ dataPath: path.join(DATA_DIR, '.wwebjs_auth') }),
    puppeteer: { headless: true, ...(executablePath ? { executablePath } : {}) },
  });
  c.on('qr', async (qr) => {
    estado.status = 'qr';
    estado.qr = await QRCode.toDataURL(qr, { margin: 2, width: 320 });
  });
  c.on('authenticated', () => {
    estado.status = 'loading';
    estado.qr = null;
  });
  c.on('ready', () => {
    estado.status = 'connected';
    estado.qr = null;
  });
  c.on('auth_failure', (m) => {
    estado.status = 'error';
    estado.error = String(m);
  });
  c.on('disconnected', (reason) => {
    estado.status = 'disconnected';
    estado.qr = null;
    estado.error = String(reason);
  });
  return c;
}

let client = crearCliente(process.env.PUPPETEER_EXECUTABLE_PATH);

function falloDeArranque(e) {
  estado.status = 'error';
  estado.error = e.message;
}

client.initialize().catch(async (e) => {
  // Without the bundled Chrome, retry once with a Chrome/Chromium/Edge already installed.
  const sistema = !process.env.PUPPETEER_EXECUTABLE_PATH && isLaunchFailure(e)
    ? findChrome(process.platform, process.env)
    : null;
  if (!sistema) {
    if (isLaunchFailure(e)) {
      console.error(
        'No se encontró ningún Chrome. Instala Google Chrome o arranca con PUPPETEER_EXECUTABLE_PATH apuntando a tu Chrome/Edge.',
      );
    }
    return falloDeArranque(e);
  }
  console.log(`Chrome interno no disponible; reintento con ${sistema}`);
  try {
    await client.destroy();
  } catch {
    /* no llegó a arrancar */
  }
  client = crearCliente(sistema);
  client.initialize().catch(falloDeArranque);
});

// ---------- HTTP ----------

const HOSTS_OK = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function pagina() {
  let cuerpo;
  if (estado.status === 'connected') {
    cuerpo = '<h1>Conectado ✅</h1><p>Ya puedes volver a Claude Code y elegir el chat que quieres exportar.</p>';
  } else if (estado.status === 'qr' && estado.qr) {
    cuerpo = `<h1>Escanea este código</h1><img src="${estado.qr}" alt="Código QR de WhatsApp" width="320" height="320">
<p>WhatsApp → Dispositivos vinculados → Vincular un dispositivo.</p>`;
  } else if (estado.status === 'error' || estado.status === 'disconnected') {
    cuerpo = `<h1>Algo ha fallado</h1><p>${String(estado.error ?? estado.status).replace(/[<>&]/g, '')}</p><p>Vuelve a Claude Code y cuéntaselo.</p>`;
  } else {
    cuerpo = '<h1>Preparando…</h1><p>Esto tarda unos segundos. La página se actualiza sola.</p>';
  }
  const refresco = estado.status === 'connected' ? '' : '<meta http-equiv="refresh" content="3">';
  return `<!doctype html><html lang="es"><meta charset="utf-8">${refresco}
<title>Lector de WhatsApp (solo lectura)</title>
<body style="font-family:system-ui,sans-serif;max-width:480px;margin:3rem auto;text-align:center">${cuerpo}
<p style="color:#666;font-size:.85rem">Solo lectura. Este programa nunca envía mensajes.</p></body></html>`;
}

async function leerJson(req) {
  let datos = '';
  for await (const trozo of req) {
    datos += trozo;
    if (datos.length > 100_000) throw new Error('petición demasiado grande');
  }
  return JSON.parse(datos || '{}');
}

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'chat';

async function listarChats() {
  const chats = await client.getChats();
  return chats.map((c) => ({
    id: c.id._serialized,
    name: c.name,
    isGroup: c.isGroup,
    lastMessageDate: c.timestamp ? new Date(c.timestamp * 1000).toISOString() : null,
  }));
}

async function exportar({ chatId, limit, outDir }) {
  if (typeof chatId !== 'string' || !chatId) throw new Error('falta chatId');
  const n = Math.min(Math.max(Number(limit) || 500, 1), 5000);
  const destino = path.resolve(EXPORT_ROOT, outDir || '.');
  if (destino !== EXPORT_ROOT && !destino.startsWith(EXPORT_ROOT + path.sep)) {
    throw new Error('outDir debe estar dentro de la carpeta de trabajo');
  }
  const chat = await client.getChatById(chatId);
  const mensajes = await chat.fetchMessages({ limit: n });
  const md = chatToMarkdown(
    chat.name,
    mensajes.map((m) => ({
      timestamp: m.timestamp,
      fromMe: m.fromMe,
      author: m._data?.notifyName || null,
      body: m.body,
      type: m.type,
    })),
  );
  await fs.mkdir(destino, { recursive: true });
  const fichero = path.join(destino, `${slug(chat.name)}.md`);
  await fs.writeFile(fichero, md, 'utf8');
  return { file: fichero, messages: mensajes.length };
}

const server = http.createServer(async (req, res) => {
  try {
    // Protege contra páginas web externas que intenten hablar con el servidor local.
    if (!HOSTS_OK.has(req.headers.host ?? '')) return json(res, 403, { error: 'host no permitido' });
    const { pathname } = new URL(req.url, `http://${HOST}:${PORT}`);

    if (req.method === 'GET' && pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(pagina());
    }
    if (req.method === 'GET' && pathname === '/api/status') {
      return json(res, 200, { status: estado.status, error: estado.error });
    }
    if (req.method === 'GET' && pathname === '/api/chats') {
      if (estado.status !== 'connected') return json(res, 409, { error: 'no conectado' });
      return json(res, 200, await listarChats());
    }
    if (req.method === 'POST' && pathname === '/api/export') {
      if (estado.status !== 'connected') return json(res, 409, { error: 'no conectado' });
      // Solo JSON (obliga a un preflight CORS que no concedemos) y sin Origin ajeno.
      if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
        return json(res, 415, { error: 'usa application/json' });
      }
      if (req.headers.origin && !HOSTS_OK.has(new URL(req.headers.origin).host)) {
        return json(res, 403, { error: 'origen no permitido' });
      }
      return json(res, 200, await exportar(await leerJson(req)));
    }
    return json(res, 404, { error: 'no existe' });
  } catch (e) {
    return json(res, 500, { error: e.message });
  }
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log(`Lector de WhatsApp (solo lectura) en ${url}`);
  if (!process.argv.includes('--no-open')) abrirNavegador(url);
});

// Opens the QR page in the system default browser (never a Claude browser).
function abrirNavegador(url) {
  const manual = () => console.log(`Abre ${url} a mano en tu navegador habitual.`);
  const comando = openCommand(process.platform, url);
  if (!comando) return manual();
  try {
    const hijo = spawn(comando.cmd, comando.args, {
      detached: true,
      stdio: 'ignore',
      windowsVerbatimArguments: process.platform === 'win32',
      windowsHide: true,
    });
    hijo.on('error', manual);
    // xdg-open exits non-zero when no browser handler is configured.
    hijo.on('exit', (code) => {
      if (code) manual();
    });
    hijo.unref();
  } catch {
    manual();
  }
}

async function parar() {
  server.close();
  try {
    await client.destroy();
  } catch {
    /* ya estaba cerrado */
  }
  process.exit(0);
}
process.on('SIGINT', parar);
process.on('SIGTERM', parar);
