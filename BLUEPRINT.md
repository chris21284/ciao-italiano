# Refaire ce site ailleurs

Tout ce qu'il faut pour régénérer un site d'apprentissage comme celui-ci —
choix techniques, règles de contenu, mécaniques de jeu, déploiement, et les
pièges qui ont coûté du temps la première fois.

Le site d'origine : apprendre l'italien à une enfant de 10 ans, sur son
téléphone, 10 à 15 minutes par jour, pendant au moins trois mois.

---

## 1. Le cahier des charges, en une page

| Contrainte                                 | Conséquence technique                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| Une enfant de 10 ans, seule devant l'écran | Aucun compte, aucun mot de passe, aucune saisie inutile                      |
| Sur son téléphone, surtout                 | Mobile-first strict : colonne unique, cibles tactiles larges, zoom désactivé |
| 10 à 15 min par jour                       | Le site **mesure le temps** et annonce lui-même la fin de la séance          |
| Au moins trois mois de contenu             | ~950 mots **et** répétition espacée, sinon tout se consomme en une semaine   |
| Revenir tous les jours                     | Série quotidienne, badges, étoiles, niveaux, récompense immédiate            |
| Données d'enfant                           | Tout reste dans le navigateur : rien n'est envoyé nulle part                 |

La dernière ligne décide de presque tout : pas de backend, donc site
entièrement statique, donc hébergement gratuit et déploiement trivial.

---

## 2. Base technique

- **Next.js (App Router)** avec `output: 'export'` et `trailingSlash: true` —
  le build produit `out/`, un dossier de fichiers statiques.
- **React + TypeScript strict** (`noUncheckedIndexedAccess`,
  `noImplicitReturns` compris).
- **CSS Modules**, un fichier par composant. Pas de framework CSS.
- **Vitest + Testing Library**, environnement `jsdom`.
- **pnpm**, **Prettier** (100 colonnes, guillemets simples), **ESLint**
  (`eslint-config-next` + `eslint-config-prettier`).
- **Aucune dépendance applicative** : ni base de données, ni state manager, ni
  bibliothèque d'animation, ni bibliothèque de son.
- **Web Speech API** (`speechSynthesis`, `lang: 'it-IT'`) pour la
  prononciation : aucun fichier audio à héberger, la voix est déjà sur le
  téléphone.
- **GitHub Pages + GitHub Actions** pour l'hébergement, domaine personnalisé
  chez le registrar.

> Si le projet existe déjà dans un autre dépôt maison, reprendre sa base :
> mêmes versions, mêmes conventions, mêmes fichiers de configuration. C'est
> ce qui rend les deux projets maintenables par la même personne.

---

## 3. Conventions de code

- Fichiers en **kebab-case**, un composant par fichier, **exports nommés**
  (pas de `export default`, sauf pages et layouts imposés par Next).
- **Commentaires en français**, et seulement là où le code ne dit pas
  _pourquoi_ : une valeur choisie, un piège contourné, une règle métier.
- Alias `@/` vers `src/`.
- Arborescence :

```
src/
  app/            pages (App Router) : /, /lecon/[id], /entrainement, /progres
  components/     home/ layout/ lesson/ path/ progress/ ui/
  data/           units/ (contenu) + badges.ts
  hooks/          use-progress, use-mounted, use-session-seed
  lib/            logique pure : xp, day, shuffle, exercise-builder,
                  review-schedule, daily, progress-store, progress-stats, speak
  types/          lesson.ts, progress.ts
```

- **Toute la logique testable vit dans `lib/`, en fonctions pures.** Les
  composants ne font qu'afficher et appeler le magasin.

### Le magasin d'état (le point le plus important)

L'état persistant est un **magasin externe** lu par `useSyncExternalStore` —
pas un contexte React, pas un state manager :

```ts
let state: Progress = EMPTY_PROGRESS;
const listeners = new Set<() => void>();

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getSnapshot() {
  return state;
}
export function getServerSnapshot() {
  return EMPTY_PROGRESS;
} // rendu serveur
```

Règles qui vont avec :

- **Lecture et écriture de `localStorage` toujours dans un `try/catch`** :
  navigation privée, quota plein, cookies bloqués ne doivent jamais casser la
  leçon en cours, qui continue en mémoire.
- **Migration à la lecture** : `{ ...EMPTY_PROGRESS, ...stocké }`, plus une
  conversion explicite quand un champ change de forme. Une progression
  enregistrée ne se jette jamais.
