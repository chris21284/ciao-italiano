'use client';

import { useSyncExternalStore } from 'react';

/** Rien à écouter : l'« état externe » observé est simplement le fait d'être
 *  passé côté navigateur. */
const noopSubscribe = () => () => {};

/**
 * `false` au rendu serveur et au premier rendu client, `true` ensuite : ce qui
 * dépend du stockage local n'est affiché qu'après l'hydratation, sans écart
 * entre les deux rendus.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
