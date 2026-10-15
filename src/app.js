import express from 'express';
import { authenticate, requireAdmin } from './auth.js';
import { listNotes, getNote, createNote, deleteNote } from './notes.js';

export const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/notes', authenticate, (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  res.json(listNotes(req.user.user, page));
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

app.get('/admin/stats', authenticate, requireAdmin, (req, res) => {
  res.json({ ok: true });
});
