import type { Lesson, Unit, Word } from '@/types/lesson';

/**
 * La conjugaison est écrite sous forme de tableaux, pas de leçons : on saisit
 * six formes par verbe et le reste (mots, exercices, révisions) en découle.
 * C'est ce qui permet d'ajouter un verbe en six lignes.
 */
interface VerbForm {
  pronoun: string;
  /** La forme seule : « sono » dans « io sono ». */
  form: string;
  fr: string;
  say: string;
}

interface VerbTable {
  id: string;
  infinitive: string;
  fr: string;
  emoji: string;
  forms: VerbForm[];
}

function verbLesson(table: VerbTable): Lesson {
  const words: Word[] = table.forms.map((form) => ({
    id: `${table.id}-${form.pronoun}`,
    it: `${form.pronoun} ${form.form}`,
    fr: form.fr,
    emoji: table.emoji,
    say: form.say,
    verb: { infinitive: table.infinitive, pronoun: form.pronoun, form: form.form },
  }));

  return { id: `verbo-${table.id}`, title: `${table.infinitive} — ${table.fr}`, words };
}

const essere: VerbTable = {
  id: 'essere',
  infinitive: 'essere',
  fr: 'être',
  emoji: '🧍',
  forms: [
    { pronoun: 'io', form: 'sono', fr: 'je suis', say: 'io so-no' },
    { pronoun: 'tu', form: 'sei', fr: 'tu es', say: 'tou séï' },
    { pronoun: 'lui', form: 'è', fr: 'il est', say: 'louï è' },
    { pronoun: 'noi', form: 'siamo', fr: 'nous sommes', say: 'noï sia-mo' },
    { pronoun: 'voi', form: 'siete', fr: 'vous êtes', say: 'voï sié-té' },
    { pronoun: 'loro', form: 'sono', fr: 'ils sont', say: 'lo-ro so-no' },
  ],
};

const avere: VerbTable = {
  id: 'avere',
  infinitive: 'avere',
  fr: 'avoir',
  emoji: '🤲',
  forms: [
    { pronoun: 'io', form: 'ho', fr: "j'ai", say: 'io o' },
    { pronoun: 'tu', form: 'hai', fr: 'tu as', say: 'tou aï' },
    { pronoun: 'lui', form: 'ha', fr: 'il a', say: 'louï a' },
    { pronoun: 'noi', form: 'abbiamo', fr: 'nous avons', say: 'noï ab-bia-mo' },
    { pronoun: 'voi', form: 'avete', fr: 'vous avez', say: 'voï a-vé-té' },
    { pronoun: 'loro', form: 'hanno', fr: 'ils ont', say: 'lo-ro an-no' },
  ],
};

const parlare: VerbTable = {
  id: 'parlare',
  infinitive: 'parlare',
  fr: 'parler',
  emoji: '💬',
  forms: [
    { pronoun: 'io', form: 'parlo', fr: 'je parle', say: 'io par-lo' },
    { pronoun: 'tu', form: 'parli', fr: 'tu parles', say: 'tou par-li' },
    { pronoun: 'lui', form: 'parla', fr: 'il parle', say: 'louï par-la' },
    { pronoun: 'noi', form: 'parliamo', fr: 'nous parlons', say: 'noï par-lia-mo' },
    { pronoun: 'voi', form: 'parlate', fr: 'vous parlez', say: 'voï par-la-té' },
    { pronoun: 'loro', form: 'parlano', fr: 'ils parlent', say: 'lo-ro par-la-no' },
  ],
};

const mangiare: VerbTable = {
  id: 'mangiare',
  infinitive: 'mangiare',
  fr: 'manger',
  emoji: '🍝',
  forms: [
    { pronoun: 'io', form: 'mangio', fr: 'je mange', say: 'io man-djo' },
    { pronoun: 'tu', form: 'mangi', fr: 'tu manges', say: 'tou man-dji' },
    { pronoun: 'lui', form: 'mangia', fr: 'il mange', say: 'louï man-dja' },
    { pronoun: 'noi', form: 'mangiamo', fr: 'nous mangeons', say: 'noï man-dja-mo' },
    { pronoun: 'voi', form: 'mangiate', fr: 'vous mangez', say: 'voï man-dja-té' },
    { pronoun: 'loro', form: 'mangiano', fr: 'ils mangent', say: 'lo-ro man-dja-no' },
  ],
};

