import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages ne sert que des fichiers : `next build` écrit tout le site
  // dans `out/`. C'était déjà le cas de fait (toutes les routes étaient
  // prérendues), l'export ne fait que supprimer la partie serveur.
  output: 'export',
  // Chaque page devient `<route>/index.html` plutôt que `<route>.html` :
  // c'est la forme que GitHub Pages sert sans ambiguïté, y compris sur un
  // rechargement en plein milieu d'une leçon.
  trailingSlash: true,
};

export default nextConfig;
