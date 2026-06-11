import Link from 'next/link';
import { Plus } from 'lucide-react';
import { QuizList } from '../../components/QuizList';

export default function QuizzesPage() {
  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Quizzes</h1>
        </div>
        <Link className="button primary" href="/create">
          <Plus size={18} />
          New quiz
        </Link>
      </section>
      <QuizList />
    </>
  );
}
