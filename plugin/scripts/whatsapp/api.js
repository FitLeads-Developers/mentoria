// Pure request parsing and response shaping for the read-only API. No whatsapp-web.js here.
import { contenido } from './format.js';

const CHATS = { def: 30, max: 200 };
const MESSAGES = { def: 50, max: 500 };
const PREVIEW_MAX = 80;

export function clampLimit(raw, def, max) {
  const n = Math.trunc(Number(raw));
  if (raw === null || raw === undefined || !Number.isFinite(n) || n < 1) return def;
  return Math.min(n, max);
}

export function parseChatsQuery(params) {
  return {
    limit: clampLimit(params.get('limit'), CHATS.def, CHATS.max),
    q: (params.get('q') ?? '').trim(),
  };
}

export function parseMessagesQuery(params) {
  const chatId = (params.get('chatId') ?? '').trim();
  if (!chatId) return { error: 'falta chatId' };
  const format = params.get('format') ?? 'json';
  if (format !== 'json' && format !== 'md') return { error: 'format debe ser json o md' };
  return { chatId, limit: clampLimit(params.get('limit'), MESSAGES.def, MESSAGES.max), format };
}

const normalizar = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const iso = (timestamp) => (timestamp ? new Date(timestamp * 1000).toISOString() : null);

function preview(lastMessage) {
  if (!lastMessage) return '';
  const texto = contenido(lastMessage).replace(/\s+/g, ' ');
  return texto.length > PREVIEW_MAX ? `${texto.slice(0, PREVIEW_MAX - 1)}…` : texto;
}

/** Most recent chats first, optionally filtered by name, shaped for JSON. */
export function selectChats(chats, { limit, q }) {
  const filtro = normalizar(q);
  return chats
    .filter((c) => !filtro || normalizar(c.name).includes(filtro))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, limit)
    .map((c) => ({
      id: c.id._serialized,
      name: c.name,
      isGroup: Boolean(c.isGroup),
      unreadCount: c.unreadCount || 0,
      lastMessageDate: iso(c.timestamp),
      preview: c.lastMessage ? preview(c.lastMessage) : '',
    }));
}

/** Oldest first; media never carries content, only a placeholder. */
export function shapeMessages(chatName, messages) {
  return [...messages]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((m) => ({
      timestamp: iso(m.timestamp),
      fromMe: Boolean(m.fromMe),
      author: m.fromMe ? 'Tú' : m.author || chatName,
      body: contenido(m),
    }));
}
