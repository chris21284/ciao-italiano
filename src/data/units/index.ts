import type { Unit } from '@/types/lesson';
import { premiersMots } from './premiers-mots';
import { corpsEtMaison } from './corps-et-maison';
import { mondeAutour } from './monde-autour';
import { nombresEtTemps } from './nombres-et-temps';
import { motsPourDire } from './mots-pour-dire';
import { ecoleEtMetiers } from './ecole-et-metiers';
import { vitaItaliana } from './vita-italiana';
import { verbUnits } from './verbes';

/**
 * Le parcours complet, dans l'ordre de déblocage. Il est découpé en fichiers
 * par thème : une unité ajoutée en fin de liste n'affecte jamais la
 * progression déjà enregistrée, puisque rien n'est renommé ni réordonné avant
 * elle.
 */
export const units: Unit[] = [
  ...premiersMots,
  ...corpsEtMaison,
  ...mondeAutour,
  ...nombresEtTemps,
  ...motsPourDire,
  ...ecoleEtMetiers,
  ...vitaItaliana,
  ...verbUnits,
];

/** Toutes les leçons du parcours, dans l'ordre, chacune sachant son unité. */
export const allLessons = units.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unit })),
);

export const allWords = allLessons.flatMap((lesson) => lesson.words);

const lessonsById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
const wordsById = new Map(allWords.map((word) => [word.id, word]));

export function findLesson(lessonId: string) {
  return lessonsById.get(lessonId);
}

export function findWord(wordId: string) {
  return wordsById.get(wordId);
}
