import type { MetadataRoute } from 'next';

/** Le site s'ajoute à l'écran d'accueil du téléphone et s'ouvre alors comme
 *  une application, sans barre d'adresse. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ciao! — apprends l’italien',
    short_name: 'Ciao!',
    description: 'Apprends l’italien en jouant, un peu chaque jour.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff8ec',
    theme_color: '#2bb673',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
