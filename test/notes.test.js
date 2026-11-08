import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNote, listNotes, deleteNote } from '../src/notes.js';

test('notes: create, list and delete', () => {
  const n = createNote('alice', { title: 't', body: 'b' });
  assert.equal(listNotes('alice').length, 1);
  assert.ok(deleteNote('alice', n.id));
});
