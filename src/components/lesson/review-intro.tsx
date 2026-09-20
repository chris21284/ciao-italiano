'use client';

import Link from 'next/link';
import { findWord } from '@/data/units';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { dueToday } from '@/lib/progress-stats';
import { speakItalian } from '@/lib/speak';
import styles from './review-intro.module.css';

/** Page d'entrée de la révision : les mots dont la fiche tombe aujourd'hui,
 *  à relire avant de se lancer. */
export function ReviewIntro() {
  const progress = useProgress();
  const mounted = useMounted();
  const words = mounted
    ? dueToday(progress)
        .map(findWord)
        .filter((word) => word !== undefined)
        // La liste rassure avant de commencer ; elle n'a pas à tout montrer.
        .slice(0, 12)
    : [];

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>🔁 Révision</h1>
      <p className={styles.intro}>
        {words.length > 0
          ? 'Voici les mots que tu dois revoir aujourd’hui. Aucun cœur à perdre !'
          : 'Rien à revoir aujourd’hui — tout est frais dans ta tête ! Une petite révision quand même ?'}
      </p>

      <Link href="/entrainement/jouer" className="bigButton">
        Commencer la révision
      </Link>

      {words.length > 0 && (
        <ul className={styles.words}>
          {words.map((word) => (
            <li key={word.id} className={styles.word}>
              <span className={styles.wordEmoji} aria-hidden="true">
                {word.emoji}
              </span>
              <span className={styles.wordText}>
                <strong>{word.it}</strong>
                <span className={styles.wordFr}>{word.fr}</span>
              </span>
              <button
                type="button"
                className={styles.speak}
                onClick={() => speakItalian(word.it)}
                aria-label={`Écouter ${word.it}`}
              >
                🔊
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
