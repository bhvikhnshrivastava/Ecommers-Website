import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Ecaspian` : 'Ecaspian — Curated for the extraordinary';
  }, [title]);
}
