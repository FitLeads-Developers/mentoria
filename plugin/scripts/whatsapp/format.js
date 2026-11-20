// Formateador puro: mensajes de WhatsApp -> markdown. Sin dependencias.

const MARCADORES = {
  ptt: '[audio]',
  audio: '[audio]',
  image: '[imagen]',
  video: '[vídeo]',
  document: '[documento]',
  sticker: '[sticker]',
};

const ZONA_HORARIA = 'Europe/Madrid';

function partes(timestamp) {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(timestamp * 1000)).map((x) => [x.type, x.value]));
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` };
}

export function contenido({ type, body }) {
  const texto = (body ?? '').trim();
  const marcador = MARCADORES[type];
  if (marcador) return texto ? `${marcador} ${texto}` : marcador;
  return texto || '[mensaje no soportado]';
}

function quien(m, chatName) {
  if (m.fromMe) return 'Tú';
  return m.author || chatName;
}

/**
 * @param {string} chatName
 * @param {{timestamp:number, fromMe:boolean, author?:string|null, body?:string, type?:string}[]} messages
 *   timestamp en segundos (como whatsapp-web.js)
 * @returns {string}
 */
export function chatToMarkdown(chatName, messages) {
  const lineas = [`# Chat con ${chatName}`, ''];
  if (messages.length === 0) {
    lineas.push('_Sin mensajes_', '');
    return lineas.join('\n');
  }
  const ordenados = [...messages].sort((a, b) => a.timestamp - b.timestamp);
  let diaActual = null;
  for (const m of ordenados) {
    const { fecha, hora } = partes(m.timestamp);
    if (fecha !== diaActual) {
      if (diaActual !== null) lineas.push('');
      lineas.push(`## ${fecha}`, '');
      diaActual = fecha;
    }
    const texto = contenido(m).replace(/\r?\n/g, '\n  ');
    lineas.push(`- **${hora} · ${quien(m, chatName)}:** ${texto}`);
  }
  lineas.push('');
  return lineas.join('\n');
}
