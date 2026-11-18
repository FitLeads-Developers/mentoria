---
name: prepara-el-dia
description: Prepara el día del entrenador con los conectores de Gmail, Google Calendar y Google Drive: agenda de hoy, correos que necesitan respuesta y documentos de los clientes que vienen. Úsala cuando el alumno diga «prepárame el día» o pida un resumen de su agenda y correo.
---

# Prepárame el día

Habla en español, tutea, frases cortas.

## Requisitos
Conectores Gmail, Google Calendar y Google Drive activados en Claude (Settings → Connectors). Si falta alguno, dilo y sigue con los que haya. Usa la skill `instalar` si no los tiene.

## Qué hacer

1. **Calendar:** lista los eventos de hoy en orden, con hora y persona. Marca huecos largos y solapamientos.
2. **Gmail:** busca correos recientes que pidan respuesta (últimas 24–48 h, sin leer o con pregunta). Resume cada uno en una línea y propón la respuesta; **no envíes nada**: deja borradores solo si el alumno lo pide.
3. **Drive:** para cada cliente que tenga cita hoy, busca su documento o ficha y resume en 2 líneas lo último (plan, lesiones, promesas). Si no encuentras nada, dilo.
4. Entrega: **Hoy** (agenda), **Responder** (correos), **Antes de cada cita** (por cliente), **Un recordatorio** útil.
5. Solo lectura por defecto. Nada de enviar, borrar ni mover sin confirmación expresa.

## Ejemplo para copiar

```
Prepárame el día. Mira mi calendario de hoy, los correos que necesitan respuesta (resúmelos y propón
una respuesta, sin enviar nada) y, para cada cliente con cita hoy, busca su documento en Drive y dime
lo último: plan, molestias y qué le prometí. Por ejemplo, la sesión de las 18:00 con Marta (rodilla operada).
```
