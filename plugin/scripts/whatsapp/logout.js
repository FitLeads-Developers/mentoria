// Destruye la sesión local de WhatsApp. Después, desvincula también el dispositivo desde el móvil.
import fs from 'node:fs/promises';
import path from 'node:path';
import { DATA_DIR, HOST, PORT } from './config.js';

try {
  await fetch(`http://${HOST}:${PORT}/api/status`, { signal: AbortSignal.timeout(1500) });
  console.error(`El servidor sigue en marcha en el puerto ${PORT}. Páralo primero y vuelve a ejecutar esto.`);
  process.exit(1);
} catch {
  /* no hay servidor: seguimos */
}

await fs.rm(path.join(DATA_DIR, '.wwebjs_auth'), { recursive: true, force: true });
await fs.rm(path.join(DATA_DIR, '.wwebjs_cache'), { recursive: true, force: true });
console.log(`Sesión borrada de ${DATA_DIR}.`);
console.log('Falta un paso: en el móvil, WhatsApp → Dispositivos vinculados → toca este equipo → Cerrar sesión.');
