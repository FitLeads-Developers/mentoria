---
name: imagenes-personaje
description: Genera imágenes coherentes de un personaje (misma cara en distintos looks) con Higgsfield, usando hojas de referencia, siguiendo la marca. Siempre etiquetadas como IA, sin resultados ni antes/después falsos. Úsala cuando el alumno quiera imágenes de su personaje o de un entrenador IA como Dani Vega.
argument-hint: "[qué imagen quieres]"
---

# Imágenes coherentes de un personaje (Higgsfield)

Habla en español, tutea, frases cortas. Para el manejo de Higgsfield, apóyate en las skills `higgsfield-generate` y `higgsfield-soul-id` si están instaladas.

## Reglas
- Un personaje IA **se etiqueta como creado con IA** al publicarlo (etiqueta de Instagram/Meta y aviso en la web).
- **Nunca** uses su imagen como testimonio, resultado real ni «antes y después» de un cliente. Un antes/después se inventa en segundos: sirve para enseñarlo en clase, no para publicarlo.
- Gasta créditos con cabeza: dile cuánto cuesta antes de generar y pide confirmación.

## Qué hacer

1. **Lee la marca** (`entrenador-ia/marca.md` o la del alumno): descripción del personaje, colores, estilo visual y la sección de referencias. Si no hay marca, pregunta lo mínimo (edad, rasgos, ropa, estilo).
2. **Hoja de personaje:** si no existe, créala primero (primer plano + cuerpo entero). Es la base de todo.
3. **Hoja de referencias:** a partir de la hoja de personaje genera ángulos de cabeza, ángulos de cuerpo y expresiones. Guarda los identificadores de cada generación.
4. **Cada imagen nueva:** adjunta como referencia la hoja de personaje + la de ángulos de cabeza (y la de cuerpo si sale entero, la de expresiones si importa el gesto). Describe solo el cambio: ropa, lugar, acción.
5. Revisa el resultado contra la marca: edad aparente, logotipos de marcas reales (retócalos o evítalos), manos, coherencia de cara. Regenera lo que no encaje.
6. Guarda cada imagen con su identificador y su coste en una nota, para repetirla.

## Ejemplo para copiar

```
Genera una imagen de Dani Vega, mi entrenador de ejemplo: lee entrenador-ia/marca.md y usa como
referencia su hoja de personaje y cabeza-angulos.png. Escena: Dani explicando una sentadilla goblet
a una clienta de 45 años en un gimnasio pequeño, luz de día, camiseta verde bosque, sin logos de marcas.
Dime el coste antes de generar. Recuerda que es un personaje de IA y no puede usarse como testimonio.
```
