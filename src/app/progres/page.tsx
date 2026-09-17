import type { Metadata } from 'next';
import { TopBar } from '@/components/layout/top-bar';
import { ProgressBoard } from '@/components/progress/progress-board';

export const metadata: Metadata = { title: 'Mes progrès' };

export default function ProgressPage() {
  return (
    <main className="page">
      <TopBar />
      <ProgressBoard />
    </main>
  );
}
