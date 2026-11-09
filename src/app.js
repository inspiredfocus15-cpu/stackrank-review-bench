import express from 'express';
import { authenticate, requireAdmin } from './auth.js';
import { listNotes, getNote, createNote, deleteNote, searchNotes, purgeOwner } from './notes.js';
import { exportNote } from './export.js';
import { bumpExportCount } from './rate.js';
import { createShare, getShare, getNoteById, listShares, revokeShare } from './share.js';
import { setTags, notesByTag } from './tags.js';
import { rateLimit } from './ratelimit.js';

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

app.get('/notes/by-tag', authenticate, (req, res) => {
  const tag = String(req.query.tag || '').trim();
  if (!tag) return res.status(400).json({ error: 'tag required' });
  const limit = Number(req.query.limit) || 50;
  res.json(notesByTag(req.user.user, tag, limit));
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

app.put('/notes/:id/tags', authenticate, (req, res) => {
  const { tags } = req.body || {};
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags must be an array' });
  if (!setTags(req.user.user, Number(req.params.id), tags)) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

app.post('/notes/:id/share', authenticate, (req, res) => {
  const note = getNoteById(Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'not found' });
  const days = Math.min(30, Math.max(1, parseInt(req.body?.days, 10) || 7));
  res.status(201).json(createShare(req.user.user, note.id, days));
});

app.get('/shares', authenticate, (req, res) => {
  res.json(listShares(req.user.user));
});

app.delete('/shares/:token', authenticate, (req, res) => {
  if (!revokeShare(req.user.user, req.params.token)) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// Public, read-only page for a shared note. No login needed.
app.get('/s/:token', rateLimit, async (req, res) => {
  const share = getShare(req.params.token);
  if (!share) return res.status(404).send('Link not found or expired');
  const note = await Promise.resolve(getNoteById(share.note_id));
  res.type('html').send(`<!doctype html><title>${note.title}</title><h1>${note.title}</h1><article>${note.body}</article>`);
});

app.delete('/admin/users/:owner/notes', authenticate, requireAdmin, (req, res) => {
  res.json({ deleted: purgeOwner(req.params.owner) });
});

app.get('/admin/stats', authenticate, requireAdmin, (req, res) => {
  res.json({ ok: true });
});
