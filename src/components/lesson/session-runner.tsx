'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Exercise } from '@/lib/exercise-builder';
import { speakItalian } from '@/lib/speak';
import { ChoiceCard } from './choice-card';
import { SpellCard } from './spell-card';
import styles from './session-runner.module.css';

export interface SessionResult {
  /** Mots réussis du premier coup. */
  rightWordIds: string[];
  /** Mots ratés au moins une fois. */
  wrongWordIds: string[];
}

interface SessionRunnerProps {
  exercises: Exercise[];
  /** Nombre de cœurs, ou `null` pour une séance sans échec possible. */
  hearts?: number | null;
  onFinish: (result: SessionResult) => void;
  /** Relance la séance avec de nouvelles questions après un échec. */
  onRestart?: () => void;
  backHref: string;
}

function expectedAnswer(exercise: Exercise): string {
  return exercise.kind === 'choice-it-fr' ? exercise.word.fr : exercise.word.it;
}

function isRight(exercise: Exercise, value: string): boolean {
  return value.trim().toLowerCase() === expectedAnswer(exercise).trim().toLowerCase();
}

export function SessionRunner({
  exercises,
  hearts = 3,
  onFinish,
  onRestart,
  backHref,
}: SessionRunnerProps) {
  const [queue, setQueue] = useState<Exercise[]>(exercises);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [heartsLeft, setHeartsLeft] = useState(hearts ?? 0);
  const [failed, setFailed] = useState(false);

  const exercise = queue[index];

  if (failed) {
    return (
      <div className={styles.failed}>
        <p className={styles.failedEmoji} aria-hidden="true">
          💔
        </p>
        <h2 className={styles.failedTitle}>Plus de cœurs !</h2>
        <p className={styles.failedText}>
          Pas grave, même les championnes recommencent. Tu connais déjà mieux ces mots qu’au début.
        </p>
        {onRestart && (
          <button
            type="button"
            className="bigButton"
            onClick={() => {
              setQueue(exercises);
              setIndex(0);
              setAnswer(null);
              setWrongWordIds([]);
              setHeartsLeft(hearts ?? 0);
              setFailed(false);
              onRestart();
            }}
          >
            On recommence !
          </button>
        )}
        <Link href={backHref} className={styles.quitLink}>
          Revenir au parcours
        </Link>
      </div>
    );
  }

  if (!exercise) return null;

  function handleAnswer(value: string) {
    if (answer !== null || !exercise) return;
    const right = isRight(exercise, value);
    setAnswer(value);
    setCorrect(right);
    // Le mot est toujours prononcé au moment de la correction : même raté, on
    // repart avec le son dans l'oreille.
    speakItalian(exercise.word.it);

    if (!right) {
      setWrongWordIds((current) =>
        current.includes(exercise.word.id) ? current : [...current, exercise.word.id],
      );
      if (hearts !== null) setHeartsLeft((current) => current - 1);
    }
  }

  function handleContinue() {
    if (!exercise) return;
    if (hearts !== null && heartsLeft <= 0) {
      setFailed(true);
      return;
    }

    // Une question ratée revient à la fin de la séance : on ne quitte jamais un
    // mot sur un échec.
    const nextQueue = correct ? queue : [...queue, exercise];
    const nextIndex = index + 1;
    setQueue(nextQueue);
    setAnswer(null);

    if (nextIndex >= nextQueue.length) {
      const seenWordIds = [...new Set(exercises.map((item) => item.word.id))];
      onFinish({
        rightWordIds: seenWordIds.filter((wordId) => !wrongWordIds.includes(wordId)),
        wrongWordIds,
      });
      return;
    }
    setIndex(nextIndex);
  }

  return (
    <div className={styles.runner}>
      <header className={styles.header}>
        <Link href={backHref} className={styles.quit} aria-label="Quitter la leçon">
          ✕
        </Link>
        <span className={styles.gauge} aria-hidden="true">
          <span
            className={styles.gaugeFill}
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </span>
        {hearts !== null && (
          <span className={styles.hearts} aria-label={`${heartsLeft} cœurs restants`}>
            {'❤️'.repeat(Math.max(heartsLeft, 0))}
            {'🤍'.repeat(Math.max(hearts - heartsLeft, 0))}
          </span>
        )}
      </header>

      <div className={styles.body}>
        {exercise.kind === 'spell' ? (
          <SpellCard
            key={`${exercise.word.id}-${index}`}
            exercise={exercise}
            answered={answer !== null}
            onAnswer={handleAnswer}
          />
        ) : (
          <ChoiceCard
            key={`${exercise.word.id}-${index}`}
            exercise={exercise}
            answer={answer}
            onAnswer={handleAnswer}
          />
        )}
      </div>

      {answer !== null && (
        <div className={`${styles.feedback} ${correct ? styles.good : styles.bad}`} role="status">
          <p className={styles.feedbackTitle}>
            {correct ? 'Bravo ! 🎉' : `La bonne réponse : ${expectedAnswer(exercise)}`}
          </p>
          <p className={styles.feedbackSay}>
            {exercise.word.it} — on dit « {exercise.word.say} »
          </p>
          {/* Sur une question d'écoute, les réponses sont toutes en italien :
              sans cette ligne, on peut reconnaître le son sans jamais savoir
              ce que le mot veut dire. */}
          {exercise.kind === 'listen' && (
            <p className={styles.feedbackMeaning}>Ça veut dire : {exercise.word.fr}</p>
          )}
          <button type="button" className="bigButton" onClick={handleContinue}>
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}
