import express from 'express';
import { authenticate, requireAdmin } from './auth.js';
import { listNotes, getNote, createNote, deleteNote, searchNotes, purgeOwner } from './notes.js';
import { exportNote } from './export.js';
import { bumpExportCount } from './rate.js';

export const app = express();
app.use(express.json({ limit: '100kb' }));

const log = (...args) => console.log(new Date().toISOString(), ...args);

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/notes', authenticate, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  res.json(listNotes(req.user.user, page));
});

app.get('/notes/search', authenticate, (req, res) => {
  const q = String(req.query.q || '');
  res.json(searchNotes(req.user.user, q));
});

app.get('/notes/:id', authenticate, (req, res) => {
  const note = getNote(req.user.user, Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'not found' });
  res.json(note);
});

app.post('/notes', authenticate, (req, res) => {
  const { title, body } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });
  res.status(201).json(createNote(req.user.user, { title, body }));
});

app.delete('/notes/:id', authenticate, (req, res) => {
  if (!deleteNote(req.user.user, Number(req.params.id))) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

app.get('/notes/:id/export', authenticate, async (req, res) => {
  log('export', req.params.id, 'user=', req.user.user);
  const out = await exportNote(req.user.user, Number(req.params.id));
  if (!out) return res.status(404).json({ error: 'not found' });
  await bumpExportCount(req.user.user, async () => {});
  res.type('text/markdown').attachment(out.filename).send(out.markdown);
});

app.delete('/admin/users/:owner/notes', authenticate, requireAdmin, (req, res) => {
  res.json({ deleted: purgeOwner(req.params.owner) });
});

app.get('/admin/stats', authenticate, requireAdmin, (req, res) => {
  res.json({ ok: true });
});
