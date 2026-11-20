import os from 'node:os';
import path from 'node:path';

export const HOST = '127.0.0.1';
export const PORT = Number(process.env.PORT) || 3977;

function arg(nombre) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

// Carpeta de datos (sesión de WhatsApp). Por defecto ~/.fitleads-whatsapp
export const DATA_DIR = path.resolve(
  arg('data-dir') || process.env.FITLEADS_WA_DATA || path.join(os.homedir(), '.fitleads-whatsapp'),
);
