import { TopBar } from '@/components/layout/top-bar';
import { ContinueCard } from '@/components/path/continue-card';
import { UnitPath } from '@/components/path/unit-path';

export default function HomePage() {
  return (
    <main className="page">
      <TopBar />
      <ContinueCard />
      <UnitPath />
    </main>
  );
}
