'use client';

import Link from 'next/link';
import { units } from '@/data/units';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { isLessonDone, isLessonUnlocked, nextLesson } from '@/lib/progress-stats';
import styles from './unit-path.module.css';

/**
 * Le parcours : les unités s'enchaînent de haut en bas, chaque leçon est une
 * pastille posée en zigzag. Une seule leçon à la fois est « la prochaine »,
 * repérée par son halo — l'enfant n'a jamais à choisir où aller.
 */
export function UnitPath() {
  const progress = useProgress();
  const mounted = useMounted();
  const target = mounted ? nextLesson(progress) : null;

  return (
    <div className={styles.path}>
      {units.map((unit) => {
        const doneCount = unit.lessons.filter(
          (lesson) => mounted && isLessonDone(progress, lesson.id),
        ).length;
        const unitDone = doneCount === unit.lessons.length;

        return (
          <section
            key={unit.id}
            className={styles.unit}
            style={{ '--unit-color': unit.color } as React.CSSProperties}
          >
            <header className={styles.unitHeader}>
              <span className={styles.unitEmoji} aria-hidden="true">
                {unit.emoji}
              </span>
              <div>
                <h2 className={styles.unitTitle}>
                  {unit.title} {unitDone && <span aria-label="unité terminée">🏅</span>}
                </h2>
                <p className={styles.unitSubtitle}>{unit.subtitle}</p>
              </div>
              <span className={styles.unitCount}>
                {doneCount}/{unit.lessons.length}
              </span>
            </header>

            <ol className={styles.lessons}>
              {unit.lessons.map((lesson, index) => {
                const done = mounted && isLessonDone(progress, lesson.id);
                const unlocked = mounted && isLessonUnlocked(progress, lesson.id);
                const isNext = target?.id === lesson.id;
                const stars = progress.lessons[lesson.id]?.stars ?? 0;

                return (
                  <li
                    key={lesson.id}
                    className={styles.lessonRow}
                    data-side={index % 2 === 0 ? 'left' : 'right'}
                  >
                    {unlocked ? (
                      <Link
                        href={`/lecon/${lesson.id}`}
                        className={`${styles.node} ${done ? styles.done : styles.open} ${
                          isNext ? styles.next : ''
                        }`}
                      >
                        <span className={styles.nodeEmoji} aria-hidden="true">
                          {done ? '✓' : '▶'}
                        </span>
                        <span className={styles.nodeLabel}>{lesson.title}</span>
                        <span className={styles.stars} aria-label={`${stars} étoiles sur 3`}>
                          {'⭐'.repeat(stars)}
                          {'·'.repeat(3 - stars)}
                        </span>
                      </Link>
                    ) : (
                      <div className={`${styles.node} ${styles.locked}`} aria-disabled="true">
                        <span className={styles.nodeEmoji} aria-hidden="true">
                          🔒
                        </span>
                        <span className={styles.nodeLabel}>{lesson.title}</span>
                        <span className={styles.stars}>À débloquer</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