const giocare: VerbTable = {
  id: 'giocare',
  infinitive: 'giocare',
  fr: 'jouer',
  emoji: '🎲',
  forms: [
    { pronoun: 'io', form: 'gioco', fr: 'je joue', say: 'io djo-ko' },
    { pronoun: 'tu', form: 'giochi', fr: 'tu joues', say: 'tou djo-ki' },
    { pronoun: 'lui', form: 'gioca', fr: 'il joue', say: 'louï djo-ka' },
    { pronoun: 'noi', form: 'giochiamo', fr: 'nous jouons', say: 'noï djo-kia-mo' },
    { pronoun: 'voi', form: 'giocate', fr: 'vous jouez', say: 'voï djo-ka-té' },
    { pronoun: 'loro', form: 'giocano', fr: 'ils jouent', say: 'lo-ro djo-ka-no' },
  ],
};

const abitare: VerbTable = {
  id: 'abitare',
  infinitive: 'abitare',
  fr: 'habiter',
  emoji: '🏠',
  forms: [
    { pronoun: 'io', form: 'abito', fr: "j'habite", say: 'io a-bi-to' },
    { pronoun: 'tu', form: 'abiti', fr: 'tu habites', say: 'tou a-bi-ti' },
    { pronoun: 'lui', form: 'abita', fr: 'il habite', say: 'louï a-bi-ta' },
    { pronoun: 'noi', form: 'abitiamo', fr: 'nous habitons', say: 'noï abi-tia-mo' },
    { pronoun: 'voi', form: 'abitate', fr: 'vous habitez', say: 'voï abi-ta-té' },
    { pronoun: 'loro', form: 'abitano', fr: 'ils habitent', say: 'lo-ro a-bi-ta-no' },
  ],
};

const leggere: VerbTable = {
  id: 'leggere',
  infinitive: 'leggere',
  fr: 'lire',
  emoji: '📖',
  forms: [
    { pronoun: 'io', form: 'leggo', fr: 'je lis', say: 'io lèg-go' },
    { pronoun: 'tu', form: 'leggi', fr: 'tu lis', say: 'tou lèd-dji' },
    { pronoun: 'lui', form: 'legge', fr: 'il lit', say: 'louï lèd-djé' },
    { pronoun: 'noi', form: 'leggiamo', fr: 'nous lisons', say: 'noï lèd-dja-mo' },
    { pronoun: 'voi', form: 'leggete', fr: 'vous lisez', say: 'voï lèd-djé-té' },
    { pronoun: 'loro', form: 'leggono', fr: 'ils lisent', say: 'lo-ro lèg-go-no' },
  ],
};

const scrivere: VerbTable = {
  id: 'scrivere',
  infinitive: 'scrivere',
  fr: 'écrire',
  emoji: '✍️',
  forms: [
    { pronoun: 'io', form: 'scrivo', fr: "j'écris", say: 'io skri-vo' },
    { pronoun: 'tu', form: 'scrivi', fr: 'tu écris', say: 'tou skri-vi' },
    { pronoun: 'lui', form: 'scrive', fr: 'il écrit', say: 'louï skri-vé' },
    { pronoun: 'noi', form: 'scriviamo', fr: 'nous écrivons', say: 'noï skri-via-mo' },
    { pronoun: 'voi', form: 'scrivete', fr: 'vous écrivez', say: 'voï skri-vé-té' },
    { pronoun: 'loro', form: 'scrivono', fr: 'ils écrivent', say: 'lo-ro skri-vo-no' },
  ],
};

