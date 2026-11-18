# Mentoría IA para entrenadores

Plugin de Claude Code con todo lo que se enseña en el curso: instalación guiada, fichas de clientes, lector de WhatsApp en tu ordenador y una skill por clase.

## Instalar

En Claude Code, una sola vez:

```
/plugin marketplace add FitLeads-Developers/mentoria
/plugin install mentoria@fitleads
```

Después, reinicia Claude Code y escribe:

```
/mentoria:instalar
```

## Qué incluye

| Comando | Para qué sirve | Clase |
|---|---|---|
| `/mentoria:instalar` | Prepara tu ordenador, cuentas y conectores, paso a paso | 2 |
| `/mentoria:cliente` | Una carpeta por cliente: ficha, revisiones, promesas, señales de baja | 3, 5 |
| `/mentoria:whatsapp` | Lee y exporta chats de clientes (solo lectura, en local) | 5 |
| `/mentoria:revision-semanal` | Resumen de la semana y mensaje para el cliente | 4 |
| `/mentoria:objeciones` | Respuestas honestas a «es caro», «lo pienso»… | 4 |
| `/mentoria:notebooklm` | Prompts para estudios, podcast y preguntas sobre tu método | 6 |
| `/mentoria:ideas-contenido` | Ideas de contenido desde dudas reales, anonimizadas | 7 |
| `/mentoria:reel` | Edita tu vídeo con Remotion: subtítulos y marca | 8 |
| `/mentoria:imagenes-personaje` | Imágenes coherentes de un personaje con Higgsfield | 9 |
| `/mentoria:prepara-el-dia` | Agenda, correos y documentos con Gmail, Calendar y Drive | 10 |
| `/mentoria:informe-lunes` | El informe del lunes a las 8:00 como Rutina | 11 |
| `/mentoria:lead-magnet` | Guía de 1 página y landing a partir de un problema real | 12 |

Si no usas Claude Code, los prompts de cada clase están en [`prompts.md`](prompts.md) para pegarlos en la app de Claude o en ChatGPT.

## Importante sobre WhatsApp

La skill `whatsapp` no es oficial: WhatsApp no permite clientes no oficiales y puede bloquear el número. Es de solo lectura y solo para chats de clientes con consentimiento RGPD. Lee el aviso de la skill antes de usarla.

## Para quien mantiene el plugin

- Tests del formateador de chats: `cd plugin/scripts/whatsapp && node --test`
- Validar: `claude plugin validate .`

## Ejemplo: Dani Vega

`ejemplo/entrenador-ia/` es el entrenador de ejemplo del curso (personaje 100 % IA): ficha de marca (`marca.md`), hoja de personaje, referencias, looks y vídeos en bruto para practicar la edición. Las skills buscan `entrenador-ia/marca.md`: copia esa carpeta a tu proyecto para probarlas con Dani. Si lo publicas fuera del curso, indica que está creado con IA.
