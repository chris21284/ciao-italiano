'use client';

import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { currentStreak, dayKey } from '@/lib/day';
import { levelProgress } from '@/lib/xp';
import { dailyRatio, minutesFromSeconds } from '@/lib/daily';
import { ProgressRing } from '@/components/ui/progress-ring';
import styles from './top-bar.module.css';

/** Bandeau de statistiques : série, niveau et objectif du jour. */
export function TopBar() {
  const progress = useProgress();
  const mounted = useMounted();
  const today = dayKey();
  const streak = mounted ? currentStreak(progress.streak, progress.lastDay, today) : 0;
  const secondsToday = mounted && progress.lastDay === today ? progress.secondsToday : 0;
  const level = levelProgress(mounted ? progress.xp : 0);

  return (
    <header className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.emoji} aria-hidden="true">
          🔥
        </span>
        <span className={styles.value}>{streak}</span>
        <span className={styles.label}>jours</span>
      </div>

      <div className={styles.level}>
        <span className={styles.levelTitle}>
          Niveau {level.level} · {level.title}
        </span>
        <span className={styles.gauge} aria-hidden="true">
          <span className={styles.gaugeFill} style={{ width: `${level.ratio * 100}%` }} />
        </span>
        <span className={styles.label}>
          {level.xpInLevel} / {level.xpForNextLevel} XP
        </span>
      </div>

      <ProgressRing
        ratio={dailyRatio(secondsToday)}
        label={`Séance du jour : ${minutesFromSeconds(secondsToday)} minutes sur 12`}
      >
        {dailyRatio(secondsToday) >= 1 ? '✅' : `${minutesFromSeconds(secondsToday)}′`}
      </ProgressRing>
    </header>
  );
}
