import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampLimit, parseChatsQuery, parseMessagesQuery, selectChats, shapeMessages } from './api.js';

const q = (s) => new URL(`http://x/${s}`).searchParams;
const T = Date.UTC(2026, 10, 14, 10, 32, 0) / 1000;

test('clampLimit uses the default for missing or invalid values', () => {
  assert.equal(clampLimit(null, 30, 200), 30);
  assert.equal(clampLimit('abc', 30, 200), 30);
  assert.equal(clampLimit('0', 30, 200), 30);
  assert.equal(clampLimit('-5', 30, 200), 30);
});

test('clampLimit caps at the maximum and truncates decimals', () => {
  assert.equal(clampLimit('999', 30, 200), 200);
  assert.equal(clampLimit('12.9', 30, 200), 12);
});

test('parseChatsQuery applies defaults and trims q', () => {
  assert.deepEqual(parseChatsQuery(q('?')), { limit: 30, q: '' });
  assert.deepEqual(parseChatsQuery(q('?limit=5&q=%20Marta%20')), { limit: 5, q: 'Marta' });
  assert.equal(parseChatsQuery(q('?limit=9999')).limit, 200);
});

test('parseMessagesQuery requires chatId', () => {
  assert.deepEqual(parseMessagesQuery(q('?limit=5')), { error: 'falta chatId' });
});

test('parseMessagesQuery defaults to 50 messages in json and caps at 500', () => {
  assert.deepEqual(parseMessagesQuery(q('?chatId=1@c.us')), { chatId: '1@c.us', limit: 50, format: 'json' });
  assert.equal(parseMessagesQuery(q('?chatId=1@c.us&limit=9999')).limit, 500);
});

test('parseMessagesQuery accepts format=md and rejects unknown formats', () => {
  assert.equal(parseMessagesQuery(q('?chatId=a&format=md')).format, 'md');
  assert.deepEqual(parseMessagesQuery(q('?chatId=a&format=xml')), { error: 'format debe ser json o md' });
});

const chat = (name, ts, extra = {}) => ({
  id: { _serialized: `${name}@c.us` },
  name,
  isGroup: false,
  unreadCount: 0,
  timestamp: ts,
  lastMessage: { body: 'hola', type: 'chat', fromMe: false },
  ...extra,
});

test('selectChats sorts by most recent first and shapes the fields', () => {
  const out = selectChats([chat('Ana', T), chat('Luis', T + 60)], { limit: 30, q: '' });
  assert.deepEqual(out.map((c) => c.name), ['Luis', 'Ana']);
  assert.deepEqual(out[1], {
    id: 'Ana@c.us',
    name: 'Ana',
    isGroup: false,
    unreadCount: 0,
    lastMessageDate: '2026-11-14T10:32:00.000Z',
    preview: 'hola',
  });
});

test('selectChats filters by name ignoring case and accents, then applies the limit', () => {
  const chats = [chat('Marta López', T), chat('MARTINA', T + 1), chat('Luis', T + 2)];
  assert.deepEqual(selectChats(chats, { limit: 30, q: 'mart' }).map((c) => c.name), ['MARTINA', 'Marta López']);
  assert.equal(selectChats(chats, { limit: 1, q: '' }).length, 1);
  assert.equal(selectChats(chats, { limit: 30, q: 'lopez' }).length, 1);
});

test('selectChats truncates long previews and uses placeholders for media', () => {
  const largo = chat('Ana', T, { lastMessage: { body: 'x'.repeat(200), type: 'chat', fromMe: true } });
  const preview = selectChats([largo], { limit: 1, q: '' })[0].preview;
  assert.ok(preview.length <= 80);
  assert.ok(preview.endsWith('…'));
  const audio = chat('Ana', T, { lastMessage: { body: '', type: 'ptt', fromMe: false } });
  assert.equal(selectChats([audio], { limit: 1, q: '' })[0].preview, '[audio]');
});

test('selectChats tolerates chats without messages or timestamp', () => {
  const vacio = chat('Vacío', 0, { lastMessage: undefined });
  const out = selectChats([vacio], { limit: 1, q: '' })[0];
  assert.equal(out.lastMessageDate, null);
  assert.equal(out.preview, '');
});

test('shapeMessages returns oldest first with ISO timestamps, authors and placeholders', () => {
  const out = shapeMessages('Marta', [
    { timestamp: T + 60, fromMe: true, body: 'Buenas', type: 'chat' },
    { timestamp: T, fromMe: false, author: null, body: '', type: 'image' },
  ]);
  assert.deepEqual(out, [
    { timestamp: '2026-11-14T10:32:00.000Z', fromMe: false, author: 'Marta', body: '[imagen]' },
    { timestamp: '2026-11-14T10:33:00.000Z', fromMe: true, author: 'Tú', body: 'Buenas' },
  ]);
});
