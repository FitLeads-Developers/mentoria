---
name: whatsapp
description: Conecta WhatsApp en modo solo lectura mediante un código QR en tu propio ordenador (127.0.0.1) y exporta los chats de tus clientes a markdown dentro de su carpeta. Úsala cuando el alumno quiera leer, exportar o analizar sus chats de WhatsApp.
disable-model-invocation: true
argument-hint: "[nombre del cliente]"
allowed-tools:
  - Bash(node *)
  - Bash(npm *)
  - Bash(curl -s http://127.0.0.1:3977/*)
  - Bash(cp -R *)
  - Bash(mkdir -p *)
---

# WhatsApp: leer y exportar chats (solo lectura)

> **Aviso. Léelo antes de empezar** (muéstraselo tal cual al alumno y espera su «de acuerdo»):
>
> - Esto **no es oficial**. Usa la librería `whatsapp-web.js`, que no está afiliada a WhatsApp.
> - **WhatsApp no permite clientes no oficiales y puede bloquear tu número.** Es lo que dice el aviso legal del propio proyecto: «no se garantiza que no te bloqueen» y «WhatsApp no permite bots ni clientes no oficiales».
> - Por eso: usa preferentemente **un número secundario**, o acepta el riesgo bajo tu responsabilidad.
> - Es **solo lectura**: el programa no envía mensajes, y no hay forma de hacerlo desde aquí. Leer es lo más seguro que se puede hacer: en modo lectura no te va a pasar nada, aunque el riesgo de bloqueo de los clientes no oficiales sigue existiendo.
> - Lo que sí mete en líos a un número es **enviar**. Evita mandar mensajes de WhatsApp desde herramientas no oficiales y, sobre todo, **nunca envíes a mucha gente de golpe**: los envíos masivos son lo que hace que bloqueen los números.
> - Exporta **solo chats de clientes que te han dado su consentimiento RGPD** (están en su `ficha.md`). Los chats pueden contener datos de salud.
> - Todo ocurre en tu ordenador. El servidor solo escucha en `127.0.0.1`.

Habla en español, tutea, frases cortas. Si el alumno no acepta el aviso, para aquí.

## Código

`${CLAUDE_PLUGIN_ROOT}/scripts/whatsapp/` (Node). Se copia a una carpeta del alumno, porque el plugin puede actualizarse y borrarla.

## Pasos

1. **Preparar (solo la primera vez).** Copia el código y descarga lo que necesita:
   ```
   mkdir -p ~/.fitleads-whatsapp
   cp -R "${CLAUDE_PLUGIN_ROOT}/scripts/whatsapp" ~/.fitleads-whatsapp/app
   cd ~/.fitleads-whatsapp/app && npm install && npm run setup
   ```
   Avisa antes: descarga un navegador interno (cientos de MB) y puede tardar varios minutos. Lánzalo en segundo plano y espera.
   Funciona igual en Mac, Windows (con Git Bash, que es lo que usa Claude Code allí) y Linux.
   Si `npm run setup` falla o el servidor da «Failed to launch the browser», el servidor ya prueba solo con el Chrome, Chromium o Edge que encuentre instalado. Si aun así no lo encuentra, usa el Chrome del alumno: arranca el servidor con `PUPPETEER_EXECUTABLE_PATH` apuntando a su navegador:
   - Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe` (o la misma ruta en `Program Files (x86)`; en Git Bash: `/c/Program Files/Google/Chrome/Application/chrome.exe`)
   - Linux: `/usr/bin/google-chrome` o `/usr/bin/chromium` (el que tengas)
2. **Arrancar el servidor en segundo plano**, desde la carpeta de trabajo del alumno (donde está `clientes/`):
   ```
   node ~/.fitleads-whatsapp/app/server.js --export-root "$PWD"
   ```
   Solo se puede exportar dentro de esa carpeta.
3. **La página se abre sola** en el navegador por defecto del alumno (Chrome, Edge, Safari, Firefox…): el servidor lo hace él mismo en Mac, Windows y Linux. Si no se abre, dile al alumno que pegue http://127.0.0.1:3977 en su navegador de siempre. No uses el navegador de Claude para esto. (Con `--no-open` el servidor no abre nada.) Confirma con `curl -s http://127.0.0.1:3977/api/status`: debe decir `qr` (tarda unos 20–40 s en aparecer; si dice `loading`, espera).
4. **El alumno escanea el código con el móvil:** WhatsApp → **Dispositivos vinculados** → **Vincular un dispositivo**. Tú no tocas el móvil. Cuando `/api/status` diga `connected` y la página ponga «Conectado ✅», sigue.
5. **Elegir chat.** `curl -s http://127.0.0.1:3977/api/chats` devuelve nombre, id y fecha del último mensaje. Enséñale una lista corta y que elija. Comprueba en su `ficha.md` que hay consentimiento RGPD; si no lo hay o no existe la ficha, para y díselo.
6. **Exportar** dentro de la carpeta del cliente:
   ```
   curl -s -X POST http://127.0.0.1:3977/api/export -H 'Content-Type: application/json' \
     -d '{"chatId":"<id>","limit":500,"outDir":"clientes/<nombre-apellido>/chats"}'
   ```
   Respuesta: ruta del archivo y número de mensajes. Los audios, imágenes y vídeos salen como `[audio]`, `[imagen]`, `[vídeo]`: el contenido no se descarga.
7. **Pasar a la skill `cliente`** (`/mentoria:cliente`): preguntar «¿qué le prometí a…?», señales de baja, añadir revisión.

## Desconectar

1. Para el servidor (cierra el proceso en segundo plano).
2. Borra la sesión: `node ~/.fitleads-whatsapp/app/logout.js`
3. **En el móvil:** WhatsApp → Dispositivos vinculados → toca este equipo → *Cerrar sesión*. Sin este paso, el móvil sigue vinculado.

Cierra siempre el servidor cuando acabes. La sesión guardada en `~/.fitleads-whatsapp` equivale a tener WhatsApp abierto: no la compartas.
