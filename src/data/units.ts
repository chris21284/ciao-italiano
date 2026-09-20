import type { Unit } from '@/types/lesson';

/**
 * Tout le contenu pédagogique du site. Les identifiants sont figés : la
 * progression enregistrée dans le navigateur s'y réfère, donc on peut ajouter
 * des unités ou des mots, mais renommer un `id` efface les étoiles déjà
 * gagnées sur la leçon concernée.
 *
 * `say` est une prononciation « à la française », volontairement approximative :
 * elle sert de béquille à une enfant qui ne lit pas l'alphabet phonétique.
 */
export const units: Unit[] = [
  {
    id: 'saluti',
    title: 'Ciao !',
    subtitle: 'Dire bonjour et être poli',
    emoji: '👋',
    color: '#ff8fab',
    lessons: [
      {
        id: 'saluti-1',
        title: 'Se dire bonjour',
        words: [
          { id: 'ciao', it: 'ciao', fr: 'salut', emoji: '👋', say: 'tchao' },
          { id: 'buongiorno', it: 'buongiorno', fr: 'bonjour', emoji: '🌞', say: 'bouon-djor-no' },
          { id: 'buonasera', it: 'buonasera', fr: 'bonsoir', emoji: '🌆', say: 'bouona-séra' },
          {
            id: 'buonanotte',
            it: 'buonanotte',
            fr: 'bonne nuit',
            emoji: '🌙',
            say: 'bouona-notté',
          },
          {
            id: 'arrivederci',
            it: 'arrivederci',
            fr: 'au revoir',
            emoji: '🤚',
            say: 'arrivé-dèr-tchi',
          },
          { id: 'a-domani', it: 'a domani', fr: 'à demain', emoji: '📆', say: 'a do-mani' },
        ],
      },
      {
        id: 'saluti-2',
        title: 'Les mots magiques',
        words: [
          {
            id: 'per-favore',
            it: 'per favore',
            fr: "s'il te plaît",
            emoji: '🙏',
            say: 'pèr fa-voré',
          },
          { id: 'grazie', it: 'grazie', fr: 'merci', emoji: '💐', say: 'gra-tsié' },
          { id: 'prego', it: 'prego', fr: 'de rien', emoji: '😊', say: 'pré-go' },
          { id: 'scusa', it: 'scusa', fr: 'pardon', emoji: '😬', say: 'skou-za' },
          { id: 'si', it: 'sì', fr: 'oui', emoji: '✅', say: 'si' },
          { id: 'no', it: 'no', fr: 'non', emoji: '❌', say: 'no' },
        ],
      },
      {
        id: 'saluti-3',
        title: 'Faire connaissance',
        words: [
          {
            id: 'come-ti-chiami',
            it: 'come ti chiami?',
            fr: "comment tu t'appelles ?",
            emoji: '❓',
            say: 'komé ti kiami',
          },
          {
            id: 'mi-chiamo',
            it: 'mi chiamo...',
            fr: "je m'appelle...",
            emoji: '🪪',
            say: 'mi kiamo',
          },
          {
            id: 'come-stai',
            it: 'come stai?',
            fr: 'comment ça va ?',
            emoji: '🤔',
            say: 'komé staï',
          },
          { id: 'bene', it: 'bene', fr: 'bien', emoji: '👍', say: 'bé-né' },
          { id: 'molto-bene', it: 'molto bene', fr: 'très bien', emoji: '🤩', say: 'molto bé-né' },
          { id: 'piacere', it: 'piacere', fr: 'enchantée', emoji: '🤝', say: 'pia-tché-ré' },
        ],
      },
    ],
  },
  {
    id: 'colori',
    title: 'I colori',
    subtitle: 'Toutes les couleurs',
    emoji: '🎨',
    color: '#5bc0eb',
    lessons: [
      {
        id: 'colori-1',
        title: 'Les couleurs de base',
        words: [
          { id: 'rosso', it: 'rosso', fr: 'rouge', emoji: '🔴', say: 'rosso' },
          { id: 'blu', it: 'blu', fr: 'bleu', emoji: '🔵', say: 'blou' },
          { id: 'giallo', it: 'giallo', fr: 'jaune', emoji: '🟡', say: 'djallo' },
          { id: 'verde', it: 'verde', fr: 'vert', emoji: '🟢', say: 'vèr-dé' },
          { id: 'nero', it: 'nero', fr: 'noir', emoji: '⚫', say: 'né-ro' },
          { id: 'bianco', it: 'bianco', fr: 'blanc', emoji: '⚪', say: 'bian-ko' },
        ],
      },
      {
        id: 'colori-2',
        title: 'Encore des couleurs',
        words: [
          { id: 'arancione', it: 'arancione', fr: 'orange', emoji: '🟠', say: 'aran-tcho-né' },
          { id: 'rosa', it: 'rosa', fr: 'rose', emoji: '🌸', say: 'ro-za' },
          { id: 'viola', it: 'viola', fr: 'violet', emoji: '🟣', say: 'vio-la' },
          { id: 'grigio', it: 'grigio', fr: 'gris', emoji: '🩶', say: 'gri-djo' },
          { id: 'marrone', it: 'marrone', fr: 'marron', emoji: '🟤', say: 'mar-ro-né' },
          { id: 'azzurro', it: 'azzurro', fr: 'bleu ciel', emoji: '🩵', say: 'ad-dzou-ro' },
        ],
      },
      {
        id: 'colori-3',
        title: 'De quelle couleur ?',
        words: [
          {
            id: 'gatto-nero',
            it: 'il gatto è nero',
            fr: 'le chat est noir',
            emoji: '🐈‍⬛',
            say: 'il gatto è né-ro',
          },
          {
            id: 'mela-rossa',
            it: 'la mela è rossa',
            fr: 'la pomme est rouge',
            emoji: '🍎',
            say: 'la mé-la è rossa',
          },
          {
            id: 'cielo-azzurro',
            it: 'il cielo è azzurro',
            fr: 'le ciel est bleu',
            emoji: '☁️',
            say: 'il tchélo è ad-dzou-ro',
          },
          {
            id: 'erba-verde',
            it: "l'erba è verde",
            fr: "l'herbe est verte",
            emoji: '🌿',
            say: 'lèrba è vèr-dé',
          },
          {
            id: 'sole-giallo',
            it: 'il sole è giallo',
            fr: 'le soleil est jaune',
            emoji: '☀️',
            say: 'il so-lé è djallo',
          },
          {
            id: 'neve-bianca',
            it: 'la neve è bianca',
            fr: 'la neige est blanche',
            emoji: '❄️',
            say: 'la né-vé è bian-ka',
          },
        ],
      },
    ],
  },
  {
    id: 'numeri',
    title: 'I numeri',
    subtitle: 'Compter en italien',
    emoji: '🔢',
    color: '#ffb703',
    lessons: [
      {
        id: 'numeri-1',
        title: 'De 1 à 6',
        words: [
          { id: 'uno', it: 'uno', fr: 'un', emoji: '1️⃣', say: 'ou-no' },
          { id: 'due', it: 'due', fr: 'deux', emoji: '2️⃣', say: 'dou-é' },
          { id: 'tre', it: 'tre', fr: 'trois', emoji: '3️⃣', say: 'tré' },
          { id: 'quattro', it: 'quattro', fr: 'quatre', emoji: '4️⃣', say: 'kouattro' },
          { id: 'cinque', it: 'cinque', fr: 'cinq', emoji: '5️⃣', say: 'tchin-koué' },
          { id: 'sei', it: 'sei', fr: 'six', emoji: '6️⃣', say: 'séï' },
        ],
      },
      {
        id: 'numeri-2',
        title: 'De 7 à 12',
        words: [
          { id: 'sette', it: 'sette', fr: 'sept', emoji: '7️⃣', say: 'sètté' },
          { id: 'otto', it: 'otto', fr: 'huit', emoji: '8️⃣', say: 'otto' },
          { id: 'nove', it: 'nove', fr: 'neuf', emoji: '9️⃣', say: 'no-vé' },
          { id: 'dieci', it: 'dieci', fr: 'dix', emoji: '🔟', say: 'dié-tchi' },
          { id: 'undici', it: 'undici', fr: 'onze', emoji: '🧮', say: 'oun-di-tchi' },
          { id: 'dodici', it: 'dodici', fr: 'douze', emoji: '🕛', say: 'do-di-tchi' },
        ],
      },
      {
        id: 'numeri-3',
        title: 'Les grands nombres',
        words: [
          { id: 'venti', it: 'venti', fr: 'vingt', emoji: '📊', say: 'vèn-ti' },
          { id: 'trenta', it: 'trenta', fr: 'trente', emoji: '📈', say: 'trèn-ta' },
          { id: 'cento', it: 'cento', fr: 'cent', emoji: '💯', say: 'tchèn-to' },
          { id: 'mille', it: 'mille', fr: 'mille', emoji: '🎯', say: 'mil-lé' },
          {
            id: 'quanti-anni',
            it: 'quanti anni hai?',
            fr: 'quel âge as-tu ?',
            emoji: '🎂',
            say: 'kouanti anni aï',
          },
          {
            id: 'ho-dieci-anni',
            it: 'ho dieci anni',
            fr: "j'ai dix ans",
            emoji: '🕯️',
            say: 'o dié-tchi anni',
          },
        ],
      },
    ],
  },
  {
    id: 'famiglia',
    title: 'La famiglia',
    subtitle: 'La famille et la maison',
    emoji: '👨‍👩‍👧',
    color: '#c08bff',
    lessons: [
      {
        id: 'famiglia-1',
        title: 'Papa, maman...',
        words: [
          { id: 'mamma', it: 'la mamma', fr: 'la maman', emoji: '👩', say: 'la mamma' },
          { id: 'papa', it: 'il papà', fr: 'le papa', emoji: '👨', say: 'il pa-pa' },
          { id: 'sorella', it: 'la sorella', fr: 'la sœur', emoji: '👧', say: 'la so-rèlla' },
          { id: 'fratello', it: 'il fratello', fr: 'le frère', emoji: '👦', say: 'il fra-tèllo' },
          { id: 'nonna', it: 'la nonna', fr: 'la grand-mère', emoji: '👵', say: 'la nonna' },
          { id: 'nonno', it: 'il nonno', fr: 'le grand-père', emoji: '👴', say: 'il nonno' },
        ],
      },
      {
        id: 'famiglia-2',
        title: 'Toute la tribu',
        words: [
          { id: 'famiglia', it: 'la famiglia', fr: 'la famille', emoji: '👨‍👩‍👧‍👦', say: 'la fa-mi-lia' },
          { id: 'zia', it: 'la zia', fr: 'la tante', emoji: '💃', say: 'la tsi-a' },
          { id: 'zio', it: 'lo zio', fr: "l'oncle", emoji: '🕺', say: 'lo tsi-o' },
          {
            id: 'bambina',
            it: 'la bambina',
            fr: 'la petite fille',
            emoji: '🧒',
            say: 'la bam-bi-na',
          },
          { id: 'amica', it: "l'amica", fr: 'la copine', emoji: '🫶', say: 'la-mi-ka' },
          {
            id: 'ti-voglio-bene',
            it: 'ti voglio bene',
            fr: "je t'aime fort",
            emoji: '❤️',
            say: 'ti vo-lio bé-né',
          },
        ],
      },
      {
        id: 'famiglia-3',
        title: 'À la maison',
        words: [
          { id: 'casa', it: 'la casa', fr: 'la maison', emoji: '🏠', say: 'la ka-za' },
          { id: 'camera', it: 'la camera', fr: 'la chambre', emoji: '🛏️', say: 'la ka-mé-ra' },
          { id: 'cucina', it: 'la cucina', fr: 'la cuisine', emoji: '🍳', say: 'la kou-tchi-na' },
          { id: 'giardino', it: 'il giardino', fr: 'le jardin', emoji: '🌳', say: 'il djar-di-no' },
          { id: 'porta', it: 'la porta', fr: 'la porte', emoji: '🚪', say: 'la por-ta' },
          {
            id: 'finestra',
            it: 'la finestra',
            fr: 'la fenêtre',
            emoji: '🪟',
            say: 'la fi-nès-tra',
          },
        ],
      },
    ],
  },
  {
    id: 'animali',
    title: 'Gli animali',
    subtitle: 'Les animaux',
    emoji: '🐶',
    color: '#4cc9a0',
    lessons: [
      {
        id: 'animali-1',
        title: 'À la maison',
        words: [
          { id: 'cane', it: 'il cane', fr: 'le chien', emoji: '🐶', say: 'il ka-né' },
          { id: 'gatto', it: 'il gatto', fr: 'le chat', emoji: '🐱', say: 'il gatto' },
          { id: 'cavallo', it: 'il cavallo', fr: 'le cheval', emoji: '🐴', say: 'il ka-vallo' },
          { id: 'coniglio', it: 'il coniglio', fr: 'le lapin', emoji: '🐰', say: 'il ko-ni-lio' },
          { id: 'uccello', it: "l'uccello", fr: "l'oiseau", emoji: '🐦', say: 'lou-tchèllo' },
          { id: 'pesce', it: 'il pesce', fr: 'le poisson', emoji: '🐟', say: 'il pé-ché' },
        ],
      },
      {
        id: 'animali-2',
        title: 'À la ferme',
        words: [
          { id: 'mucca', it: 'la mucca', fr: 'la vache', emoji: '🐮', say: 'la moukka' },
          { id: 'maiale', it: 'il maiale', fr: 'le cochon', emoji: '🐷', say: 'il ma-ia-lé' },
          { id: 'pecora', it: 'la pecora', fr: 'le mouton', emoji: '🐑', say: 'la pé-ko-ra' },
          { id: 'gallina', it: 'la gallina', fr: 'la poule', emoji: '🐔', say: 'la gal-li-na' },
          { id: 'topo', it: 'il topo', fr: 'la souris', emoji: '🐭', say: 'il to-po' },
          { id: 'ape', it: "l'ape", fr: "l'abeille", emoji: '🐝', say: 'la-pé' },
        ],
      },
      {
        id: 'animali-3',
        title: 'Au zoo',
        words: [
          { id: 'leone', it: 'il leone', fr: 'le lion', emoji: '🦁', say: 'il lé-o-né' },
          { id: 'elefante', it: "l'elefante", fr: "l'éléphant", emoji: '🐘', say: 'lélé-fan-té' },
          { id: 'giraffa', it: 'la giraffa', fr: 'la girafe', emoji: '🦒', say: 'la dji-raffa' },
          { id: 'scimmia', it: 'la scimmia', fr: 'le singe', emoji: '🐒', say: 'la chim-mia' },
          { id: 'orso', it: "l'orso", fr: "l'ours", emoji: '🐻', say: 'lor-so' },
          {
            id: 'tartaruga',
            it: 'la tartaruga',
            fr: 'la tortue',
            emoji: '🐢',
            say: 'la tarta-rou-ga',
          },
        ],
      },
    ],
  },
  {
    id: 'cibo',
    title: 'A tavola!',
    subtitle: 'Manger et boire',
    emoji: '🍕',
    color: '#ff6b6b',
    lessons: [
      {
        id: 'cibo-1',
        title: 'On mange quoi ?',
        words: [
          { id: 'pizza', it: 'la pizza', fr: 'la pizza', emoji: '🍕', say: 'la pit-tsa' },
          { id: 'pasta', it: 'la pasta', fr: 'les pâtes', emoji: '🍝', say: 'la pasta' },
          { id: 'gelato', it: 'il gelato', fr: 'la glace', emoji: '🍨', say: 'il djé-la-to' },
          { id: 'pane', it: 'il pane', fr: 'le pain', emoji: '🍞', say: 'il pa-né' },
          {
            id: 'formaggio',
            it: 'il formaggio',
            fr: 'le fromage',
            emoji: '🧀',
            say: 'il for-mad-djo',
          },
          { id: 'mela', it: 'la mela', fr: 'la pomme', emoji: '🍎', say: 'la mé-la' },
        ],
      },
      {
        id: 'cibo-2',
        title: 'On boit quoi ?',
        words: [
          { id: 'acqua', it: "l'acqua", fr: "l'eau", emoji: '💧', say: 'lak-koua' },
          { id: 'latte', it: 'il latte', fr: 'le lait', emoji: '🥛', say: 'il lat-té' },
          { id: 'succo', it: 'il succo', fr: 'le jus', emoji: '🧃', say: 'il souk-ko' },
          {
            id: 'cioccolata',
            it: 'la cioccolata',
            fr: 'le chocolat',
            emoji: '🍫',
            say: 'la tchok-ko-la-ta',
          },
          { id: 'torta', it: 'la torta', fr: 'le gâteau', emoji: '🎂', say: 'la tor-ta' },
          {
            id: 'biscotto',
            it: 'il biscotto',
            fr: 'le biscuit',
            emoji: '🍪',
            say: 'il bis-kot-to',
          },
        ],
      },
      {
        id: 'cibo-3',
        title: 'À table !',
        words: [
          { id: 'ho-fame', it: 'ho fame', fr: "j'ai faim", emoji: '😋', say: 'o fa-mé' },
          { id: 'ho-sete', it: 'ho sete', fr: "j'ai soif", emoji: '🥤', say: 'o sé-té' },
          { id: 'e-buono', it: 'è buono!', fr: "c'est bon !", emoji: '👌', say: 'è bouo-no' },
          { id: 'mangiamo', it: 'mangiamo!', fr: 'on mange !', emoji: '🍽️', say: 'man-dja-mo' },
          {
            id: 'buon-appetito',
            it: 'buon appetito',
            fr: 'bon appétit',
            emoji: '🥳',
            say: 'bouon appé-ti-to',
          },
          {
            id: 'vorrei-una-pizza',
            it: 'vorrei una pizza',
            fr: 'je voudrais une pizza',
            emoji: '🙋',
            say: 'vor-rèï ouna pit-tsa',
          },
        ],
      },
    ],
  },
  {
    id: 'scuola',
    title: 'A scuola',
    subtitle: "L'école et les jours",
    emoji: '🎒',
    color: '#4895ef',
    lessons: [
      {
        id: 'scuola-1',
        title: 'Dans le cartable',
        words: [
          { id: 'scuola', it: 'la scuola', fr: "l'école", emoji: '🏫', say: 'la skouo-la' },
          { id: 'libro', it: 'il libro', fr: 'le livre', emoji: '📕', say: 'il li-bro' },
          { id: 'penna', it: 'la penna', fr: 'le stylo', emoji: '🖊️', say: 'la pènna' },
          {
            id: 'quaderno',
            it: 'il quaderno',
            fr: 'le cahier',
            emoji: '📓',
            say: 'il koua-dèr-no',
          },
          { id: 'maestra', it: 'la maestra', fr: 'la maîtresse', emoji: '👩‍🏫', say: 'la ma-ès-tra' },
          { id: 'zaino', it: 'lo zaino', fr: 'le cartable', emoji: '🎒', say: 'lo dzaï-no' },
        ],
      },
      {
        id: 'scuola-2',
        title: 'Les jours de la semaine',
        words: [
          { id: 'lunedi', it: 'lunedì', fr: 'lundi', emoji: '1️⃣', say: 'lou-né-di' },
          { id: 'martedi', it: 'martedì', fr: 'mardi', emoji: '2️⃣', say: 'mar-té-di' },
          { id: 'mercoledi', it: 'mercoledì', fr: 'mercredi', emoji: '3️⃣', say: 'mèr-ko-lé-di' },
          { id: 'giovedi', it: 'giovedì', fr: 'jeudi', emoji: '4️⃣', say: 'djo-vé-di' },
          { id: 'venerdi', it: 'venerdì', fr: 'vendredi', emoji: '5️⃣', say: 'vé-nèr-di' },
          { id: 'sabato', it: 'sabato', fr: 'samedi', emoji: '6️⃣', say: 'sa-ba-to' },
        ],
      },
      {
        id: 'scuola-3',
        title: 'Hier, aujourd’hui, demain',
        words: [
          { id: 'domenica', it: 'domenica', fr: 'dimanche', emoji: '🌈', say: 'do-mé-ni-ka' },
          { id: 'oggi', it: 'oggi', fr: "aujourd'hui", emoji: '📍', say: 'od-dji' },
          { id: 'domani', it: 'domani', fr: 'demain', emoji: '➡️', say: 'do-ma-ni' },
          { id: 'ieri', it: 'ieri', fr: 'hier', emoji: '⬅️', say: 'iè-ri' },
          {
            id: 'settimana',
            it: 'la settimana',
            fr: 'la semaine',
            emoji: '🗓️',
            say: 'la sètti-ma-na',
          },
          { id: 'giorno', it: 'il giorno', fr: 'le jour', emoji: '📅', say: 'il djor-no' },
        ],
      },
    ],
  },
];

/** Toutes les leçons du parcours, dans l'ordre de déblocage. */
export const allLessons = units.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unit })),
);

export const allWords = allLessons.flatMap((lesson) => lesson.words);

export function findLesson(lessonId: string) {
  return allLessons.find((lesson) => lesson.id === lessonId);
}

export function findWord(wordId: string) {
  return allWords.find((word) => word.id === wordId);
}
