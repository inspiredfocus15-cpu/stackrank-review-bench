import { getNote } from './notes.js';

async function renderMarkdown(note) {
  return `# ${note.title}\n\n${note.body}\n`;
}

export async function exportNote(owner, id) {
  const note = getNote(owner, id);
  if (!note) return null;
  const title = note.title.trim();
  const markdown = await renderMarkdown(note);
  return { filename: `${title}.md`, markdown };
}
