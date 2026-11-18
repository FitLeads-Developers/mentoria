---
name: revision-semanal
description: Prepara la revisión semanal de un cliente: resume la semana, detecta lo importante y redacta el mensaje de WhatsApp para enviarlo. Úsala cuando el alumno diga «revisión de [cliente]», «prepárame la revisión» o pegue datos de la semana de una persona.
argument-hint: "[nombre del cliente]"
effort: medium
---

# Revisión semanal

Habla en español, tutea, frases cortas. No inventes datos de la persona: si falta algo, pregunta.

## Qué hacer

1. Si existe `clientes/<nombre>/`, lee `ficha.md`, `revisiones.md`, `promesas.md` y el chat más reciente. Si no, pide al alumno lo que tenga (notas, mensajes de la semana).
2. Pregunta solo lo que falte: sesiones hechas, cómo se ha sentido, molestias.
3. Entrega, en este orden:
   - **Resumen** de la semana en 3 líneas.
   - **Una cosa a celebrar** (concreta, real).
   - **Una cosa a ajustar** para la próxima semana.
   - **Alertas**: dolor nuevo, faltas repetidas, tono bajo. Si hay dolor en una zona operada o lesionada, recomienda consultar con su fisioterapeuta o médico y no ajustes la carga a ciegas.
   - **Borrador del mensaje de WhatsApp**: cercano, sin culpa ni presión, máximo 6 líneas.
4. Si la skill `cliente` está disponible, ofrece guardar la revisión en `revisiones.md`.

El mensaje lo envía el alumno, tú no.

## Ejemplo para copiar

```
Prepárame la revisión semanal de Marta (45 años, rodilla operada hace un año, asesoría de 200 €/mes).
Esta semana hizo 2 de 3 sesiones, dice que la rodilla "molesta un poco al bajar escaleras" y que está
cansada por el trabajo. Dame: resumen en 3 líneas, algo que celebrar, un ajuste para la próxima semana,
alertas y un mensaje de WhatsApp de máximo 6 líneas, cercano y sin presión.
```
