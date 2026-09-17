'use client';

import Link from 'next/link';
import { findWord } from '@/data/units';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { speakItalian } from '@/lib/speak';
import styles from './review-intro.module.css';

/** Page d'entrée de la révision : la liste des mots fâchés, à voir avant de
 *  se relancer. */
export function ReviewIntro() {
  const progress = useProgress();
  const mounted = useMounted();
  const words = mounted ? progress.toReview.map(findWord).filter((word) => word !== undefined) : [];

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>🔁 Révision</h1>
      <p className={styles.intro}>
        {words.length > 0
          ? `Tu as ${words.length} mot${words.length > 1 ? 's' : ''} à revoir. Dix questions, aucun cœur à perdre !`
          : 'Aucun mot fâché pour l’instant ! Une petite révision quand même ?'}
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
