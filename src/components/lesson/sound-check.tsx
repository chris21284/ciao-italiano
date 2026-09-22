'use client';

import { useState } from 'react';
import { setSoundEnabled } from '@/lib/progress-store';
import { speakItalian } from '@/lib/speak';
import styles from './sound-check.module.css';

/**
 * Aucun navigateur ne sait dire si le téléphone est en mode silencieux : le
 * bouton latéral de l'iPhone et le volume du système sont invisibles depuis
 * une page web. On pose donc la question une seule fois, avant la première
 * question d'écoute, et on retient la réponse.
 */
export function SoundCheck({ onDone }: { onDone: () => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.check}>
      <p className={styles.emoji} aria-hidden="true">
        🔊
      </p>
      <h1 className={styles.title}>Petit test de son</h1>
      <p className={styles.text}>
        Certaines questions se jouent en écoutant. Appuie sur le haut-parleur : tu entends le mot ?
      </p>

      <button type="button" className={styles.speaker} onClick={() => speakItalian('buongiorno')}>
        <span aria-hidden="true">🔈</span> Faire parler
      </button>

      {failed ? (
        <div className={styles.help}>
          <h2 className={styles.helpTitle}>Rien du tout ?</h2>
          <ul className={styles.tips}>
            <li>Monte le volume avec les boutons sur le côté du téléphone.</li>
            <li>
              Sur un iPhone, vérifie le petit bouton tout en haut à gauche : s’il montre de
              l’orange, le téléphone est en silencieux.
            </li>
            <li>Si tu as un casque ou une enceinte connectée, le son part peut-être dedans.</li>
          </ul>
          <button type="button" className="bigButton" onClick={() => speakItalian('buongiorno')}>
            J’ai réglé, je réessaie
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setSoundEnabled(false);
              onDone();
            }}
          >
            Continuer sans le son
          </button>
        </div>
      ) : (
        <div className={styles.answers}>
          <button
            type="button"
            className="bigButton"
            onClick={() => {
              setSoundEnabled(true);
              onDone();
            }}
          >
            Oui, j’entends !
          </button>
          <button type="button" className={styles.secondary} onClick={() => setFailed(true)}>
            Non, je n’entends rien
          </button>
        </div>
      )}
    </div>
  );
}
