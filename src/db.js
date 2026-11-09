import Database from 'better-sqlite3';

export const db = new Database(process.env.DB_PATH || ':memory:');
db.exec(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
db.exec(`CREATE TABLE IF NOT EXISTS shares (
  token TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  note_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
)`);
