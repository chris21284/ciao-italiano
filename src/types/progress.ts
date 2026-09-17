/** Résultat conservé pour une leçon terminée. */
export interface LessonResult {
  /** 1 à 3 étoiles, selon le nombre de fautes. */
  stars: number;
  /** Nombre de fois où la leçon a été rejouée. */
  attempts: number;
}

export interface Progress {
  xp: number;
  /** Nombre de jours d'affilée avec au moins une leçon terminée. */
  streak: number;
  /** Dernier jour d'activité, au format `AAAA-MM-JJ` (heure locale). */
  lastDay: string | null;
  /** XP gagnés pendant `lastDay`, pour l'objectif quotidien. */
  xpToday: number;
  /** Résultats par identifiant de leçon. */
  lessons: Record<string, LessonResult>;
  /** Mots ratés au moins une fois et pas encore redressés, par identifiant. */
  toReview: string[];
  /** Identifiants des badges déjà décrochés. */
  badges: string[];
}
