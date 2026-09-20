'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { dueToday, nextLesson } from '@/lib/progress-stats';
import { dailyRatio, isDailyGoalReached, minutesFromSeconds } from '@/lib/daily';
import { dayKey } from '@/lib/day';
import { ProgressRing } from '@/components/ui/progress-ring';
import { NameForm } from './name-form';
import styles from './daily-card.module.css';

/**
 * La carte de la séance du jour : une seule décision à prendre en arrivant.
 * Elle propose d'abord les révisions dues, puis la leçon suivante, et annonce
 * la fin de la séance une fois les minutes du jour faites — c'est ce qui étale
 * le parcours sur des mois au lieu de le consommer d'un trait.
 */
export function DailyCard() {
  const progress = useProgress();
  const mounted = useMounted();
  const [keepGoing, setKeepGoing] = useState(false);

  const today = dayKey();
  const secondsToday = mounted && progress.lastDay === today ? progress.secondsToday : 0;
  const lesson = mounted ? nextLesson(progress) : null;
  const dueCount = mounted ? dueToday(progress).length : 0;
  const name = mounted ? progress.name : null;
  const started = mounted && Object.keys(progress.lessons).length > 0;

  // Tout premier lancement : on demande le prénom avant de proposer une leçon,
  // pour que l'accueil s'adresse à elle dès la première seconde.
  if (mounted && name === null) {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>Ciao ! 👋</h2>
        <p className={styles.subtitle}>Comment tu t’appelles ?</p>
        <NameForm submitLabel="C’est parti !" />
      </section>
    );
  }

  if (mounted && isDailyGoalReached(secondsToday) && !keepGoing) {
    return (
      <section className={`${styles.card} ${styles.done}`}>
        <p className={styles.moon} aria-hidden="true">
          🌙
        </p>
        <h2 className={styles.title}>Séance terminée{name ? `, ${name}` : ''} !</h2>
        <p className={styles.subtitle}>
          Tu as travaillé {minutesFromSeconds(secondsToday)} minutes aujourd’hui. Le mieux
          maintenant, c’est de revenir demain : ton cerveau range tout pendant la nuit.
        </p>
        <button type="button" className={styles.secondary} onClick={() => setKeepGoing(true)}>
          Encore un peu ?
        </button>
      </section>
    );
  }

  const reviewFirst = dueCount > 0;

  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <ProgressRing
          ratio={dailyRatio(secondsToday)}
          label={`Séance du jour : ${minutesFromSeconds(secondsToday)} minutes sur 12`}
        >
          {minutesFromSeconds(secondsToday)}′
        </ProgressRing>
        <div>
          <h2 className={styles.title}>
            {started ? `On continue${name ? `, ${name}` : ''} ?` : `Ciao ${name ?? ''} !`}
          </h2>
          <p className={styles.subtitle}>
            {reviewFirst
              ? `${dueCount} mot${dueCount > 1 ? 's' : ''} à revoir aujourd’hui`
              : lesson
                ? `${lesson.unit.emoji} ${lesson.unit.title} — ${lesson.title}`
                : 'Tout le parcours est terminé ! 👑'}
          </p>
        </div>
      </header>

      {reviewFirst ? (
        <>
          <Link href="/entrainement/jouer" className="bigButton">
            🔁 Réviser mes mots
          </Link>
          {lesson && (
            <Link href={`/lecon/${lesson.id}`} className={styles.secondaryLink}>
              Passer à la leçon suivante
            </Link>
          )}
        </>
      ) : (
        <>
          <Link href={lesson ? `/lecon/${lesson.id}` : '/entrainement/jouer'} className="bigButton">
            {lesson ? (started ? 'Continuer' : 'Commencer') : 'Réviser mes mots'}
          </Link>
          {lesson && started && (
            <Link href="/entrainement/jouer" className={styles.secondaryLink}>
              Réviser quand même
            </Link>
          )}
        </>
      )}
    </section>
  );
}
