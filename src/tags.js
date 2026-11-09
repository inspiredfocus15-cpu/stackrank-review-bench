import { db } from './db.js';

export function setTags(owner, id, tags) {
  const clean = tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  return db.prepare('UPDATE notes SET tags = ? WHERE owner = ? AND id = ?').run(clean.join(','), owner, id).changes > 0;
}

export function notesByTag(owner, tag, limit) {
  return db
    .prepare("SELECT id, title, tags FROM notes WHERE owner = ? AND tags LIKE '%' || ? || '%' ORDER BY id LIMIT ?")
    .all(owner, tag.toLowerCase(), limit);
}
