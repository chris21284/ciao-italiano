'use client';

import { useState } from 'react';
import { setPlayerName } from '@/lib/progress-store';
import styles from './name-form.module.css';

interface NameFormProps {
  /** Prénom déjà enregistré, quand le formulaire sert à le corriger. */
  initialName?: string;
  submitLabel: string;
  /** Appelé après l'enregistrement, pour refermer le formulaire. */
  onDone?: () => void;
}

/**
 * Saisie du prénom. Il ne quitte jamais le téléphone : comme le reste de la
 * progression, il est rangé dans le stockage local du navigateur.
 */
export function NameForm({ initialName = '', submitLabel, onDone }: NameFormProps) {
  const [value, setValue] = useState(initialName);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setPlayerName(value);
        onDone?.();
      }}
    >
      <input
        className={styles.input}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ton prénom"
        aria-label="Ton prénom"
        maxLength={16}
        autoComplete="given-name"
        autoCapitalize="words"
      />
      <button type="submit" className="bigButton" disabled={value.trim().length === 0}>
        {submitLabel}
      </button>
    </form>
  );
}
