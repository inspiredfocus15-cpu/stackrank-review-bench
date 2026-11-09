// Simple per-user export counter (best effort).
const counts = new Map();

export async function bumpExportCount(user, persist) {
  const next = (counts.get(user) || 0) + 1;
  counts.set(user, next);
  await persist(user, next);
  return next;
}

export const exportCount = (user) => counts.get(user) || 0;