const dormire: VerbTable = {
  id: 'dormire',
  infinitive: 'dormire',
  fr: 'dormir',
  emoji: '😴',
  forms: [
    { pronoun: 'io', form: 'dormo', fr: 'je dors', say: 'io dor-mo' },
    { pronoun: 'tu', form: 'dormi', fr: 'tu dors', say: 'tou dor-mi' },
    { pronoun: 'lui', form: 'dorme', fr: 'il dort', say: 'louï dor-mé' },
    { pronoun: 'noi', form: 'dormiamo', fr: 'nous dormons', say: 'noï dor-mia-mo' },
    { pronoun: 'voi', form: 'dormite', fr: 'vous dormez', say: 'voï dor-mi-té' },
    { pronoun: 'loro', form: 'dormono', fr: 'ils dorment', say: 'lo-ro dor-mo-no' },
  ],
};

const aprire: VerbTable = {
  id: 'aprire',
  infinitive: 'aprire',
  fr: 'ouvrir',
  emoji: '🔓',
  forms: [
    { pronoun: 'io', form: 'apro', fr: "j'ouvre", say: 'io a-pro' },
    { pronoun: 'tu', form: 'apri', fr: 'tu ouvres', say: 'tou a-pri' },
    { pronoun: 'lui', form: 'apre', fr: 'il ouvre', say: 'louï a-pré' },
    { pronoun: 'noi', form: 'apriamo', fr: 'nous ouvrons', say: 'noï a-pria-mo' },
    { pronoun: 'voi', form: 'aprite', fr: 'vous ouvrez', say: 'voï a-pri-té' },
    { pronoun: 'loro', form: 'aprono', fr: 'ils ouvrent', say: 'lo-ro a-pro-no' },
  ],
};

const andare: VerbTable = {
  id: 'andare',
  infinitive: 'andare',
  fr: 'aller',
  emoji: '🚶‍♀️',
  forms: [
    { pronoun: 'io', form: 'vado', fr: 'je vais', say: 'io va-do' },
    { pronoun: 'tu', form: 'vai', fr: 'tu vas', say: 'tou vaï' },
    { pronoun: 'lui', form: 'va', fr: 'il va', say: 'louï va' },
    { pronoun: 'noi', form: 'andiamo', fr: 'nous allons', say: 'noï an-dia-mo' },
    { pronoun: 'voi', form: 'andate', fr: 'vous allez', say: 'voï an-da-té' },
    { pronoun: 'loro', form: 'vanno', fr: 'ils vont', say: 'lo-ro van-no' },
  ],
};

const fare: VerbTable = {
  id: 'fare',
  infinitive: 'fare',
  fr: 'faire',
  emoji: '🛠️',
  forms: [
    { pronoun: 'io', form: 'faccio', fr: 'je fais', say: 'io fat-tcho' },
    { pronoun: 'tu', form: 'fai', fr: 'tu fais', say: 'tou faï' },
    { pronoun: 'lui', form: 'fa', fr: 'il fait', say: 'louï fa' },
    { pronoun: 'noi', form: 'facciamo', fr: 'nous faisons', say: 'noï fat-tcha-mo' },
    { pronoun: 'voi', form: 'fate', fr: 'vous faites', say: 'voï fa-té' },
    { pronoun: 'loro', form: 'fanno', fr: 'ils font', say: 'lo-ro fan-no' },
  ],
};

const venire: VerbTable = {
  id: 'venire',
  infinitive: 'venire',
  fr: 'venir',
  emoji: '🙋',
  forms: [
    { pronoun: 'io', form: 'vengo', fr: 'je viens', say: 'io vèn-go' },
    { pronoun: 'tu', form: 'vieni', fr: 'tu viens', say: 'tou vié-ni' },
    { pronoun: 'lui', form: 'viene', fr: 'il vient', say: 'louï vié-né' },
    { pronoun: 'noi', form: 'veniamo', fr: 'nous venons', say: 'noï vé-nia-mo' },
    { pronoun: 'voi', form: 'venite', fr: 'vous venez', say: 'voï vé-ni-té' },
    { pronoun: 'loro', form: 'vengono', fr: 'ils viennent', say: 'lo-ro vèn-go-no' },
  ],
};

