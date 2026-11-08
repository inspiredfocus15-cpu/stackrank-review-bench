// Simple per-user export counter (best effort).
const counts = new Map();

export async function bumpExportCount(user, persist) {
  const current = counts.get(user) || 0;
  await persist(user, current + 1);
  counts.set(user, current + 1);
  return current + 1;
}

export const exportCount = (user) => counts.get(user) || 0;
