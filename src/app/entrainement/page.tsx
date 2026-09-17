import type { Metadata } from 'next';
import { TopBar } from '@/components/layout/top-bar';
import { ReviewIntro } from '@/components/lesson/review-intro';

export const metadata: Metadata = { title: 'Révision' };

export default function ReviewPage() {
  return (
    <main className="page">
      <TopBar />
      <ReviewIntro />
    </main>
  );
}
