---
name: cliente
description: Organiza a cada cliente de un entrenador en su carpeta (ficha, revisiones, promesas y chats). Crea clientes, añade revisiones semanales, responde «¿qué le prometí a X?», detecta señales de baja y resume la cartera. Úsala cuando el alumno hable de sus clientes, fichas, promesas o riesgo de baja.
argument-hint: "[crear | revisión | promesas | bajas | cartera] [nombre]"
---

# Clientes: una carpeta por persona

Habla en español, tutea, frases cortas. **No inventes datos:** si falta algo, pregunta.

## Estructura

```
clientes/
  nombre-apellido/
    ficha.md
    revisiones.md
    promesas.md
    chats/        <- chats exportados de WhatsApp en markdown
```

Nombres de carpeta en minúsculas, sin tildes ni espacios (`marta-lopez`). Trabaja dentro de la carpeta actual; si no existe `clientes/`, ofrécete a crearla.

## Datos sensibles
Los datos de salud (lesiones, operaciones) son **sensibles** según el RGPD. Todo se queda en este ordenador. Guarda solo lo mínimo necesario para entrenar. No los subas a ningún sitio sin que el alumno lo decida. Sin consentimiento registrado en la ficha, no guardes chats de esa persona.

## Acciones

### Crear cliente
Pregunta uno a uno lo que falte (nombre, objetivo, lesiones, plan, precio, fechas, consentimiento). Crea la carpeta y la `ficha.md` con la plantilla de abajo, `revisiones.md` y `promesas.md` con solo su título, y `chats/` vacía. Lo que no sepa el alumno se queda como `—`.

### Añadir revisión
Añade al final de `revisiones.md` una entrada con la fecha de hoy:

```
## AAAA-MM-DD
- Sesiones hechas / planificadas:
- Cómo se ha sentido:
- Molestias o cambios:
- Ajuste para la próxima semana:
```
Rellénala con lo que cuente el alumno. Si hay algo que prometió, anótalo también en `promesas.md`.

### «¿Qué le prometí a X?»
Lee `promesas.md` y los chats de esa persona. Responde con una lista: promesa, fecha y si consta como cumplida. Cita de qué archivo sale cada cosa. Si no aparece nada, dilo; no supongas.

### Señales de baja
Recorre todos los clientes y busca:
- No responde desde hace **más de 7 días** (fecha del último mensaje suyo en `chats/`).
- Se salta sesiones (revisiones con menos sesiones hechas que planificadas, varias veces seguidas).
- Tono negativo en los últimos mensajes (cansancio, «no puedo», «lo dejo», silencios).

Devuelve una tabla: cliente, señal, evidencia (fecha o frase), acción sugerida. Ordena de más a menos urgente. Son pistas, no condenas: dilo así.

### Resumen de cartera
Tabla con una fila por cliente: plan, precio/mes, fecha de fin, última revisión, estado (bien / atención / riesgo) y total mensual. Avisa de datos que faltan.

## Plantilla de `ficha.md`

```
# Ficha: <Nombre Apellido>

## Datos básicos
- Edad:
- Teléfono / contacto:

## Objetivo
-

## Lesiones y limitaciones
-

## Plan actual
-

## Precio y fechas
- Precio: __ €/mes
- Inicio:
- Fin / renovación:

## Consentimiento RGPD
- Ha dado consentimiento: sí / no
- Fecha:
```
