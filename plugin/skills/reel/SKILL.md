---
name: reel
description: Edita un vídeo que has grabado con el móvil para convertirlo en un reel con Remotion: subtítulos animados, colores de tu marca y una plantilla reutilizable. Úsala cuando el alumno quiera editar un vídeo grabado, añadir subtítulos o preparar un reel.
argument-hint: "[ruta del vídeo]"
---

# Reel editado con Remotion

Habla en español, tutea, frases cortas. Solo **edición**: el guion lo trae el alumno (viene de otro módulo). Para escribir el código de vídeo, usa también la skill `remotion-motion-graphics` si está instalada.

## Requisitos
- Node.js instalado (`node --version`).
- Remotion es gratis para autónomos y empresas de hasta 3 personas. Condiciones al día en https://www.remotion.dev

## Qué hacer

1. Pide la ruta del vídeo y la duración objetivo (30 s por defecto). Comprueba que el archivo existe.
2. **Marca:** si hay `entrenador-ia/marca.md` (o un archivo de marca del alumno), léelo y usa sus colores y tipografías. Con la marca de ejemplo: texto tinta `#1B1F1E` sobre arena `#F5EFE6`, acento coral `#FF6B4A` para la palabra clave, titulares Archivo e Inter para el texto. Si no hay marca, pregunta 2 colores y una fuente.
3. **Subtítulos:** transcribe el audio, enséñale la transcripción para que corrija errores y solo entonces crea los subtítulos animados (grandes, palabra clave destacada).
4. Crea el proyecto Remotion en una carpeta nueva (por ejemplo `reels/<nombre>/`), con la **plantilla reutilizable**: vídeo de entrada, subtítulos y colores como parámetros, para que el siguiente reel sea cambiar el archivo.
5. Previsualiza (`npx remotion studio`), corrige lo que pida el alumno y renderiza a MP4 vertical 1080x1920.
6. Si usa imágenes o personajes generados con IA, el vídeo debe indicarlo (etiqueta «creado con IA» al publicar).

## Ejemplo para copiar

```
Tengo un vídeo de 30 segundos grabado con el móvil en reel-sentadillas.mp4 donde explico por qué
una rodilla operada sí puede hacer sentadillas con control. Edítalo con Remotion en vertical:
subtítulos animados grandes, con mis colores de marca.md y la palabra clave en el color de acento.
Enséñame primero la transcripción para corregirla. Deja una plantilla que pueda reutilizar.
```
