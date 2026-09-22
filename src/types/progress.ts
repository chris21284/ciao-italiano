/** Résultat conservé pour une leçon terminée. */
export interface LessonResult {
  /** 1 à 3 étoiles, selon le nombre de fautes. */
  stars: number;
  /** Nombre de fois où la leçon a été rejouée. */
  attempts: number;
}

/**
 * Fiche de révision d'un mot, façon « boîtes de Leitner » : chaque réussite
 * fait monter d'une boîte et repousse la prochaine rencontre, chaque erreur
 * ramène le mot à la première boîte. C'est ce qui étale le contenu dans le
 * temps et fait revenir les mots avant qu'ils ne soient oubliés.
 */
export interface ReviewCard {
  /** 0 (tout frais ou raté) à 6 (su par cœur). */
  box: number;
  /** Jour de la prochaine révision, au format `AAAA-MM-JJ`. */
  due: string;
}

export interface Progress {
  /** Prénom choisi au premier lancement, `null` tant qu'il n'est pas saisi. */
  name: string | null;
  xp: number;
  /** Nombre de jours d'affilée avec au moins une leçon terminée. */
  streak: number;
  /** Dernier jour d'activité, au format `AAAA-MM-JJ` (heure locale). */
  lastDay: string | null;
  /** XP gagnés pendant `lastDay`. */
  xpToday: number;
  /** Secondes de jeu effectives pendant `lastDay` : la séance du jour s'arrête
   *  dessus, pas sur un nombre d'exercices. */
  secondsToday: number;
  /** Résultats par identifiant de leçon. */
  lessons: Record<string, LessonResult>;
  /** Fiche de révision par identifiant de mot. */
  review: Record<string, ReviewCard>;
  /** Identifiants des badges déjà décrochés. */
  badges: string[];
  /**
   * Aucune API web ne dit si le téléphone est en mode silencieux : on le lui
   * demande une fois, au premier exercice d'écoute, et on retient sa réponse.
   */
  soundChecked: boolean;
  /** `false` : les questions d'écoute sont remplacées par des questions lues. */
  soundEnabled: boolean;
}
