import { Baloo_2, Nunito } from 'next/font/google';

/** Titres : une grotesque arrondie, lisible et joyeuse. */
export const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

/** Texte courant : très lisible en petite taille sur un écran de téléphone. */
export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});
