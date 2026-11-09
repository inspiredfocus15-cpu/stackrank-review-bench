import { db } from './db.js';

export const PAGE_SIZE = 20;

export function listNotes(owner, page = 1) {
  const offset = (page - 1) * PAGE_SIZE;
  return db
    .prepare('SELECT id, title, created_at FROM notes WHERE owner = ? ORDER BY id LIMIT ? OFFSET ?')
    .all(owner, PAGE_SIZE, offset);
}

export function getNote(owner, id) {
  return db.prepare('SELECT * FROM notes WHERE owner = ? AND id = ?').get(owner, id);
}

export function createNote(owner, { title, body }) {
  const info = db.prepare('INSERT INTO notes (owner, title, body) VALUES (?, ?, ?)').run(owner, title, body);
  return getNote(owner, info.lastInsertRowid);
}

export function deleteNote(owner, id) {
  return db.prepare('DELETE FROM notes WHERE owner = ? AND id = ?').run(owner, id).changes > 0;
}

export function searchNotes(owner, q) {
  return db
    .prepare("SELECT id, title FROM notes WHERE owner = ? AND title LIKE ? ESCAPE '\\' ORDER BY id")
    .all(owner, `%${q.replace(/[\\%_]/g, (c) => '\\' + c)}%`);
}

export function purgeOwner(owner) {
  return db.prepare('DELETE FROM notes WHERE owner = ?').run(owner).changes;
}
