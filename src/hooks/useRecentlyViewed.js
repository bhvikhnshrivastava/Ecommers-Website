import { useCallback, useState } from 'react';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/utils/storage';

const MAX_RECENT = 8;

function readRecent() {
  const stored = readJSON(STORAGE_KEYS.recent, []);
  if (!Array.isArray(stored)) return [];
  return stored.map(Number).filter((id) => Number.isFinite(id));
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState(readRecent);

  const add = useCallback((id) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    setIds((previous) => {
      const next = [numericId, ...previous.filter((entry) => entry !== numericId)].slice(
        0,
        MAX_RECENT,
      );
      writeJSON(STORAGE_KEYS.recent, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeJSON(STORAGE_KEYS.recent, []);
    setIds([]);
  }, []);

  return { ids, add, clear };
}
