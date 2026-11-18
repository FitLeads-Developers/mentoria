import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatToMarkdown } from './format.js';

// 2026-11-14 10:32:00 UTC = 11:32 en Madrid (CET, UTC+1)
const T = Date.UTC(2026, 10, 14, 10, 32, 0) / 1000;
const MIN = 60;
const DAY = 86400;

test('empieza con el título del chat', () => {
  const md = chatToMarkdown('Marta', []);
  assert.match(md, /^# Chat con Marta\n/);
});

test('chat vacío indica que no hay mensajes', () => {
  assert.match(chatToMarkdown('Marta', []), /_Sin mensajes_/);
});

test('agrupa por fecha con un encabezado por día', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T, fromMe: false, author: null, body: 'Hola', type: 'chat' },
    { timestamp: T + DAY, fromMe: true, author: null, body: 'Buenas', type: 'chat' },
  ]);
  assert.match(md, /## 2026-11-14\n/);
  assert.match(md, /## 2026-11-15\n/);
});

test('usa Tú para mis mensajes y el nombre del chat para los del cliente', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T, fromMe: false, author: null, body: 'Hola', type: 'chat' },
    { timestamp: T + MIN, fromMe: true, author: null, body: 'Buenas', type: 'chat' },
  ]);
  assert.match(md, /- \*\*11:32 · Marta:\*\* Hola/);
  assert.match(md, /- \*\*11:33 · Tú:\*\* Buenas/);
});

test('en grupos usa el autor del mensaje', () => {
  const md = chatToMarkdown('Grupo', [
    { timestamp: T, fromMe: false, author: 'Luis', body: 'Hola', type: 'chat' },
  ]);
  assert.match(md, /· Luis:\*\* Hola/);
});

test('sustituye los mensajes multimedia por marcadores', () => {
  const casos = [
    ['ptt', '[audio]'],
    ['audio', '[audio]'],
    ['image', '[imagen]'],
    ['video', '[vídeo]'],
    ['document', '[documento]'],
    ['sticker', '[sticker]'],
  ];
  for (const [type, marcador] of casos) {
    const md = chatToMarkdown('Marta', [
      { timestamp: T, fromMe: false, author: null, body: '', type },
    ]);
    assert.ok(md.includes(`Marta:** ${marcador}`), `${type} -> ${marcador}`);
  }
});

test('conserva el texto que acompaña a un archivo', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T, fromMe: false, author: null, body: 'Mira mi rodilla', type: 'image' },
  ]);
  assert.match(md, /\[imagen\] Mira mi rodilla/);
});

test('ordena los mensajes por hora aunque lleguen desordenados', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T + MIN, fromMe: true, author: null, body: 'segundo', type: 'chat' },
    { timestamp: T, fromMe: false, author: null, body: 'primero', type: 'chat' },
  ]);
  assert.ok(md.indexOf('primero') < md.indexOf('segundo'));
});

test('los mensajes de varias líneas siguen dentro de su viñeta', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T, fromMe: false, author: null, body: 'línea 1\nlínea 2', type: 'chat' },
  ]);
  assert.match(md, /Marta:\*\* línea 1\n {2}línea 2/);
});

test('un tipo desconocido sin texto se marca como [mensaje no soportado]', () => {
  const md = chatToMarkdown('Marta', [
    { timestamp: T, fromMe: false, author: null, body: '', type: 'raro' },
  ]);
  assert.match(md, /\[mensaje no soportado\]/);
});

test('es una función pura: no modifica la lista recibida', () => {
  const msgs = [
    { timestamp: T + MIN, fromMe: true, author: null, body: 'b', type: 'chat' },
    { timestamp: T, fromMe: false, author: null, body: 'a', type: 'chat' },
  ];
  const copia = structuredClone(msgs);
  chatToMarkdown('Marta', msgs);
  assert.deepEqual(msgs, copia);
});
