import type { Metadata, Viewport } from 'next';
import { baloo, nunito } from '@/lib/fonts';
import { BottomNav } from '@/components/layout/bottom-nav';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ciao! — apprends l’italien',
    template: '%s | Ciao!',
  },
  description:
    'Apprends l’italien en jouant : des leçons courtes, des étoiles, des séries et des badges à collectionner.',
  applicationName: 'Ciao!',
  appleWebApp: { capable: true, title: 'Ciao!', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Le site se joue au doigt : on évite le zoom accidentel entre deux réponses.
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#2bb673',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
