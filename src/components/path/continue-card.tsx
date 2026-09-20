'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { nextLesson } from '@/lib/progress-stats';
import { NameForm } from '@/components/home/name-form';
import styles from './continue-card.module.css';

/** Grande porte d'entrée : une seule décision à prendre en arrivant sur le site. */
export function ContinueCard() {
  const progress = useProgress();
  const mounted = useMounted();
  const lesson = mounted ? nextLesson(progress) : null;
  const started = mounted && Object.keys(progress.lessons).length > 0;
  const toReview = mounted ? progress.toReview.length : 0;
  const name = mounted ? progress.name : null;

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

  if (mounted && !lesson) {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>
          Tu as terminé tout le parcours{name ? `, ${name}` : ''} ! 👑
        </h2>
        <p className={styles.subtitle}>
          Garde ta série vivante avec une séance de révision, ou rejoue tes leçons préférées.
        </p>
        <Link href="/entrainement" className="bigButton">
          Réviser mes mots
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>
        {started ? `On continue${name ? `, ${name}` : ''} ?` : `Ciao ${name ?? ''} ! On commence ?`}
      </h2>
      <p className={styles.subtitle}>
        {lesson ? `${lesson.unit.emoji} ${lesson.unit.title} — ${lesson.title}` : 'Première leçon'}
      </p>
      <Link href={lesson ? `/lecon/${lesson.id}` : '/lecon/saluti-1'} className="bigButton">
        {started ? 'Continuer' : 'Commencer'}
      </Link>
      {toReview > 0 && (
        <Link href="/entrainement" className={styles.review}>
          🔁 {toReview} mot{toReview > 1 ? 's' : ''} à revoir
        </Link>
      )}
    </section>
  );
}