- **Identifiants figés** : les clés du contenu servent de clés de progression.
  On ajoute, on ne renomme pas.

### Rendu serveur et pureté React

Trois règles apprises à la dure, que le linter de React applique :

1. `getServerSnapshot` renvoie l'état vide, et tout ce qui dépend du stockage
   n'est affiché qu'après montage, via un hook :

```ts
const noopSubscribe = () => () => {};
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
```

2. **Jamais de `setState` dans un `useEffect`** (règle
   `react-hooks/set-state-in-effect`).
3. **Jamais de `Date.now()` ni de `Math.random()` pendant le rendu** (règle
   `react-hooks/purity`). Le tirage aléatoire des exercices passe donc par un
   petit magasin externe de « graine de séance », relu par
   `useSyncExternalStore`, et renouvelé par un appel explicite. Les mesures de
   temps vivent dans des `useRef` mis à jour dans les gestionnaires
   d'événements.

---

## 4. Modèle de données

```ts
interface Word {
  id: string; // figé : clé de révision
  it: string; // « il gatto »
  fr: string; // « le chat »
  emoji: string; // reconnu avant d'être lu
  say: string; // prononciation « à la française » : « il gatto »
  verb?: { infinitive: string; pronoun: string; form: string }; // formes conjuguées
}

interface Lesson {
  id: string;
  title: string;
  words: Word[];
} // toujours 6 mots
interface Unit {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
}
```

```ts
interface ReviewCard {
  box: number;
  due: string;
} // Leitner + date « AAAA-MM-JJ »

interface Progress {
  name: string | null;
  xp: number;
  streak: number;
  lastDay: string | null;
  xpToday: number;
  secondsToday: number; // c'est lui qui arrête la séance
  lessons: Record<string, { stars: number; attempts: number }>;
  review: Record<string, ReviewCard>;
  badges: string[];
}
```

La conjugaison s'écrit en **tableaux de verbes** (six formes), convertis en
leçons par une fonction : on saisit six lignes, on obtient une leçon, des
exercices et des fiches de révision.

---

## 5. Le moteur pédagogique

### Génération des exercices

Les exercices ne sont pas écrits : ils sont **fabriqués depuis le
vocabulaire**, avec un générateur pseudo-aléatoire **déterministe** (mulberry32

- Fisher-Yates), ce qui les rend testables.

Cinq types, en rotation d'un mot à l'autre :

| Type           | Question                         | Réponse                                  |
| -------------- | -------------------------------- | ---------------------------------------- |
| `choice-it-fr` | le mot italien                   | 4 traductions françaises                 |
| `choice-fr-it` | le mot français                  | 4 traductions italiennes                 |
| `listen`       | le mot prononcé par le téléphone | 4 mots écrits                            |
| `spell`        | le mot français                  | reconstruire l'italien lettre par lettre |
| `conjugate`    | « io ___ _(avere)_ »             | 4 formes **du même verbe**               |

Règles : quatre choix toujours, la bonne réponse toujours présente, jamais de
doublon dans les propositions ; les lettres mélangées ne retombent jamais sur
le mot d'origine ; `spell` est réservé aux mots courts sans espace ; les pièges
d'une conjugaison viennent du même verbe (c'est la confusion à travailler).

### Déroulé d'une séance

- Une question par mot, **le mot raté revient à la fin de la file** : on ne
  quitte jamais un mot sur un échec.
- **3 cœurs** par leçon. À zéro : écran bienveillant et relance immédiate avec
  d'autres questions. Pas de cœurs en révision — elle doit pouvoir s'y
  aventurer sans risque.
- Correction affichée en bandeau collant en bas (à portée de pouce) : bonne
  réponse, prononciation, **et le sens en français sur les questions
  d'écoute** — sans quoi on reconnaît le son sans apprendre le mot.
- Le mot est **toujours prononcé** au moment de la correction, juste ou faux.

### Répétition espacée (indispensable)

Boîtes de Leitner, délais `[0, 1, 2, 4, 8, 16, 32]` jours :

- réponse juste → boîte + 1, revient dans `délai[boîte]` jours ;
- réponse fausse → boîte 0, revient **le jour même** ;
- la révision du jour sert les fiches dues, **les plus en retard d'abord**,
  puis les moins bien sues.

C'est ce mécanisme qui transforme 950 mots en trois mois de séances : un mot
appris coûte environ six passages étalés sur des semaines, et la charge de
révision freine naturellement l'arrivée de nouvelles leçons.

