import { useCallback, useState } from 'react';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/utils/storage';

const MAX_SEARCHES = 5;

function readSearches() {
  const stored = readJSON(STORAGE_KEYS.searches, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter((term) => typeof term === 'string' && term.trim()).slice(0, MAX_SEARCHES);
}

export function useRecentSearches() {
  const [searches, setSearches] = useState(readSearches);

  const addSearch = useCallback((term) => {
    const clean = String(term ?? '').trim();
    if (!clean) return;
    setSearches((previous) => {
      const next = [
        clean,
        ...previous.filter((entry) => entry.toLowerCase() !== clean.toLowerCase()),
      ].slice(0, MAX_SEARCHES);
      writeJSON(STORAGE_KEYS.searches, next);
      return next;
    });
  }, []);

  const clearSearches = useCallback(() => {
    writeJSON(STORAGE_KEYS.searches, []);
    setSearches([]);
  }, []);

  return { searches, addSearch, clearSearches };
}
