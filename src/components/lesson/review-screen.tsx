'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { allWords, findWord } from '@/data/units';
import { buildReviewExercises } from '@/lib/exercise-builder';
import { getSnapshot, recordReview } from '@/lib/progress-store';
import { dueToday, learnedWordIds } from '@/lib/progress-stats';
import { useSessionSeed } from '@/hooks/use-session-seed';
import { SessionRunner, type SessionResult } from './session-runner';
import styles from './review-screen.module.css';

/**
 * Séance de révision : sans cœurs ni étoiles, parce qu'elle doit rester un
 * filet de sécurité qu'on ouvre sans crainte — les XP, eux, comptent.
 */
export function ReviewScreen() {
  const seed = useSessionSeed();
  const [xpGained, setXpGained] = useState<number | null>(null);

  const exercises = useMemo(() => {
    if (seed === 0) return [];
    // Lecture ponctuelle de la progression plutôt qu'abonnement : la séance est
    // tirée une fois pour toutes, sinon la moindre réponse enregistrée en
    // changerait les questions en plein milieu.
    const progress = getSnapshot();
    const due = dueToday(progress)
      .map(findWord)
      .filter((word) => word !== undefined);
    const learned = new Set(learnedWordIds(progress));
    const seen = allWords.filter((word) => learned.has(word.id));
    // La séance s'adapte : au moins dix questions, et jusqu'à vingt quand les
    // révisions se sont accumulées.
    const size = Math.min(Math.max(due.length, 10), 20);
    // Sans leçon terminée, on révise quand même sur les tout premiers mots.
    return buildReviewExercises(due, seen.length > 0 ? seen : allWords.slice(0, 12), seed, size);
  }, [seed]);

  function handleFinish(result: SessionResult) {
    const { xpGained: gained } = recordReview(result);
    setXpGained(gained);
  }

  if (xpGained !== null) {
    return (
      <div className={styles.done}>
        <p className={styles.emoji} aria-hidden="true">
          🔁
        </p>
        <h1 className={styles.title}>Révision terminée !</h1>
        <p className={styles.xp}>+{xpGained} XP</p>
        <Link href="/" className="bigButton">
          Retour au parcours
        </Link>
      </div>
    );
  }

  if (exercises.length === 0) {
    return <p className={styles.loading}>On prépare la révision...</p>;
  }

  return (
    <SessionRunner
      key={seed}
      exercises={exercises}
      hearts={null}
      onFinish={handleFinish}
      backHref="/entrainement"
    />
  );
}
