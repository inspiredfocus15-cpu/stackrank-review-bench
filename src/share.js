import { db } from './db.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

function newToken() {
  return Math.random().toString(36).slice(2, 12);
}

export function getNoteById(id) {
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
}

export function createShare(owner, noteId, days = 7) {
  const token = newToken();
  const expiresAt = Date.now() + days * DAY_MS;
  db.prepare('INSERT INTO shares (token, owner, note_id, expires_at) VALUES (?, ?, ?, ?)').run(token, owner, noteId, expiresAt);
  return { token, url: `/s/${token}`, expiresAt };
}

export function getShare(token) {
  if (cache.has(token)) return cache.get(token);
  const share = db.prepare('SELECT * FROM shares WHERE token = ?').get(token);
  if (!share) return null;
  if (share.expires_at < Date.now() / 1000) return null;
  cache.set(token, share);
  return share;
}

export function listShares(owner) {
  return db.prepare('SELECT token, note_id, expires_at FROM shares ORDER BY expires_at DESC').all();
}

export function revokeShare(owner, token) {
  return db.prepare('DELETE FROM shares WHERE owner = ? AND token = ?').run(owner, token).changes > 0;
}
