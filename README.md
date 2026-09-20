# Ciao! — apprendre l'italien en jouant

Petit site d'apprentissage de l'italien pour une enfant de 10 ans, pensé pour
être utilisé au doigt, sur un téléphone.

Même base technique que `le-citron-presse/next-app` : Next.js (App Router),
React, TypeScript strict, CSS Modules, Vitest, pnpm. Le site est exporté en
fichiers statiques et hébergé par GitHub Pages sur
[japprends-litalien.fr](https://japprends-litalien.fr).

## Démarrer

```bash
pnpm install
pnpm dev
```

Le site s'ouvre sur http://localhost:3005 (le script `dev` fixe ce port, pour
ne pas entrer en conflit avec le Citron Pressé sur le 3000).

| Commande         | Effet                                    |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | serveur de développement                 |
| `pnpm build`     | build de production (entièrement static) |
| `pnpm test`      | tests unitaires (Vitest)                 |
| `pnpm lint`      | ESLint                                   |
| `pnpm typecheck` | TypeScript                               |
| `pnpm format`    | Prettier                                 |

## Comment c'est fait

- **Aucun compte, aucun serveur.** La progression (XP, série, étoiles, badges,
  mots à revoir) vit dans le `localStorage` du téléphone, lue par un magasin
  externe (`src/lib/progress-store.ts`) branché sur `useSyncExternalStore`,
  exactement comme le panier du Citron Pressé. Rien à administrer, rien à
  héberger, et pas de données d'enfant qui circulent.
- **Le contenu est du code.** `src/data/units/` contient 42 unités, 161 leçons
  et 966 mots (avec emoji et prononciation « à la française »), dont 132 formes
  conjuguées (présent et futur) écrites sous forme de tableaux de verbes. Pour enrichir le site,
  on ajoute des entrées : le parcours, les statistiques et les badges suivent
  tout seuls, et `content.test.ts` refuse les doublons d'identifiants.
- **Les exercices sont générés.** `src/lib/exercise-builder.ts` fabrique, à
  partir des mots d'une leçon, cinq types de questions (italien → français,
  français → italien, écoute, mot à reconstruire lettre par lettre, et
  conjugaison à compléter). Le tirage est déterministe à graine égale, donc
  testable.
- **La répétition espacée étale le parcours.** Chaque mot a une fiche (boîtes
  de Leitner, `src/lib/review-schedule.ts`) : une réussite le repousse à 1, 2,
  4, 8, 16 puis 32 jours, une erreur le ramène au lendemain. La révision du
  jour sert ces fiches-là, pas une liste figée.
- **La séance s'arrête toute seule.** Le temps réellement passé à répondre est
  compté question par question (45 s maximum par question, pour ne pas compter
  un téléphone posé). À douze minutes, l'accueil annonce la fin de la séance et
  invite à revenir demain — un lien « Encore un peu ? » reste là pour les jours
  d'envie.
- **La voix est celle du téléphone.** La prononciation passe par la synthèse
  vocale du navigateur en `it-IT` (`src/lib/speak.ts`) : aucun fichier audio à
  héberger.

## La gamification

| Ressort              | Où ça se joue                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| XP et niveaux        | 10 XP par bonne réponse, +20 pour une leçon sans faute ; niveaux titrés (Curieuse, Apprentie, ... Étoile italienne) |
| Série quotidienne 🔥 | un jour manqué et la série retombe à zéro — le retour du lendemain                                                  |
| Objectif du jour     | anneau de progression sur 100 XP, visible sur chaque écran                                                          |
| Étoiles              | 3 étoiles pour un sans-faute, et une leçon rejouée ne fait jamais perdre d'étoiles                                  |
| Cœurs                | 3 cœurs par leçon : l'erreur coûte quelque chose, sans jamais bloquer (on recommence tout de suite)                 |
| Parcours à débloquer | une seule leçon ouverte à la fois, avec un halo sur la suivante                                                     |
| Badges               | 12 trophées (premier pas, 10/50/100 mots, séries, unités, 1000 XP...)                                               |
| Révision             | les mots ratés reviennent dans une séance sans cœurs ni étoiles                                                     |

## Ajouter à l'écran d'accueil

Le site est installable (`manifest.webmanifest`) : depuis Safari ou Chrome sur
le téléphone, « Ajouter à l'écran d'accueil » l'ouvre ensuite comme une
application, sans barre d'adresse.

## Déploiement

`next.config.ts` active `output: 'export'` : `pnpm build` écrit tout le site
dans `out/`, sans aucune partie serveur. Le workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) rejoue le
typecheck, le lint et les tests, puis publie `out/` sur GitHub Pages à chaque
poussée sur `main`.

Pour relire le site exporté exactement comme Pages le servira :

```bash
pnpm build && python3 -m http.server 3006 --directory out
```

Le domaine est déclaré dans `public/CNAME` (recopié dans `out/` au build), et
la zone DNS chez Amen pointe l'apex vers les quatre adresses de GitHub Pages,
plus un CNAME `www` vers `chris21284.github.io`.
