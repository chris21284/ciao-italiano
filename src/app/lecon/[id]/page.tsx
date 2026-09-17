import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allLessons, findLesson } from '@/data/units';
import { LessonScreen } from '@/components/lesson/lesson-screen';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return allLessons.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lesson = findLesson(id);
  return { title: lesson ? lesson.title : 'Leçon' };
}

export default async function LessonPage({ params }: PageProps) {
  const { id } = await params;
  const lesson = findLesson(id);
  if (!lesson) notFound();

  return <LessonScreen lesson={lesson} />;
}
