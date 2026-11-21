---
name: reel
description: Edita un vídeo que has grabado con el móvil para convertirlo en un reel con Remotion: transcripción local gratis, subtítulos animados, colores de tu marca y una plantilla reutilizable. También sirve solo para transcribir un vídeo a texto o a un archivo de subtítulos (SRT). Úsala cuando el alumno quiera editar un vídeo grabado, transcribirlo, añadir subtítulos o preparar un reel.
argument-hint: "[ruta del vídeo]"
allowed-tools:
  - Bash(node --version)
  - Bash(eza ~/mentoria/reels/scripts/transcribe.mjs)
  - Bash(mkdir -p ~/mentoria)
  - Bash(cd ~/mentoria && npx -y create-video@latest --yes --blank --skills reels)
  - Bash(cd ~/mentoria/reels && node scripts/transcribe.mjs *)
  - Bash(cd ~/mentoria/reels && npx remotion studio)
  - Bash(cd ~/mentoria/reels && npx remotion render *)
---

# Reel editado con Remotion

Habla en español, tutea, frases cortas. Solo **edición**: el guion lo trae el alumno (viene de otro módulo). Para escribir el código de vídeo, usa también la skill `remotion-motion-graphics` si está instalada.

## Requisitos
- Node.js instalado (`node --version`).
- La transcripción se hace en tu ordenador con Whisper, gratis y sin cuenta ni clave. La prepara `/mentoria:instalar` (carpeta `~/mentoria/reels/whisper.cpp` y script `~/mentoria/reels/scripts/transcribe.mjs`). **Antes de transcribir**, comprueba que existe el script con `eza ~/mentoria/reels/scripts/transcribe.mjs`. Si no existe, no sigas: dile que ejecute `/mentoria:instalar` (paso de Whisper) y vuelva. El script tampoco instala nada por su cuenta: si falta Whisper o el modelo, te lo dice y hay que pasar por `/mentoria:instalar`.
- Remotion es gratis para autónomos y empresas de hasta 3 personas. Condiciones al día en https://www.remotion.dev

## Qué hacer

0. **¿Qué quiere el alumno?** Si solo quiere el texto o un archivo de subtítulos (SRT) y no quiere editar el vídeo, sigue la sección **Solo transcribir** y no hagas nada más.
1. Pide la ruta del vídeo y la duración objetivo (30 s por defecto). Comprueba que el archivo existe.
2. **Marca:** si hay `entrenador-ia/marca.md` (o un archivo de marca del alumno), léelo y usa sus colores y tipografías. Con la marca de ejemplo: texto tinta `#1B1F1E` sobre arena `#F5EFE6`, acento coral `#FF6B4A` para la palabra clave, titulares Archivo e Inter para el texto. Si no hay marca, pregunta 2 colores y una fuente.
3. **Subtítulos** (en este orden; no saltes la corrección):
   1. **Transcribe** con el script: `cd ~/mentoria/reels && node scripts/transcribe.mjs "<ruta del vídeo>"` (si falta Whisper, el script lo dice y no instala nada). Deja junto al vídeo `nombre.txt` (texto), `nombre.srt` (subtítulos) y `nombre.captions.json` (palabras con sus tiempos). Si esos archivos ya existen, el script **no los toca** (pueden llevar correcciones del alumno) y lo dice: pregunta si quiere reutilizarlos o rehacerlos; solo si pide rehacerlos y perder las correcciones, repite con `--force`. Avisa de que tarda unos minutos y no sale nada hasta el final.
   2. **Enséñale el texto** (`nombre.txt`) y pídele que corrija errores: nombres propios, términos de entrenamiento («sentadilla búlgara», «press banca»), marcas. Whisper se equivoca más con nombres y jerga.
   3. **Aplica las correcciones** al `nombre.captions.json`: cambia solo el campo `text` de las palabras afectadas y conserva `startMs`, `endMs` y el espacio inicial de cada palabra. Si una corrección une o separa palabras, reparte los tiempos entre ellas. Actualiza también `nombre.txt` y `nombre.srt` si el alumno los va a usar. Enséñale el resultado en una línea.
   4. **Crea los subtítulos animados** en Remotion desde el `captions.json` corregido: carga el JSON como lista de `Caption` de `@remotion/captions`, agrúpalo con `createTikTokStyleCaptions` (`combineTokensWithinMilliseconds` en torno a 1200; menos = frases más cortas) y pinta cada página con sus palabras. La palabra que se está diciendo va en el **color de acento de la marca**; el resto en el color de texto. Letra grande, 2-3 líneas como máximo, dentro de la zona segura (no tapes la parte baja donde la app pone sus botones).
4. Usa el proyecto de `~/mentoria/reels` si existe (lo crea `/mentoria:instalar`, con las skills oficiales de Remotion). Si no, créalo con `cd ~/mentoria && npx -y create-video@latest --yes --blank --skills reels`. Cada reel va en su propia composición, con la **plantilla reutilizable**: vídeo de entrada, subtítulos y colores como parámetros, para que el siguiente reel sea cambiar el archivo.
5. Previsualiza (`cd ~/mentoria/reels && npx remotion studio`), corrige lo que pida el alumno y renderiza a MP4 vertical 1080x1920 (`cd ~/mentoria/reels && npx remotion render <composición> out/<nombre>.mp4`).
6. Si usa imágenes o personajes generados con IA, el vídeo debe indicarlo (etiqueta «creado con IA» al publicar).

## Solo transcribir

Para quien solo quiere el texto de un vídeo (para un post, un guion o subirle los subtítulos a otra app) sin editarlo:
1. Pide la ruta del vídeo y comprueba que existe.
2. Comprueba el script como arriba. Ejecuta `cd ~/mentoria/reels && node scripts/transcribe.mjs "<ruta del vídeo>"` (si los archivos ya existen, mismo aviso y mismo `--force` que arriba). Si el alumno prefiere otra carpeta de salida, añade `--out "<carpeta>"`.
3. Enséñale el texto y deja que lo corrija; aplica los cambios a `nombre.txt` y `nombre.srt`.
4. Si en el paso 3 hubo correcciones, aplícalas **también** a `nombre.captions.json` (mismas reglas que en el paso 3 del flujo de edición: solo `text`, conservando los tiempos), para que los tres archivos queden iguales. Si el alumno no quiere editar nada más, basta con `.txt` y `.srt`, y dile claramente que `captions.json` queda sin corregir.
5. Dile dónde están los archivos: `nombre.txt` (texto), `nombre.srt` (subtítulos para subir a Instagram, TikTok, YouTube o a un editor) y `nombre.captions.json` (palabras con tiempos; solo hace falta si luego quieres subtítulos animados con `/mentoria:reel`).
No renderices ni abras Remotion en este camino.

## Ejemplo para copiar

```
Tengo un vídeo de 30 segundos grabado con el móvil en reel-sentadillas.mp4 donde explico por qué
una rodilla operada sí puede hacer sentadillas con control. Edítalo con Remotion en vertical:
subtítulos animados grandes, con mis colores de marca.md y la palabra clave en el color de acento.
Enséñame primero la transcripción para corregirla. Deja una plantilla que pueda reutilizar.
```

Solo el texto:

```
Transcríbeme el vídeo reel-sentadillas.mp4 y dame el texto y el archivo de subtítulos (SRT). No lo edites.
```
