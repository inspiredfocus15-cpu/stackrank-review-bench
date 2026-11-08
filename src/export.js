import { getNote } from './notes.js';

async function renderMarkdown(note) {
  return `# ${note.title}\n\n${note.body}\n`;
}

export async function exportNote(owner, id) {
  const note = getNote(owner, id);
  const title = note.title.trim();
  const markdown = renderMarkdown(note);
  return { filename: `${title}.md`, markdown };
}
