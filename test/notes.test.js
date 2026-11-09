import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNote, listNotes, deleteNote } from '../src/notes.js';

test('notes: create, list and delete', () => {
  const n = createNote('alice', { title: 't', body: 'b' });
  assert.equal(listNotes('alice').length, 1);
  assert.ok(deleteNote('alice', n.id));
});

test('shares: create and open a link', async () => {
  const { createShare, getShare } = await import('../src/share.js');
  const n = createNote('bob', { title: 'shared', body: 'hello' });
  const s = createShare('bob', n.id, 7);
  assert.equal(getShare(s.token).note_id, n.id);
});