### La séance du jour

- Objectif : **12 minutes**.
- Le temps est compté **question par question**, avec un plafond de **45 s par
  question** : un téléphone posé sur la table ne remplit pas l'objectif.
- L'accueil affiche un anneau de minutes, propose **les révisions dues
  d'abord**, la leçon suivante ensuite.
- À l'objectif : « Séance terminée ! », invitation à revenir demain, et un lien
  discret « Encore un peu ? ». **Invitation, pas verrou** — à décider selon
  l'enfant.

---

## 6. Gamification

| Ressort  | Réglage retenu                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| XP       | 10 par bonne réponse du premier coup, +20 pour une leçon sans faute                                              |
| Niveaux  | paliers espacés de 50 XP de plus à chaque fois (100, 250, 450...), avec des titres (Curieuse → Étoile italienne) |
| Étoiles  | 3 sans faute, 2 avec une, 1 au-delà — **rejouer ne fait jamais perdre d'étoiles**                                |
| Série 🔥 | +1 si la veille est comptée, remise à 1 après un trou, jamais deux fois le même jour                             |
| Cœurs    | 3 par leçon, aucun en révision                                                                                   |
| Parcours | une seule leçon ouverte à la fois, halo animé sur la suivante                                                    |
| Badges   | ~19 paliers (premier pas, 10 → 500 mots, séries 3/7/30 jours, unités, mémoire, XP)                               |
| Fête     | confettis CSS, étoiles qui apparaissent une par une, badge annoncé à l'écran de fin                              |

Principe directeur : **récompenser l'assiduité plus que la performance**, et ne
jamais punir un retour en arrière.

---

## 7. Règles de rédaction du contenu

- **6 mots par leçon, 4 leçons par unité** (la première unité peut en avoir 3).
- Viser **~40 unités / ~160 leçons / ~950 mots** pour trois mois.
- Chaque mot : article inclus (`il gatto`, pas `gatto`), emoji parlant,
  prononciation à la française (`il gat-to`), traduction naturelle.
- Progression thématique du proche au lointain : salutations, couleurs,
  nombres, famille, animaux, nourriture, école, corps, vêtements, maison,
  ville, transports, nature, marché, météo, sports, heure, calendrier, argent,
  positions, émotions, adjectifs, questions, verbes, phrases utiles, métiers,
  pays, musique, cuisine, écrans — puis la conjugaison (présent, passé
  composé, futur).
- Des **phrases entières** dès le début (« ho fame », « che bello! ») : ce sont
  elles qui donnent l'impression de parler.
- Un **test de contenu** garde le fichier honnête : aucun identifiant en
  double, six mots par leçon, tous les champs remplis, cohérence des formes
  conjuguées. C'est le test le plus utile du projet.

---

## 8. Interface

- Colonne unique, `max-width: 520px`, centrée sur grand écran — **pas de
  réagencement** en desktop : c'est un site de téléphone.
- Boutons épais avec ombre pleine qui s'écrase à l'appui, hauteur ≥ 48 px.
- Barre de navigation fixe en bas (Parcours / Révision / Progrès), **masquée
  pendant une leçon**.
- `viewport` avec `maximumScale: 1` et `touch-action: manipulation` : le
  double-tap ne doit pas zoomer entre deux réponses.
- `env(safe-area-inset-bottom)` partout en bas (encoche iPhone).
- Palette chaleureuse, une couleur par unité, emojis comme illustrations —
  aucune image à charger.
- `prefers-reduced-motion` respecté.
- Au-delà d'une dizaine d'unités, **replier le parcours** : seule l'unité en
  cours est ouverte.
- `manifest.webmanifest` pour l'ajout à l'écran d'accueil (avec
  `export const dynamic = 'force-static'` en export statique).

---

## 9. Tests

Tester la logique, pas le rendu :

- `xp` (paliers, étoiles), `day` (série, changement de jour en heure locale),
  `review-schedule` (montée/descente de boîtes, mots dus triés),
  `daily` (objectif, ratio), `shuffle` (déterminisme).
- `exercise-builder` : une question par mot, quatre choix sans doublon, bonne
  réponse présente, lettres mélangées jamais dans l'ordre, même graine → même
  tirage.
- `progress-store` : XP, bonus, étoiles non régressives, fiches mises à jour,
  temps cumulé, badges décrochés une seule fois, persistance relue.
- `content.test.ts` : l'intégrité du contenu (voir §7).