const dire: VerbTable = {
  id: 'dire',
  infinitive: 'dire',
  fr: 'dire',
  emoji: '🗣️',
  forms: [
    { pronoun: 'io', form: 'dico', fr: 'je dis', say: 'io di-ko' },
    { pronoun: 'tu', form: 'dici', fr: 'tu dis', say: 'tou di-tchi' },
    { pronoun: 'lui', form: 'dice', fr: 'il dit', say: 'louï di-tché' },
    { pronoun: 'noi', form: 'diciamo', fr: 'nous disons', say: 'noï di-tcha-mo' },
    { pronoun: 'voi', form: 'dite', fr: 'vous dites', say: 'voï di-té' },
    { pronoun: 'loro', form: 'dicono', fr: 'ils disent', say: 'lo-ro di-ko-no' },
  ],
};

const potere: VerbTable = {
  id: 'potere',
  infinitive: 'potere',
  fr: 'pouvoir',
  emoji: '🙌',
  forms: [
    { pronoun: 'io', form: 'posso', fr: 'je peux', say: 'io pos-so' },
    { pronoun: 'tu', form: 'puoi', fr: 'tu peux', say: 'tou pouoï' },
    { pronoun: 'lui', form: 'può', fr: 'il peut', say: 'louï pouo' },
    { pronoun: 'noi', form: 'possiamo', fr: 'nous pouvons', say: 'noï pos-sia-mo' },
    { pronoun: 'voi', form: 'potete', fr: 'vous pouvez', say: 'voï po-té-té' },
    { pronoun: 'loro', form: 'possono', fr: 'ils peuvent', say: 'lo-ro pos-so-no' },
  ],
};

const volere: VerbTable = {
  id: 'volere',
  infinitive: 'volere',
  fr: 'vouloir',
  emoji: '⭐',
  forms: [
    { pronoun: 'io', form: 'voglio', fr: 'je veux', say: 'io vo-lio' },
    { pronoun: 'tu', form: 'vuoi', fr: 'tu veux', say: 'tou vouoï' },
    { pronoun: 'lui', form: 'vuole', fr: 'il veut', say: 'louï vouo-lé' },
    { pronoun: 'noi', form: 'vogliamo', fr: 'nous voulons', say: 'noï vo-lia-mo' },
    { pronoun: 'voi', form: 'volete', fr: 'vous voulez', say: 'voï vo-lé-té' },
    { pronoun: 'loro', form: 'vogliono', fr: 'ils veulent', say: 'lo-ro vo-lio-no' },
  ],
};

const dovere: VerbTable = {
  id: 'dovere',
  infinitive: 'dovere',
  fr: 'devoir',
  emoji: '📋',
  forms: [
    { pronoun: 'io', form: 'devo', fr: 'je dois', say: 'io dé-vo' },
    { pronoun: 'tu', form: 'devi', fr: 'tu dois', say: 'tou dé-vi' },
    { pronoun: 'lui', form: 'deve', fr: 'il doit', say: 'louï dé-vé' },
    { pronoun: 'noi', form: 'dobbiamo', fr: 'nous devons', say: 'noï dob-bia-mo' },
    { pronoun: 'voi', form: 'dovete', fr: 'vous devez', say: 'voï do-vé-té' },
    { pronoun: 'loro', form: 'devono', fr: 'ils doivent', say: 'lo-ro dé-vo-no' },
  ],
};

const sapere: VerbTable = {
  id: 'sapere',
  infinitive: 'sapere',
  fr: 'savoir',
  emoji: '🧠',
  forms: [
    { pronoun: 'io', form: 'so', fr: 'je sais', say: 'io so' },
    { pronoun: 'tu', form: 'sai', fr: 'tu sais', say: 'tou saï' },
    { pronoun: 'lui', form: 'sa', fr: 'il sait', say: 'louï sa' },
    { pronoun: 'noi', form: 'sappiamo', fr: 'nous savons', say: 'noï sap-pia-mo' },
    { pronoun: 'voi', form: 'sapete', fr: 'vous savez', say: 'voï sa-pé-té' },
    { pronoun: 'loro', form: 'sanno', fr: 'ils savent', say: 'lo-ro san-no' },
  ],
};

