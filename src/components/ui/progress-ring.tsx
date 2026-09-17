import styles from './progress-ring.module.css';

interface ProgressRingProps {
  /** Avancement entre 0 et 1. */
  ratio: number;
  label: string;
  children: React.ReactNode;
}

/** Anneau de progression dessiné en `conic-gradient` : pas de SVG à animer. */
export function ProgressRing({ ratio, label, children }: ProgressRingProps) {
  return (
    <div
      className={styles.ring}
      style={{ '--ratio': `${Math.max(0, Math.min(ratio, 1)) * 360}deg` } as React.CSSProperties}
      role="img"
      aria-label={label}
    >
      <span className={styles.inner}>{children}</span>
    </div>
  );
}
