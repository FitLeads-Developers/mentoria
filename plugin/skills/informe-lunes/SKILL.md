---
name: informe-lunes
description: Prepara el informe del lunes a las 8:00 y explica cómo programarlo como Rutina de Claude para que se haga solo cada semana. Úsala cuando el alumno quiera un informe semanal automático de su negocio o hablar de Rutinas.
---

# El informe del lunes (Rutina)

Habla en español, tutea, frases cortas.

## Idea
Una **Rutina** es una receta que se ejecuta sola a una hora. Aquí: cada lunes a las 8:00, un informe de la semana que empieza. Empieza siempre con **permisos de solo lectura**.

## Qué hacer

1. **Define el informe** con el alumno, en pocas líneas: qué quiere ver (agenda de la semana, clientes con señales de baja, renovaciones próximas, correos pendientes) y de qué fuentes (Calendar, Gmail, Drive, carpeta `clientes/`).
2. **Pruébalo a mano una vez** y ajústalo hasta que sea útil. Una rutina que no has probado no se programa.
3. **Programa la Rutina** con la skill `schedule` (rutinas en la nube) o desde la configuración de Rutinas de Claude: lunes, 8:00, hora de España. Si el alumno prefiere que corra en su ordenador, explícale que entonces debe estar encendido.
4. Dile cómo **ver, pausar y borrar** la rutina.
5. No incluyas acciones que envíen o borren cosas. Si el alumno lo quiere más adelante, ese es otro paso y con confirmación.
6. Cuando salga un informe real, revísalo con él: ¿le ha servido? Si no, se ajusta.

## Ejemplo para copiar

```
Quiero un informe cada lunes a las 8:00. Que mire mi calendario de la semana, los correos pendientes y
la carpeta clientes/ para decirme qué clientes tienen señales de baja (más de 7 días sin responder) y
qué renovaciones vencen este mes. Solo lectura. Primero haz una prueba ahora y, si me convence,
prográmalo como rutina.
```
