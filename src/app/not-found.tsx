import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <p style={{ fontSize: '3rem' }}>🤷‍♀️</p>
      <h1 style={{ marginBottom: 8 }}>Page introuvable</h1>
      <p style={{ marginBottom: 24, fontWeight: 700, color: 'var(--ink-soft)' }}>
        Cette page n’existe pas (ou plus).
      </p>
      <Link href="/" className="bigButton">
        Retour au parcours
      </Link>
    </main>
  );
}
