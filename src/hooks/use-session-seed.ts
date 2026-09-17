'use client';

import { useSyncExternalStore } from 'react';
import * as sessionSeed from '@/lib/session-seed';

/** Graine de la séance en cours — `0` tant qu'on n'est pas côté navigateur. */
export function useSessionSeed(): number {
  return useSyncExternalStore(
    sessionSeed.subscribe,
    sessionSeed.getSnapshot,
    sessionSeed.getServerSnapshot,
  );
}
