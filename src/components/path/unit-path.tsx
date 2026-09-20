'use client';

import { useState } from 'react';
import Link from 'next/link';
import { units } from '@/data/units';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { isLessonDone, isLessonUnlocked, nextLesson } from '@/lib/progress-stats';
import styles from './unit-path.module.css';

/**
 * La carte du parcours. Avec une trentaine d'unités, tout dérouler noierait
 * l'essentiel : seule l'unité en cours est ouverte, les autres se replient en
 * une ligne qu'on déplie d'une touche.
 */
export function UnitPath() {
  const progress = useProgress();
  const mounted = useMounted();
  const [openedUnitId, setOpenedUnitId] = useState<string | null>(null);

  const target = mounted ? nextLesson(progress) : null;
  const currentUnitId = target?.unit.id ?? units[0]?.id;

  return (
    <div className={styles.path}>
      {units.map((unit) => {
        const doneCount = unit.lessons.filter(
          (lesson) => mounted && isLessonDone(progress, lesson.id),
        ).length;
        const unitDone = doneCount === unit.lessons.length;
        const opened = (openedUnitId ?? currentUnitId) === unit.id;

        return (
          <section
            key={unit.id}
            className={styles.unit}
            style={{ '--unit-color': unit.color } as React.CSSProperties}
          >
            <button
              type="button"
              className={styles.unitHeader}
              onClick={() => setOpenedUnitId(opened ? '' : unit.id)}
              aria-expanded={opened}
            >
              <span className={styles.unitEmoji} aria-hidden="true">
                {unit.emoji}
              </span>
              <span className={styles.unitText}>
                <span className={styles.unitTitle}>
                  {unit.title} {unitDone && <span aria-label="unité terminée">🏅</span>}
                </span>
                <span className={styles.unitSubtitle}>{unit.subtitle}</span>
              </span>
              <span className={styles.unitCount}>
                {doneCount}/{unit.lessons.length}
              </span>
              <span className={styles.chevron} aria-hidden="true">
                {opened ? '▾' : '▸'}
              </span>
            </button>

            {opened && (
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
            )}
          </section>
        );
      })}
    </div>
  );
}