const essereFuturo: VerbTable = {
  id: 'essere-futuro',
  infinitive: 'essere (futuro)',
  fr: 'être, plus tard',
  emoji: '🔮',
  forms: [
    { pronoun: 'io', form: 'sarò', fr: 'je serai', say: 'io sa-ro' },
    { pronoun: 'tu', form: 'sarai', fr: 'tu seras', say: 'tou sa-raï' },
    { pronoun: 'lui', form: 'sarà', fr: 'il sera', say: 'louï sa-ra' },
    { pronoun: 'noi', form: 'saremo', fr: 'nous serons', say: 'noï sa-ré-mo' },
    { pronoun: 'voi', form: 'sarete', fr: 'vous serez', say: 'voï sa-ré-té' },
    { pronoun: 'loro', form: 'saranno', fr: 'ils seront', say: 'lo-ro sa-ran-no' },
  ],
};

const avereFuturo: VerbTable = {
  id: 'avere-futuro',
  infinitive: 'avere (futuro)',
  fr: 'avoir, plus tard',
  emoji: '🔮',
  forms: [
    { pronoun: 'io', form: 'avrò', fr: "j'aurai", say: 'io a-vro' },
    { pronoun: 'tu', form: 'avrai', fr: 'tu auras', say: 'tou a-vraï' },
    { pronoun: 'lui', form: 'avrà', fr: 'il aura', say: 'louï a-vra' },
    { pronoun: 'noi', form: 'avremo', fr: 'nous aurons', say: 'noï a-vré-mo' },
    { pronoun: 'voi', form: 'avrete', fr: 'vous aurez', say: 'voï a-vré-té' },
    { pronoun: 'loro', form: 'avranno', fr: 'ils auront', say: 'lo-ro a-vran-no' },
  ],
};

const andareFuturo: VerbTable = {
  id: 'andare-futuro',
  infinitive: 'andare (futuro)',
  fr: 'aller, plus tard',
  emoji: '🛫',
  forms: [
    { pronoun: 'io', form: 'andrò', fr: "j'irai", say: 'io an-dro' },
    { pronoun: 'tu', form: 'andrai', fr: 'tu iras', say: 'tou an-draï' },
    { pronoun: 'lui', form: 'andrà', fr: 'il ira', say: 'louï an-dra' },
    { pronoun: 'noi', form: 'andremo', fr: 'nous irons', say: 'noï an-dré-mo' },
    { pronoun: 'voi', form: 'andrete', fr: 'vous irez', say: 'voï an-dré-té' },
    { pronoun: 'loro', form: 'andranno', fr: 'ils iront', say: 'lo-ro an-dran-no' },
  ],
};

const fareFuturo: VerbTable = {
  id: 'fare-futuro',
  infinitive: 'fare (futuro)',
  fr: 'faire, plus tard',
  emoji: '🛠️',
  forms: [
    { pronoun: 'io', form: 'farò', fr: 'je ferai', say: 'io fa-ro' },
    { pronoun: 'tu', form: 'farai', fr: 'tu feras', say: 'tou fa-raï' },
    { pronoun: 'lui', form: 'farà', fr: 'il fera', say: 'louï fa-ra' },
    { pronoun: 'noi', form: 'faremo', fr: 'nous ferons', say: 'noï fa-ré-mo' },
    { pronoun: 'voi', form: 'farete', fr: 'vous ferez', say: 'voï fa-ré-té' },
    { pronoun: 'loro', form: 'faranno', fr: 'ils feront', say: 'lo-ro fa-ran-no' },
  ],
};

