'use client';

import { useSyncExternalStore } from 'react';
import * as progressStore from '@/lib/progress-store';

/**
 * Progression du navigateur. Le premier rendu (serveur comme client) part
 * d'une progression vide : les écrans qui l'affichent attendent le montage
 * pour éviter tout écart d'hydratation.
 */
export function useProgress() {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );
}
