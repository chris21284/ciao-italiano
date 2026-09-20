import { TopBar } from '@/components/layout/top-bar';
import { DailyCard } from '@/components/home/daily-card';
import { UnitPath } from '@/components/path/unit-path';

export default function HomePage() {
  return (
    <main className="page">
      <TopBar />
      <DailyCard />
      <UnitPath />
    </main>
  );
}
