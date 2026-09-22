'use client';

import { useMemo, useState } from 'react';
import type { Lesson } from '@/types/lesson';
import { allLessons, allWords } from '@/data/units';
import { buildLessonExercises } from '@/lib/exercise-builder';
import { completeLesson, type LessonReward } from '@/lib/progress-store';
import { renewSeed } from '@/lib/session-seed';
import { useSessionSeed } from '@/hooks/use-session-seed';
import { useProgress } from '@/hooks/use-progress';
import { SessionRunner, type SessionResult } from './session-runner';
import { LessonSummary } from './lesson-summary';
import { SoundCheck } from './sound-check';
import styles from './lesson-screen.module.css';

function nextLessonIdAfter(lessonId: string): string | null {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId);
  return allLessons[index + 1]?.id ?? null;
}

export function LessonScreen({ lesson }: { lesson: Lesson }) {
  const seed = useSessionSeed();
  const progress = useProgress();
  const [reward, setReward] = useState<LessonReward | null>(null);

  const exercises = useMemo(
    () =>
      seed === 0 ? [] : buildLessonExercises(lesson.words, allWords, seed, progress.soundEnabled),
    [seed, lesson, progress.soundEnabled],
  );

  const needsSoundCheck =
    !progress.soundChecked && exercises.some((exercise) => exercise.kind === 'listen');

  function handleFinish(result: SessionResult) {
    setReward(completeLesson({ lessonId: lesson.id, ...result }));
  }

  function replay() {
    setReward(null);
    renewSeed();
  }

  if (reward) {
    return (
      <LessonSummary
        reward={reward}
        nextLessonId={nextLessonIdAfter(lesson.id)}
        onReplay={replay}
      />
    );
  }

  if (exercises.length === 0) {
    return <p className={styles.loading}>On prépare la leçon...</p>;
  }

  // Le test se fait avant la leçon : répondre « je n'entends rien » regénère
  // les questions sans écoute, plutôt que de la laisser deviner.
  if (needsSoundCheck) return <SoundCheck onDone={renewSeed} />;

  return (
    <SessionRunner
      key={seed}
      exercises={exercises}
      onFinish={handleFinish}
      onRestart={renewSeed}
      backHref="/"
    />
  );
}
