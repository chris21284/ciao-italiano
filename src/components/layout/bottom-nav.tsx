'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './bottom-nav.module.css';

const LINKS = [
  { href: '/', label: 'Parcours', emoji: '🗺️' },
  { href: '/entrainement', label: 'Révision', emoji: '🔁' },
  { href: '/progres', label: 'Progrès', emoji: '🏆' },
];

/** Barre du bas, masquée pendant une leçon pour ne pas distraire du jeu. */
export function BottomNav() {
  const pathname = usePathname();
  const isPlaying = pathname.startsWith('/lecon') || pathname.startsWith('/entrainement/jouer');
  if (isPlaying) return null;

  return (
    <nav className={styles.nav} aria-label="Navigation principale">
      {LINKS.map((link) => {
        const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${active ? styles.active : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className={styles.emoji} aria-hidden="true">
              {link.emoji}
            </span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