Environnement : `jsdom` **plus un `localStorage` minimal dans
`vitest.setup.ts`**, sans quoi le magasin s'exécute par son chemin de repli.

---

## 10. Déploiement sur GitHub Pages

1. `next.config.ts` : `output: 'export'`, `trailingSlash: true`.
2. `public/CNAME` contenant le domaine — recopié dans `out/` à chaque build,
   ce qui empêche Pages de perdre le domaine.
3. Workflow `.github/workflows/deploy.yml` : `pnpm install --frozen-lockfile`,
   typecheck, lint, tests, `pnpm build`, `touch out/.nojekyll`,
   `actions/configure-pages` → `upload-pages-artifact` (chemin `out`) →
   `deploy-pages`. Permissions `pages: write` et `id-token: write`.
4. **Settings → Pages → Source : GitHub Actions** (surtout pas « Deploy from a
   branch », qui republie le README via Jekyll).
5. Zone DNS chez le registrar :

| Type  | Nom            | Valeur                                                |
| ----- | -------------- | ----------------------------------------------------- |
| A     | _(domaine nu)_ | `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` |
| AAAA  | _(domaine nu)_ | `2606:50c0:8000::153` … `8003::153`                   |
| CNAME | `www`          | `<compte>.github.io.`                                 |

6. Renseigner le domaine dans _Settings → Pages_, attendre le certificat, puis
   cocher **Enforce HTTPS**.

---

## 11. Les pièges qui ont coûté du temps

- **`@` littéral dans la zone DNS.** Certains panneaux (Amen) créent un
  sous-domaine `@.exemple.fr` au lieu du domaine nu. Laisser le champ _Nom_
  vide, et vérifier avec `dig @<serveur-autoritaire> exemple.fr A` — interroger
  le serveur autoritaire, pas un résolveur public, pour ne pas confondre erreur
  et propagation.
- **Jeton GitHub.** Pousser un fichier de workflow exige la permission
  _Workflows_ (fine-grained) ou le scope `workflow` (classique), en plus de
  l'accès au dépôt.
- **Domaine personnalisé obligatoire** avec cette configuration : sans lui, un
  dépôt de projet est servi sous `/<repo>/` et tous les chemins absolus
  cassent. Sinon, ajouter `basePath`.
- **`manifest.ts` en export statique** : sans
  `export const dynamic = 'force-static'`, le build échoue.
- **`.nojekyll`** : sans lui, Pages peut ignorer `_next/` (dossier commençant
  par un souligné).
- **Node ≥ 25 n'embarque plus corepack**, donc plus de `pnpm` : passer par nvm
  ou installer pnpm explicitement.
- **Le linter React moderne refuse** `setState` dans un effet et `Date.now()`
  pendant le rendu (voir §3) : prévoir les magasins externes dès le départ.
- **Le contenu se consomme dix fois plus vite qu'on ne le croit** : sans
  répétition espacée ni limite de séance, trois mois de vocabulaire tiennent en
  une semaine.

---

## 12. Prompt de départ, à recoller tel quel

> Crée un site pour apprendre _\<langue>_ à un enfant de _\<âge>_ ans. Même base
> technique que _\<projet de référence>_ : Next.js App Router en export
> statique, React, TypeScript strict, CSS Modules, Vitest, pnpm, conventions de
> nommage et commentaires en français.
>
> Contraintes : utilisé sur téléphone, sans compte ni backend — toute la
> progression dans le `localStorage`, via un magasin externe lu par
> `useSyncExternalStore`. La prononciation passe par la synthèse vocale du
> navigateur.
>
> Pédagogie : leçons de 6 mots, 4 leçons par unité, ~40 unités couvrant le
> vocabulaire du quotidien **et** la conjugaison. Exercices générés depuis le
> vocabulaire (traduction dans les deux sens, écoute, lettres mélangées,
> conjugaison à compléter), tirage déterministe et testé.
>
> Répétition espacée façon Leitner (1, 2, 4, 8, 16, 32 jours) : la révision du
> jour sert les mots dus. Séance quotidienne de 12 minutes, chronométrée
> question par question, qui annonce elle-même sa fin et invite à revenir
> demain.
>
> Gamification : XP, niveaux titrés, étoiles par leçon, série quotidienne,
> cœurs, badges, confettis. Interface mobile-first, gros boutons, barre du bas,
> parcours replié par unité.
>
> Déploiement : GitHub Pages via GitHub Actions (typecheck, lint, tests avant
> publication), domaine personnalisé par `public/CNAME`.
