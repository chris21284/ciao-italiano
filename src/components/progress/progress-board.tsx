'use client';

import { useState } from 'react';
import { badges } from '@/data/badges';
import { allLessons, allWords } from '@/data/units';
import { useProgress } from '@/hooks/use-progress';
import { useMounted } from '@/hooks/use-mounted';
import { computeStats, dueToday, EMPTY_PROGRESS } from '@/lib/progress-stats';
import { resetProgress, setSoundEnabled } from '@/lib/progress-store';
import { levelProgress } from '@/lib/xp';
import { NameForm } from '@/components/home/name-form';
import styles from './progress-board.module.css';

/** Tableau des trophées : ce qu'on vient regarder quand on est fière. */
export function ProgressBoard() {
  const stored = useProgress();
  const mounted = useMounted();
  const progress = mounted ? stored : EMPTY_PROGRESS;
  const stats = computeStats(progress);
  const level = levelProgress(stats.xp);
  const earned = badges.filter((badge) => progress.badges.includes(badge.id)).length;
  const [editingName, setEditingName] = useState(false);

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>🏆 Mes progrès{progress.name ? ` — ${progress.name}` : ''}</h1>

      {editingName ? (
        <NameForm
          initialName={progress.name ?? ''}
          submitLabel="Enregistrer"
          onDone={() => setEditingName(false)}
        />
      ) : (
        <button type="button" className={styles.rename} onClick={() => setEditingName(true)}>
          Changer de prénom
        </button>
      )}

      <div className={styles.level}>
        <span className={styles.levelNumber}>{level.level}</span>
        <div>
          <p className={styles.levelTitle}>{level.title}</p>
          <p className={styles.levelXp}>
            {stats.xp} XP · encore {level.xpForNextLevel - level.xpInLevel} avant le niveau{' '}
            {level.level + 1}
          </p>
        </div>
      </div>

      <ul className={styles.stats}>
        <li className={styles.stat}>
          <span className={styles.statValue}>🔥 {stats.streak}</span>
          <span className={styles.statLabel}>jours de suite</span>
        </li>
        <li className={styles.stat}>
          <span className={styles.statValue}>
            {stats.lessonsDone}/{allLessons.length}
          </span>
          <span className={styles.statLabel}>leçons</span>
        </li>
        <li className={styles.stat}>
          <span className={styles.statValue}>
            {stats.wordsLearned}/{allWords.length}
          </span>
          <span className={styles.statLabel}>mots appris</span>
        </li>
        <li className={styles.stat}>
          <span className={styles.statValue}>⭐ {stats.perfectLessons}</span>
          <span className={styles.statLabel}>leçons parfaites</span>
        </li>
        <li className={styles.stat}>
          <span className={styles.statValue}>🧲 {stats.masteredWords}</span>
          <span className={styles.statLabel}>mots bien ancrés</span>
        </li>
        <li className={styles.stat}>
          <span className={styles.statValue}>🔁 {dueToday(progress).length}</span>
          <span className={styles.statLabel}>à revoir aujourd’hui</span>
        </li>
      </ul>

      <h2 className={styles.badgesTitle}>
        Badges {earned}/{badges.length}
      </h2>
      <ul className={styles.badges}>
        {badges.map((badge) => {
          const unlocked = progress.badges.includes(badge.id);
          return (
            <li key={badge.id} className={styles.badge} data-unlocked={unlocked ? 'true' : 'false'}>
              <span className={styles.badgeEmoji} aria-hidden="true">
                {unlocked ? badge.emoji : '🔒'}
              </span>
              <span className={styles.badgeLabel}>{badge.label}</span>
              <span className={styles.badgeHint}>{unlocked ? 'Décroché !' : badge.hint}</span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={styles.rename}
        onClick={() => setSoundEnabled(!progress.soundEnabled)}
      >
        {progress.soundEnabled
          ? 'Désactiver les questions d’écoute'
          : 'Réactiver les questions d’écoute'}
      </button>

      <button
        type="button"
        className={styles.reset}
        onClick={() => {
          if (window.confirm('Tout effacer et repartir de zéro ?')) resetProgress();
        }}
      >
        Tout recommencer
      </button>
    </section>
  );
}
