'use client';

import { useEffect } from 'react';
import type { Exercise } from '@/lib/exercise-builder';
import { speakItalian } from '@/lib/speak';
import styles from './choice-card.module.css';

interface ChoiceCardProps {
  exercise: Extract<Exercise, { kind: 'choice-it-fr' | 'choice-fr-it' | 'listen' | 'conjugate' }>;
  /** Réponse déjà donnée, ou `null` tant que la question est ouverte. */
  answer: string | null;
  onAnswer: (option: string) => void;
}

const QUESTIONS = {
  'choice-it-fr': 'Ça veut dire quoi ?',
  'choice-fr-it': 'Comment on dit en italien ?',
  listen: 'Écoute bien... c’est quel mot ?',
  conjugate: 'Complète la phrase',
};

export function ChoiceCard({ exercise, answer, onAnswer }: ChoiceCardProps) {
  const expected =
    exercise.kind === 'choice-it-fr'
      ? exercise.word.fr
      : exercise.kind === 'conjugate'
        ? (exercise.word.verb?.form ?? exercise.word.it)
        : exercise.word.it;
  const isListening = exercise.kind === 'listen';
  const isConjugating = exercise.kind === 'conjugate';

  useEffect(() => {
    // La question d'écoute se joue toute seule à l'affichage, puis à la demande
    // via le bouton haut-parleur.
    if (isListening) speakItalian(exercise.word.it);
  }, [isListening, exercise.word.it]);

  return (
    <div className={styles.card}>
      <p className={styles.question}>{QUESTIONS[exercise.kind]}</p>

      {isConjugating ? (
        <div className={styles.prompt}>
          <span className={styles.promptEmoji} aria-hidden="true">
            {exercise.word.emoji}
          </span>
          <span className={styles.promptWord}>
            {exercise.word.verb?.pronoun} <span className={styles.blank}>____</span>
            <span className={styles.infinitive}>
              {exercise.word.verb?.infinitive} · {exercise.word.fr}
            </span>
          </span>
        </div>
      ) : isListening ? (
        <button
          type="button"
          className={styles.speaker}
          onClick={() => speakItalian(exercise.word.it)}
        >
          <span aria-hidden="true">🔊</span>
          <span className={styles.speakerLabel}>Réécouter</span>
        </button>
      ) : (
        <div className={styles.prompt}>
          <span className={styles.promptEmoji} aria-hidden="true">
            {exercise.word.emoji}
          </span>
          <span className={styles.promptWord}>
            {exercise.kind === 'choice-it-fr' ? exercise.word.it : exercise.word.fr}
          </span>
          {exercise.kind === 'choice-it-fr' && (
            <button
              type="button"
              className={styles.smallSpeaker}
              onClick={() => speakItalian(exercise.word.it)}
              aria-label="Écouter le mot"
            >
              🔊
            </button>
          )}
        </div>
      )}

      <div className={styles.options}>
        {exercise.options.map((option) => {
          const chosen = answer === option;
          const state =
            answer === null
              ? ''
              : option === expected
                ? styles.right
                : chosen
                  ? styles.wrong
                  : styles.dimmed;
          return (
            <button
              key={option}
              type="button"
              className={`${styles.option} ${state}`}
              onClick={() => onAnswer(option)}
              disabled={answer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
