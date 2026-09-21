'use client';

import { useState } from 'react';
import type { Exercise } from '@/lib/exercise-builder';
import styles from './spell-card.module.css';

interface SpellCardProps {
  exercise: Extract<Exercise, { kind: 'spell' }>;
  answered: boolean;
  onAnswer: (attempt: string) => void;
}

/** Reconstruire le mot lettre par lettre : la même question, mais avec les
 *  doigts — c'est ce qui ancre l'orthographe. */
export function SpellCard({ exercise, answered, onAnswer }: SpellCardProps) {
  // Indices des lettres déjà posées, dans l'ordre de frappe : on garde les
  // indices (et non les lettres) pour gérer les mots à lettres répétées.
  const [picked, setPicked] = useState<number[]>([]);
  const attempt = picked.map((index) => exercise.letters[index]).join('');

  return (
    <div className={styles.card}>
      <p className={styles.question}>Écris ce mot en italien</p>

      <div className={styles.prompt}>
        <span className={styles.promptEmoji} aria-hidden="true">
          {exercise.word.emoji}
        </span>
        <span className={styles.promptWord}>{exercise.word.fr}</span>
      </div>

      <div className={styles.slot} aria-live="polite">
        {attempt || <span className={styles.placeholder}>Appuie sur les lettres</span>}
      </div>

      <div className={styles.letters}>
        {exercise.letters.map((letter, index) => (
          <button
            key={`${letter}-${index}`}
            type="button"
            className={styles.letter}
            onClick={() =>
              setPicked((current) =>
                current.includes(index)
                  ? current.filter((other) => other !== index)
                  : [...current, index],
              )
            }
            disabled={answered}
            data-used={picked.includes(index) ? 'true' : 'false'}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        {/* Se tromper d'une lettre ne doit pas coûter un cœur : on efface la
            dernière posée plutôt que de valider par dépit. */}
        <button
          type="button"
          className={styles.undo}
          onClick={() => setPicked((current) => current.slice(0, -1))}
          disabled={answered || picked.length === 0}
          aria-label="Effacer la dernière lettre"
        >
          ⌫
        </button>
        <button
          type="button"
          className="bigButton"
          onClick={() => onAnswer(attempt)}
          disabled={answered || attempt.length === 0}
        >
          Vérifier
        </button>
      </div>
    </div>
  );
}
