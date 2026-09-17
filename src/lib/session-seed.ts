/**
 * Graine du tirage des questions. L'horloge ne peut pas être lue pendant le
 * rendu (React exige des composants purs) ni au rendu serveur (l'hydratation
 * ne concorderait pas) : elle vit donc dans un petit magasin externe, lu par
 * `useSyncExternalStore` comme l'est la progression.
 */
let seed = 0;
const listeners = new Set<() => void>();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): number {
  // Première lecture côté navigateur : on fige la graine de la séance.
  if (seed === 0) seed = Date.now();
  return seed;
}

/** Côté serveur, aucune graine : les écrans de jeu attendent le navigateur. */
export function getServerSnapshot(): number {
  return 0;
}

/** Nouvelle séance : d'autres questions, dans un autre ordre. */
export function renewSeed() {
  seed = Date.now() + Math.floor(Math.random() * 1000) + 1;
  for (const listener of listeners) listener();
}
