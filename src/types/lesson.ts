/** Un mot ou une courte phrase, unité de base de tout le contenu. */
export interface Word {
  /** Identifiant stable : sert de clé de révision dans la progression. */
  id: string;
  it: string;
  fr: string;
  /** Emoji illustratif — un enfant reconnaît l'image avant de lire le mot. */
  emoji: string;
  /** Aide de prononciation « à la française », affichée après la réponse. */
  say: string;
  /**
   * Renseigné sur une forme conjuguée : de quoi demander « io + essere → ? »
   * sans que l'exercice ait à retrouver le tableau du verbe.
   */
  verb?: {
    infinitive: string;
    pronoun: string;
    /** La forme seule, sans le pronom : « sono » dans « io sono ». */
    form: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  words: Word[];
}

export interface Unit {
  id: string;
  title: string;
  /** Sous-titre affiché sur la carte du parcours. */
  subtitle: string;
  emoji: string;
  /** Teinte de l'unité, appliquée en variable CSS sur la carte. */
  color: string;
  lessons: Lesson[];
}
