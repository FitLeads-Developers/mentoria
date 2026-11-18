# Dani Vega · Entrenador de ejemplo (personaje IA)

Personaje 100 % ficticio, creado con Higgsfield (AI Influencer) para el curso.
Lo usamos para la web de ejemplo, los recursos (lead magnet, posts) y las demos de edición de vídeo.
Nombre y detalles: provisionales, se pueden cambiar.

## Quién es
- **Dani Vega**, 34 años, entrenador personal en Valencia.
- Graduado en Ciencias de la Actividad Física y del Deporte (CAFyD), 10 años entrenando.
- Empezó en un gimnasio de barrio; hoy combina presencial y online.
- Historia: su madre se operó de rodilla y nadie le explicó cómo volver a entrenar. De ahí su enfoque.

## Nicho y propuesta
- **Fuerza para adultos de 35 a 55 años** con poco tiempo, que vuelven a entrenar o vienen de una lesión ya rehabilitada.
- Propuesta: *"Fuerte a los 40, sin vivir en el gimnasio."*
- Lo que no es: culturismo, retos de 30 días, dietas milagro.

## Público objetivo
| | |
|---|---|
| Edad | 35–55 |
| Perfil | Profesionales con familia; 2–3 h a la semana para entrenar |
| Clienta tipo | Marta, 45, rodilla operada, quiere volver a entrenar sin miedo (la misma del curso) |
| Dolores | Falta de tiempo, miedo a lesionarse, haber probado y dejarlo |
| Deseos | Moverse sin dolor, verse y sentirse fuerte, constancia |
| Dónde está | Instagram, WhatsApp, búsquedas locales ("entrenador personal Valencia") |

## Oferta
- **Asesoría individual trimestral: 150–250 €/mes** (el hilo conductor del curso).
  - Plan de fuerza 3 días/semana, revisión semanal por WhatsApp, ajuste mensual.
- Entrada: lead magnet gratuito (guía de 1 página) → landing → llamada de valoración.

## Tono de voz
- Cercano, claro y honesto. Tutea. Frases cortas.
- Explica el porqué, sin tecnicismos (y si usa uno, lo traduce).
- Nada de culpa ni presión: *"Mejor 2 días bien que 5 a medias."*
- Evita: "sin excusas", "transformación extrema", antes/después agresivos.

## Colores
| Rol | Nombre | HEX | Uso |
|---|---|---|---|
| Principal | Verde bosque | `#1F5C4A` | Marca, titulares, botones secundarios |
| Acento | Coral | `#FF6B4A` | Botones de acción (CTA), detalles |
| Fondo | Arena | `#F5EFE6` | Fondo de la web y de los posts |
| Texto | Tinta | `#1B1F1E` | Texto principal |
| Apoyo | Salvia | `#A8C3B5` | Fondos de tarjetas, iconos |

- Contraste: tinta y verde sobre arena aprueban WCAG AA para texto. El coral solo en botones con texto tinta o blanco en negrita grande.
- La camiseta del personaje es verde bosque: encaja con la marca en fotos y vídeos.

## Tipografía (Google Fonts, gratis)
- Titulares: **Archivo** (700–800), compacta y deportiva.
- Texto: **Inter** (400–600).

## Estilo visual
- Fotos naturales, luz de día, gimnasio pequeño o parque. Gente real de 35–55, no modelos.
- Encuadres limpios, mucho aire, fondos arena.
- Vídeo: subtítulos grandes en tinta sobre arena o blanco, acento coral para la palabra clave.
- Iconos de trazo redondeado, no rellenos.

## Pilares de contenido
1. **Fuerza sin miedo:** ejercicios seguros, progresiones, volver tras lesión.
2. **Poco tiempo, buenos resultados:** rutinas de 40 min, constancia.
3. **Mitos fuera:** explicar en 30 s lo que se repite en los chats.
4. **Historias de clientes:** con permiso y datos anonimizados.

## Para la web (cuando la hagamos)
- Secciones: hero con foto de Dani + propuesta → para quién es → método en 3 pasos → oferta → testimonios → lead magnet → FAQ → contacto (WhatsApp).
- CTA principal: "Reserva tu valoración gratis".
- CTA secundario: "Descarga la guía".

## Tokens (para copiar en la web)
```css
:root {
  --color-primary: #1F5C4A;
  --color-accent: #FF6B4A;
  --color-bg: #F5EFE6;
  --color-text: #1B1F1E;
  --color-support: #A8C3B5;
  --font-heading: "Archivo", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --radius: 14px;
}
```

## Transparencia
- Es un personaje generado con IA. Si se publica fuera del curso, se indica (etiqueta "creado con IA" de Instagram/Meta y aviso en la web).
- No usar su imagen para testimonios ni resultados "reales".

