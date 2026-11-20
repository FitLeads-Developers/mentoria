---
name: whatsapp
description: Conecta tu WhatsApp en modo solo lectura mediante un código QR en tu propio ordenador (127.0.0.1) y responde preguntas sobre tus chats («¿qué me escribió Marta ayer?», «resume mi semana con Luis», «¿a quién tengo sin contestar?»). Úsala cuando el alumno quiera consultar, resumir o analizar sus conversaciones de WhatsApp.
disable-model-invocation: true
argument-hint: "[pregunta sobre tus chats]"
allowed-tools:
  - Bash(cd *)
  - Bash(node *)
  - Bash(npm *)
  - Bash(curl -s http://127.0.0.1:3977/*)
  - Bash(curl -s "http://127.0.0.1:3977/*)
  - Bash(curl -s -X POST http://127.0.0.1:3977/*)
  - Bash(cp -R *)
  - Bash(mkdir -p *)
---

# WhatsApp: pregúntale a Claude por tus chats (solo lectura)

> **Aviso. Léelo antes de empezar** (muéstraselo tal cual al alumno y espera su «de acuerdo»):
>
> - Esto **no es oficial**. Usa la librería `whatsapp-web.js`, que no está afiliada a WhatsApp.
> - **WhatsApp no permite clientes no oficiales y puede bloquear tu número.** Es lo que dice el aviso legal del propio proyecto: «no se garantiza que no te bloqueen» y «WhatsApp no permite bots ni clientes no oficiales».
> - Por eso: usa preferentemente **un número secundario**, o acepta el riesgo bajo tu responsabilidad.
> - Es **solo lectura**: el programa no envía mensajes, y no hay forma de hacerlo desde aquí. Leer es lo más seguro que se puede hacer: en modo lectura no te va a pasar nada, aunque el riesgo de bloqueo de los clientes no oficiales sigue existiendo.
> - Lo que sí mete en líos a un número es **enviar**. Evita mandar mensajes de WhatsApp desde herramientas no oficiales y, sobre todo, **nunca envíes a mucha gente de golpe**: los envíos masivos son lo que hace que bloqueen los números.
> - Todo ocurre en tu ordenador. El servidor solo escucha en `127.0.0.1` y tus chats no se guardan en ningún archivo.

Habla en español, tutea, frases cortas. Si el alumno no acepta el aviso, para aquí.

## Código

`${CLAUDE_PLUGIN_ROOT}/scripts/whatsapp/` (Node). Se copia a `~/.fitleads-whatsapp/app`, porque el plugin puede actualizarse y borrar su carpeta. La sesión de WhatsApp vive aparte, en `~/.fitleads-whatsapp/.wwebjs_auth`, y no se toca al actualizar.

## Pasos

1. **Mira qué hay en marcha.** `curl -s http://127.0.0.1:3977/api/status` (si no responde, no hay servidor). Devuelve `status` y `version`.
2. **Preparar (la primera vez y cuando el plugin se actualice).** Tú lo haces, el alumno no teclea nada.
   - Versión instalada: `cd ~/.fitleads-whatsapp/app && node -p "require('./package.json').version"`. Si falla, no está instalado.
   - Versión del plugin: `cd "${CLAUDE_PLUGIN_ROOT}/scripts/whatsapp" && node -p "require('./package.json').version"`.
   - Si no está instalado o las versiones difieren, **antes de copiar** para el servidor viejo si hay uno (en Windows bloquea los archivos): `curl -s -X POST http://127.0.0.1:3977/api/shutdown -H 'Content-Type: application/json'`. Espera unos segundos a que `/api/status` deje de responder. Luego copia el código (esto mantiene la sesión):
     ```
     mkdir -p ~/.fitleads-whatsapp/app
     cp -R "${CLAUDE_PLUGIN_ROOT}/scripts/whatsapp/." ~/.fitleads-whatsapp/app/
     cd ~/.fitleads-whatsapp/app && npm install
     ```
   - Solo la primera vez, descarga el navegador interno: `cd ~/.fitleads-whatsapp/app && npm run setup`.
   - Avisa antes: descarga cientos de MB y puede tardar varios minutos. Lánzalo en segundo plano y espera.
   - Funciona igual en Mac, Windows (con Git Bash, que es lo que usa Claude Code allí) y Linux.
   - Si `npm run setup` falla o el servidor da «Failed to launch the browser», el servidor ya prueba solo con el Chrome, Chromium o Edge que encuentre instalado. Si aun así no lo encuentra, usa el Chrome del alumno: arranca el servidor con `PUPPETEER_EXECUTABLE_PATH` apuntando a su navegador:
     - Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
     - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe` (o la misma ruta en `Program Files (x86)`; en Git Bash: `/c/Program Files/Google/Chrome/Application/chrome.exe`)
     - Linux: `/usr/bin/google-chrome` o `/usr/bin/chromium` (el que tengas)
3. **Arrancar el servidor.** Reutiliza el que ya corre **solo si** su `version` es la instalada y su `status` es `connected`, `qr` o `loading` (salta al paso 5 si es `connected`). Si el `status` es `error` o `disconnected`, o la versión no coincide, páralo con el `POST /api/shutdown` de arriba y arranca uno nuevo. Si no hay ninguno, arráncalo igual. Siempre **en segundo plano**:
   ```
   node ~/.fitleads-whatsapp/app/server.js
   ```
4. **La página se abre sola** en el navegador por defecto del alumno (Chrome, Edge, Safari, Firefox…): el servidor lo hace él mismo en Mac, Windows y Linux. Si no se abre, dile al alumno que pegue http://127.0.0.1:3977 en su navegador de siempre. No uses el navegador de Claude para esto. (Con `--no-open` el servidor no abre nada.) Confirma con `curl -s http://127.0.0.1:3977/api/status`: debe decir `qr` (tarda unos 20–40 s en aparecer; si dice `loading`, espera).
5. **El alumno escanea el código con el móvil:** WhatsApp → **Dispositivos vinculados** → **Vincular un dispositivo**. Tú no tocas el móvil. Espera a que `/api/status` diga `connected` (y la página ponga «Conectado ✅»). Solo hace falta la primera vez: la sesión se guarda y la próxima vez conecta sola.
6. **Responder a lo que pregunte el alumno.** Solo lees; no guardes el contenido de los chats en archivos ni en memoria salvo que el alumno lo pida de forma explícita.
   - **Buscar el chat:** `curl -s "http://127.0.0.1:3977/api/chats?q=marta&limit=10"`. Devuelve, de más reciente a más antiguo: `name`, `id`, `isGroup`, `unreadCount`, `lastMessageDate` y una vista previa (`preview`). Sin `q` lista los últimos 30 (máximo 200). Si hay varios chats que encajan, pregunta cuál (una sola pregunta).
   - **Leer mensajes:** `curl -s "http://127.0.0.1:3977/api/messages?chatId=<id>&limit=100"`. Devuelve JSON de más antiguo a más reciente (`timestamp`, `fromMe`, `author`, `body`). Por defecto 50, máximo 500. Con `&format=md` lo devuelve ya como markdown agrupado por días. Los audios, imágenes y vídeos salen como `[audio]`, `[imagen]`, `[vídeo]`: el contenido no se descarga.
   - **«¿A quién tengo sin contestar?»:** lista los chats recientes (`unreadCount` y `preview`), lee los que dudes y responde con nombre y fecha.
   - Si un `curl` responde `no conectado`, mira `/api/status`: si dice `error` o `disconnected`, para el servidor con `POST /api/shutdown` y vuelve al paso 3 (arrancarlo de nuevo); si dice `qr` o `loading`, espera o vuelve al paso 4.
   - Contesta a la pregunta con datos del chat y cita fechas. Si no aparece, dilo; no supongas. Si el alumno quiere dejar notas en la ficha de un cliente, que te lo pida y lo haces (ver `/mentoria:cliente`).

## Desconectar

1. Para el servidor: `curl -s -X POST http://127.0.0.1:3977/api/shutdown -H 'Content-Type: application/json'`.
2. Borra la sesión: `node ~/.fitleads-whatsapp/app/logout.js`
3. **En el móvil:** WhatsApp → Dispositivos vinculados → toca este equipo → *Cerrar sesión*. Sin este paso, el móvil sigue vinculado.

Cierra siempre el servidor cuando acabes. La sesión guardada en `~/.fitleads-whatsapp` equivale a tener WhatsApp abierto: no la compartas.
