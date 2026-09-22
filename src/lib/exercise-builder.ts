import type { Word } from '@/types/lesson';
import { createRandom, shuffle } from './shuffle';

export type Exercise =
  /** Le mot italien est affiché, on choisit sa traduction française. */
  | { kind: 'choice-it-fr'; word: Word; options: string[] }
  /** Le mot français est affiché, on choisit sa traduction italienne. */
  | { kind: 'choice-fr-it'; word: Word; options: string[] }
  /** On écoute le mot (voix du téléphone) puis on choisit ce qu'on a entendu. */
  | { kind: 'listen'; word: Word; options: string[] }
  /** On reconstruit le mot italien lettre par lettre. */
  | { kind: 'spell'; word: Word; letters: string[] }
  /** On complète « io ___ » à partir de l'infinitif : la conjugaison. */
  | { kind: 'conjugate'; word: Word; options: string[] };

const CHOICE_COUNT = 4;

/** Le mode « lettres » n'a de sens que sur un mot court et sans espace. */
export function canSpell(word: Word): boolean {
  return !word.it.includes(' ') && word.it.length >= 3 && word.it.length <= 9;
}

function distractors(
  word: Word,
  pool: readonly Word[],
  field: 'it' | 'fr',
  random: () => number,
): string[] {
  const candidates = shuffle(
    pool.filter((other) => other.id !== word.id && other[field] !== word[field]),
    random,
  );
  const unique: string[] = [];
  for (const candidate of candidates) {
    if (unique.length >= CHOICE_COUNT - 1) break;
    if (!unique.includes(candidate[field])) unique.push(candidate[field]);
  }
  return unique;
}

function buildChoice(
  kind: 'choice-it-fr' | 'choice-fr-it' | 'listen',
  word: Word,
  pool: readonly Word[],
  random: () => number,
): Exercise {
  const field = kind === 'choice-it-fr' ? 'fr' : 'it';
  const options = shuffle([word[field], ...distractors(word, pool, field, random)], random);
  return { kind, word, options };
}

function buildSpell(word: Word, random: () => number): Exercise {
  const letters = shuffle([...word.it], random);
  // Un mélange qui retombe sur le mot d'origine priverait l'exercice de son
  // intérêt : on décale alors les lettres d'un cran.
  const scrambled =
    letters.join('') === word.it ? [...letters.slice(1), letters[0] as string] : letters;
  return { kind: 'spell', word, letters: scrambled };
}

/**
 * Pour une forme conjuguée, les meilleurs pièges sont les autres formes du
 * même verbe : c'est exactement la confusion qu'on veut faire travailler.
 */
function buildConjugate(word: Word, pool: readonly Word[], random: () => number): Exercise {
  const siblings = pool.filter(
    (other) =>
      other.verb?.infinitive === word.verb?.infinitive && other.verb?.form !== word.verb?.form,
  );
  const others = shuffle(siblings, random)
    .map((other) => other.verb?.form as string)
    .filter((form, index, list) => list.indexOf(form) === index)
    .slice(0, CHOICE_COUNT - 1);
  return {
    kind: 'conjugate',
    word,
    options: shuffle([word.verb?.form as string, ...others], random),
  };
}

function buildOne(
  word: Word,
  index: number,
  pool: readonly Word[],
  random: () => number,
  listening: boolean,
): Exercise {
  const rotation = index % 4;
  if (rotation === 0) return buildChoice('choice-it-fr', word, pool, random);
  // Sans le son, la question d'écoute devient une question lue : elle garde sa
  // place dans la rotation plutôt que de disparaître.
  if (rotation === 2) {
    return listening
      ? buildChoice('listen', word, pool, random)
      : buildChoice('choice-it-fr', word, pool, random);
  }
  // Les formes conjuguées passent par l'exercice de conjugaison plutôt que par
  // les lettres mélangées, qui n'apprendraient rien de la terminaison.
  if (word.verb) return buildConjugate(word, pool, random);
  if (rotation === 1) return buildChoice('choice-fr-it', word, pool, random);
  return canSpell(word)
    ? buildSpell(word, random)
    : buildChoice('choice-fr-it', word, pool, random);
}

/**
 * Une question par mot de la leçon, les types tournant d'un mot à l'autre pour
 * qu'aucune session ne se répète. Les mots ratés sont rejoués par le moteur de
 * leçon, pas ajoutés ici.
 */
export function buildLessonExercises(
  words: readonly Word[],
  pool: readonly Word[],
  seed: number,
  listening = true,
): Exercise[] {
  const random = createRandom(seed);
  return shuffle(words, random).map((word, index) =>
    buildOne(word, index, pool, random, listening),
  );
}

/**
 * Séance d'entraînement : d'abord les mots à revoir, complétés au hasard parmi
 * les mots déjà rencontrés pour atteindre `size` questions.
 */
export function buildReviewExercises(
  toReview: readonly Word[],
  seen: readonly Word[],
  seed: number,
  size = 10,
  listening = true,
): Exercise[] {
  const random = createRandom(seed);
  const filler = shuffle(
    seen.filter((word) => !toReview.some((other) => other.id === word.id)),
    random,
  );
  const selected = [...shuffle(toReview, random), ...filler].slice(0, size);
  return selected.map((word, index) =>
    buildOne(word, index, seen.length ? seen : selected, random, listening),
  );
}