## Higgsfield
- Imagen: `dani-vega-character-sheet.png` (primer plano + cuerpo entero).
- Resultado real frente al brief: parece más joven (~25, no 34), viste camiseta oversize verde oliva con un "33" lima y zapatillas lima, y no sonríe. El verde oliva y el lima casan con la paleta; si queremos que encaje con "34 años, cercano", regenerar.
- Character sheet: job `1de512e4-3262-430b-a6c0-1ab5be6d6dae` (AI Influencer, 1,1 créditos).
- Siguiente paso para fotos y vídeos coherentes: usar esta hoja como referencia (o entrenar un Soul) en las generaciones.

## Looks (misma cara, distintos outfits)
Generados con GPT Image 2.6 en Higgsfield usando la hoja de personaje como referencia (0,25 créditos cada uno). En `looks/`:
1. `1-gimnasio.png`: camiseta verde bosque, sentadilla goblet con kettlebell.
2. `2-correr.png`: corriendo junto a la Ciudad de las Artes (Valencia) al amanecer. Lleva logos de Nike.
3. `3-retrato-web.png`: sudadera arena sobre fondo arena, brazos cruzados: candidata a foto del hero.
4. `4-online.png`: polo verde, sesión online con plan en el portátil. Lleva logo de Adidas.
5. `5-cafe.png`: camisa vaquera en una terraza, estilo de vida.
6. `6-movilidad.png`: camiseta de tirantes salvia, estiramiento de cadera.

Para la web, evitar o retocar las fotos con logos de marcas (2 y 4).

## Antes (ejemplo didáctico)
Dani con unos 19 años y ~20 kg más, buena postura. Generadas con GPT Image 2.6 usando la hoja de personaje y `referencias/cabeza-angulos.png` (0,25 créditos cada una):
- `looks/0-antes.png`: de pie en el salón, con camiseta gris y vaqueros (job `aa6f6e90-8be8-4b33-88f0-7c3b0f7fc526`).
- `looks/0-antes-espejo.png`: selfi en el espejo del baño (job `6fa59ee6-7800-4f07-97fa-140413c3fdee`).
- `looks/0-antes-v1.png`: primera versión (encorvado, más mayor), descartada.
- Solo para enseñar en el curso que un antes/después se inventa en segundos. Nunca publicarlo como resultado real.

## Hoja de referencias (usar SIEMPRE)
En `referencias/`, generadas con GPT Image 2.6 a partir de la hoja de personaje (0,25 créditos cada una):
- `cabeza-angulos.png`: frente, 3/4, perfil izquierdo, perfil derecho y nuca (job `6e84dfa7-2cd9-4a85-ae0d-ee8e084a12b5`).
- `cuerpo-angulos.png`: cuerpo entero de frente, lados y espalda; camiseta verde bosque, pantalón negro, zapatillas blancas (job `d5d90922-1f0f-43b0-b8e4-491e2c1c0a68`).
- `expresiones.png`: sonrisa, risa, explicando, serio, asintiendo y sorprendido (job `24486c50-484d-41e3-a047-001df7d6860b`).

Cómo usarlas: en cada imagen o vídeo nuevo de Dani, adjuntar como referencia la hoja de personaje + `cabeza-angulos.png` (y `cuerpo-angulos.png` si sale de cuerpo entero; `expresiones.png` si importa el gesto). En Higgsfield se pueden pasar los job IDs de arriba como referencia directamente.

## Coste total de imágenes de Dani
Hoja 1,12 + 12 fotos × 0,25 (6 looks, 3 antes —uno descartado— y 3 referencias) = **4,12 créditos** (más 270 de los vídeos en bruto).

## Vídeos en bruto (para practicar edición)
En `videos/bruto/`, generados con Seedance 2.0 (15 s, 9:16, 720p, con audio) usando la hoja de personaje, `referencias/cabeza-angulos.png` y `looks/1-gimnasio.png`. Sin editar: con silencios, «eh…» y repeticiones para recortar. Texto exacto en `videos/bruto/prompts.sh`; registros de Higgsfield en `videos/bruto/.registro/`.
- `toma1-frontal.mp4` (job `67c4271f-2116-4803-b322-6420d9ba6b4d`) y `toma1-lateral.mp4` (job `6ae33ad1-4802-493c-8146-fb4a2e194ecb`; salió primer plano frontal, no 3/4): «Si tienes más de cuarenta y poco tiempo… Mejor dos días bien que cinco a medias».
- `toma2-frontal.mp4` (job `87ee6d6c-b363-456e-9712-b08134001c64`) y `toma2-lateral.mp4` (job `eec46e80-47f2-4bcb-b18f-7214a99f0738`, primer plano 3/4): «La mayoría de mis clientes empiezan queriendo entrenar cinco días…».
- Coste: 4 × 67,5 = **270 créditos**.
