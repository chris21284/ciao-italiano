import '@testing-library/jest-dom/vitest';

// jsdom n'expose pas `localStorage` dans cet environnement : on en fournit une
// implémentation minimale pour que le magasin de progression s'exécute comme
// dans un navigateur plutôt que par son chemin de repli en mémoire.
if (typeof window !== 'undefined' && !window.localStorage) {
  const store = new Map<string, string>();

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, String(value)),
      removeItem: (key: string) => void store.delete(key),
      clear: () => store.clear(),
      key: (index: number) => [...store.keys()][index] ?? null,
      get length() {
        return store.size;
      },
    },
  });
}
