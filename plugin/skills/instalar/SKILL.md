---
name: instalar
description: Guía paso a paso para dejar listo tu ordenador para el curso de IA para entrenadores: comprueba Node.js y Claude Code, te lleva a crear cada cuenta (Claude, ChatGPT, NotebookLM, Higgsfield, treg) y a conectar Gmail, Calendar y Drive. Úsala cuando el alumno escriba /mentoria:instalar o diga que quiere preparar su ordenador para el curso.
disable-model-invocation: true
allowed-tools:
  - Bash(node --version)
  - Bash(npm --version)
  - Bash(uname *)
  - Bash(open *)
  - Bash(xdg-open *)
  - Bash(start *)
  - Bash(claude --version)
---

# Instalar: tu ordenador listo para el curso

Vas a acompañar a un entrenador personal que no es técnico. Habla en español, tutea y usa frases cortas. Sin jerga: si usas una palabra técnica, explícala en cinco palabras.

## Reglas (no se negocian)

1. **Tú no escribes contraseñas, datos de pago ni códigos de verificación. Nunca.** Tampoco creas cuentas. Lo hace el alumno, en su navegador.
2. Para cada cuenta: abre la página oficial, explica qué debe pulsar y **PARA**. Espera a que el alumno diga «hecho» antes de seguir. No avances por tu cuenta.
3. Si el alumno te pega una contraseña, un código o una clave en el chat, dile que no la uses y que la cambie en esa cuenta.
4. No instales nada con `sudo`. Si algo exige permisos de administrador, explícalo y deja que lo haga el alumno.
5. Antes de cada paso, una línea: qué haces y para qué. Después, una línea: qué ha pasado.
6. Solo das URLs de la lista de abajo. Si no tienes la URL, di dónde buscarla («busca el botón *Descargar* en la web de X»).

## Pasos

### 1. Tu ordenador
Detecta el sistema con `uname -s` (`Darwin` = Mac, `Linux`; en Windows el entorno lo indica). Di en una línea qué has visto.

### 2. Node.js
Ejecuta `node --version`.
- Si sale `v20` o más: perfecto, sigue.
- Si no existe o es antiguo: dile que descargue la versión **LTS** desde https://nodejs.org/en/download (instalador normal, siguiente, siguiente). Para en ese paso y espera. Después repite `node --version`.
- Alternativa sin permisos de administrador: nvm. Explica que es un «gestor de versiones de Node» y deja que el alumno siga las instrucciones de la página de nvm que busque él; no ejecutes scripts descargados con `curl | sh`.

### 3. Claude Code
Ejecuta `claude --version`. Si funciona, ya estás dentro. Recuerda: Claude Code necesita un plan de pago (Pro o superior); el plan gratis no lo incluye. Guía oficial: https://code.claude.com/docs/en/setup

### 4. Cuentas (una a una)
Para cada fila: «Voy a abrirte la página de X. Crea la cuenta tú y dime *hecho*». Abre con `open URL` (Mac), `xdg-open URL` (Linux) o `start URL` (Windows). Luego PARA.

| Cuenta | Para qué | Página |
|---|---|---|
| Claude (plan Pro) | Claude y Claude Code | https://claude.com/download (descarga la app e inicia sesión) |
| ChatGPT | Alternativa y segunda opinión | https://chatgpt.com |
| NotebookLM | Estudios → podcast, preguntas sobre tu método | https://notebooklm.google.com |
| Higgsfield | Imágenes y vídeo con IA | https://higgsfield.ai |
| treg | Datos externos (por ejemplo, analizar un Instagram) | busca «treg» y entra en su web oficial |
| Remotion | Editar vídeos | No necesita cuenta: solo Node.js. Más info: https://www.remotion.dev |

Pregunta antes de abrir cada una si ya la tiene. No insistas en las que no necesite todavía.

### 5. Conectores en Claude
Gmail, Google Calendar y Google Drive se conectan en la app de Claude: **Settings → Connectors** (Ajustes → Conectores). Dile que pulse *Connect* en cada uno y acepte los permisos en la ventana de Google. Para en cada uno.
Después, la extensión **Claude in Chrome**: se instala desde la Chrome Web Store (busca «Claude in Chrome»). Para y espera.

### 6. Comprobación final
Verifica lo que puedas (`node --version`, `claude --version`). El resto lo confirma el alumno. Muestra la tabla con ✅ / ⏳ / ❌ según lo que haya dicho:

| Cosa | Estado |
|---|---|
| Node.js | |
| Claude Code con sesión iniciada | |
| Claude (plan de pago) | |
| ChatGPT | |
| NotebookLM | |
| Higgsfield | |
| treg | |
| Conector Gmail | |
| Conector Calendar | |
| Conector Drive | |
| Claude in Chrome | |

Termina con una frase de ánimo y el siguiente paso: `/mentoria:cliente` para crear su primera ficha.
