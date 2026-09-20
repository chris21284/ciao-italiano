'use client';

import Link from 'next/link';
import { findBadge } from '@/data/badges';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import type { LessonReward } from '@/lib/progress-store';
import { DAILY_GOAL_XP } from '@/lib/xp';
import styles from './lesson-summary.module.css';

interface LessonSummaryProps {
  reward: LessonReward;
  /** Leçon suivante, ou `null` quand le parcours est terminé. */
  nextLessonId: string | null;
  onReplay: () => void;
}

/** Écran de récompense : c'est lui qui donne envie de relancer une leçon. */
export function LessonSummary({ reward, nextLessonId, onReplay }: LessonSummaryProps) {
  const progress = useProgress();
  const mounted = useMounted();
  const name = mounted ? progress.name : null;

  return (
    <div className={styles.summary}>
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} className={styles.piece} data-piece={index % 4} />
        ))}
      </div>

      <h1 className={styles.title}>
        {reward.stars === 3 ? 'Perfetto' : 'Bravissima'}
        {name ? `, ${name}` : ''} ! {reward.stars === 3 ? '💎' : '🎉'}
      </h1>

      <p className={styles.stars} aria-label={`${reward.stars} étoiles sur 3`}>
        {Array.from({ length: 3 }, (_, index) => (
          <span
            key={index}
            className={styles.star}
            data-earned={index < reward.stars ? 'true' : 'false'}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            ⭐
          </span>
        ))}
      </p>

      <ul className={styles.cards}>
        <li className={styles.card}>
          <span className={styles.cardValue}>+{reward.xpGained}</span>
          <span className={styles.cardLabel}>XP gagnés</span>
        </li>
        <li className={styles.card}>
          <span className={styles.cardValue}>🔥 {reward.streak}</span>
          <span className={styles.cardLabel}>jours de suite</span>
        </li>
        <li className={styles.card}>
          <span className={styles.cardValue}>
            {Math.min(reward.xpToday, DAILY_GOAL_XP)}/{DAILY_GOAL_XP}
          </span>
          <span className={styles.cardLabel}>objectif du jour</span>
        </li>
      </ul>

      {reward.goalReached && <p className={styles.goal}>🎯 Objectif du jour atteint !</p>}

      {reward.newBadges.length > 0 && (
        <div className={styles.badges}>
          <h2 className={styles.badgesTitle}>Nouveau badge !</h2>
          <ul className={styles.badgeList}>
            {reward.newBadges.map((badgeId) => {
              const badge = findBadge(badgeId);
              if (!badge) return null;
              return (
                <li key={badge.id} className={styles.badge}>
                  <span className={styles.badgeEmoji} aria-hidden="true">
                    {badge.emoji}
                  </span>
                  {badge.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        {nextLessonId ? (
          <Link href={`/lecon/${nextLessonId}`} className="bigButton">
            Leçon suivante
          </Link>
        ) : (
          <Link href="/progres" className="bigButton">
            Voir mes trophées
          </Link>
        )}
        <button type="button" className={styles.secondary} onClick={onReplay}>
          Rejouer cette leçon
        </button>
        <Link href="/" className={styles.secondary}>
          Retour au parcours
        </Link>
      </div>
    </div>
  );
}
