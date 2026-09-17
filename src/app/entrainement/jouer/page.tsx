import type { Metadata } from 'next';
import { ReviewScreen } from '@/components/lesson/review-screen';

export const metadata: Metadata = { title: 'Révision' };

export default function ReviewPlayPage() {
  return <ReviewScreen />;
}