/** Sixième chapitre : la conjugaison, puis le passé. */
export const verbUnits: Unit[] = [
  {
    id: 'essere-avere',
    title: 'Essere e avere',
    subtitle: 'Les deux verbes les plus utiles',
    emoji: '🔑',
    color: '#c9484f',
    lessons: [
      verbLesson(essere),
      verbLesson(avere),
      {
        id: 'frasi-essere',
        title: 'Des phrases avec essere',
        words: [
          { id: 'sono-qui', it: 'sono qui', fr: 'je suis ici', emoji: '📍', say: 'so-no koui' },
          { id: 'sei-bravo', it: 'sei bravo', fr: 'tu es doué', emoji: '👏', say: 'séï bra-vo' },
          { id: 'e-tardi', it: 'è tardi', fr: 'il est tard', emoji: '🌙', say: 'è tar-di' },
          {
            id: 'siamo-amici',
            it: 'siamo amici',
            fr: 'nous sommes amis',
            emoji: '🫂',
            say: 'sia-mo a-mi-tchi',
          },
          {
            id: 'siete-pronti',
            it: 'siete pronti?',
            fr: 'vous êtes prêts ?',
            emoji: '🏁',
            say: 'sié-té pron-ti',
          },
          {
            id: 'sono-felici',
            it: 'sono felici',
            fr: 'ils sont heureux',
            emoji: '🎈',
            say: 'so-no fé-li-tchi',
          },
        ],
      },
      {
        id: 'frasi-avere',
        title: 'Des phrases avec avere',
        words: [
          {
            id: 'ho-un-cane',
            it: 'ho un cane',
            fr: "j'ai un chien",
            emoji: '🐶',
            say: 'o oun ka-né',
          },
          {
            id: 'hai-ragione',
            it: 'hai ragione',
            fr: 'tu as raison',
            emoji: '✅',
            say: 'aï ra-djo-né',
          },
          { id: 'ha-fame', it: 'ha fame', fr: 'il a faim', emoji: '🍽️', say: 'a fa-mé' },
          {
            id: 'abbiamo-tempo',
            it: 'abbiamo tempo',
            fr: 'nous avons le temps',
            emoji: '⏳',
            say: 'ab-bia-mo tèm-po',
          },
          {
            id: 'avete-fratelli',
            it: 'avete fratelli?',
            fr: 'vous avez des frères ?',
            emoji: '👦',
            say: 'a-vé-té fra-tèlli',
          },
          {
            id: 'hanno-paura',
            it: 'hanno paura',
            fr: 'ils ont peur',
            emoji: '😨',
            say: 'an-no pa-ou-ra',
          },
        ],
      },
    ],
  },
  {
    id: 'verbi-are',
    title: 'I verbi in -are',
    subtitle: 'La première famille de verbes',
    emoji: '1️⃣',
    color: '#d98324',
    lessons: [verbLesson(parlare), verbLesson(mangiare), verbLesson(giocare), verbLesson(abitare)],
  },
  {
    id: 'verbi-ere-ire',
    title: 'I verbi in -ere e -ire',
    subtitle: 'Les deux autres familles',
    emoji: '2️⃣',
    color: '#3f8f7c',
    lessons: [verbLesson(leggere), verbLesson(scrivere), verbLesson(dormire), verbLesson(aprire)],
  },
  {
    id: 'verbi-irregolari',
    title: 'I verbi irregolari',
    subtitle: 'Ceux qui font à leur tête',
    emoji: '🌀',
    color: '#8155c6',
    lessons: [verbLesson(andare), verbLesson(fare), verbLesson(venire), verbLesson(dire)],
  },
  {
    id: 'verbi-modali',
    title: 'Potere, volere, dovere',
    subtitle: 'Pouvoir, vouloir, devoir, savoir',
    emoji: '🗝️',
    color: '#2f7fb5',
    lessons: [verbLesson(potere), verbLesson(volere), verbLesson(dovere), verbLesson(sapere)],
  },
  {
    id: 'passato',
    title: 'Il passato',
    subtitle: 'Raconter ce qu’on a fait',
    emoji: '⏪',
    color: '#a2678a',
    lessons: [
      {
        id: 'passato-1',
        title: 'Hier, j’ai...',
        words: [
          {
            id: 'ho-mangiato',
            it: 'ho mangiato',
            fr: "j'ai mangé",
            emoji: '🍝',
            say: 'o man-dja-to',
          },
          { id: 'ho-bevuto', it: 'ho bevuto', fr: "j'ai bu", emoji: '🥤', say: 'o bé-vou-to' },
          { id: 'ho-giocato', it: 'ho giocato', fr: "j'ai joué", emoji: '🎲', say: 'o djo-ka-to' },
          { id: 'ho-dormito', it: 'ho dormito', fr: "j'ai dormi", emoji: '😴', say: 'o dor-mi-to' },
          { id: 'ho-letto', it: 'ho letto', fr: "j'ai lu", emoji: '📖', say: 'o lèt-to' },
          { id: 'ho-scritto', it: 'ho scritto', fr: "j'ai écrit", emoji: '✍️', say: 'o skrit-to' },
        ],
      },
      {
        id: 'passato-2',
        title: 'Tu as, il a...',
        words: [
          { id: 'hai-visto', it: 'hai visto', fr: 'tu as vu', emoji: '👀', say: 'aï vis-to' },
          { id: 'ha-detto', it: 'ha detto', fr: 'il a dit', emoji: '🗣️', say: 'a dèt-to' },
          {
            id: 'abbiamo-fatto',
            it: 'abbiamo fatto',
            fr: 'nous avons fait',
            emoji: '🛠️',
            say: 'ab-bia-mo fat-to',
          },
          {
            id: 'avete-finito',
            it: 'avete finito',
            fr: 'vous avez fini',
            emoji: '🏁',
            say: 'a-vé-té fi-ni-to',
          },
          {
            id: 'hanno-parlato',
            it: 'hanno parlato',
            fr: 'ils ont parlé',
            emoji: '💬',
            say: 'an-no par-la-to',
          },
          {
            id: 'hai-sentito',
            it: 'hai sentito',
            fr: 'tu as entendu',
            emoji: '👂',
            say: 'aï sèn-ti-to',
          },
        ],
      },
      {
        id: 'passato-3',
        title: 'Le passé avec essere',
        words: [
          {
            id: 'sono-andata',
            it: 'sono andata',
            fr: 'je suis allée',
            emoji: '🚶‍♀️',
            say: 'so-no an-da-ta',
          },
          {
            id: 'sei-venuto',
            it: 'sei venuto',
            fr: 'tu es venu',
            emoji: '🙋',
            say: 'séï vé-nou-to',
          },
          { id: 'e-uscito', it: 'è uscito', fr: 'il est sorti', emoji: '🚪', say: 'è ou-chi-to' },
          {
            id: 'siamo-tornati',
            it: 'siamo tornati',
            fr: 'nous sommes revenus',
            emoji: '🔄',
            say: 'sia-mo tor-na-ti',
          },
          {
            id: 'siete-partiti',
            it: 'siete partiti',
            fr: 'vous êtes partis',
            emoji: '🧳',
            say: 'sié-té par-ti-ti',
          },
          {
            id: 'sono-arrivati',
            it: 'sono arrivati',
            fr: 'ils sont arrivés',
            emoji: '🎯',
            say: 'so-no arri-va-ti',
          },
        ],
      },
      {
        id: 'passato-4',
        title: 'Raconter dans l’ordre',
        words: [
          { id: 'ieri-sera', it: 'ieri sera', fr: 'hier soir', emoji: '🌆', say: 'iè-ri sé-ra' },
          {
            id: 'settimana-scorsa',
            it: 'la settimana scorsa',
            fr: 'la semaine dernière',
            emoji: '📅',
            say: 'la sètti-ma-na skor-sa',
          },
          { id: 'poi', it: 'poi', fr: 'ensuite', emoji: '➡️', say: 'poï' },
          { id: 'dopo', it: 'dopo', fr: 'après', emoji: '⏭️', say: 'do-po' },
          { id: 'prima', it: 'prima', fr: 'avant', emoji: '⏮️', say: 'pri-ma' },
          { id: 'alla-fine', it: 'alla fine', fr: 'à la fin', emoji: '🏁', say: 'al-la fi-né' },
        ],
      },
    ],
  },
  {
    id: 'futuro',
    title: 'Il futuro',
    subtitle: 'Dire ce qu’on fera',
    emoji: '🔮',
    color: '#5e60ce',
    lessons: [
      verbLesson(essereFuturo),
      verbLesson(avereFuturo),
      verbLesson(andareFuturo),
      verbLesson(fareFuturo),
    ],
  },
];
