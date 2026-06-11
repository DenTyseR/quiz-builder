'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { deleteQuiz, getQuizzes, QuizSummary } from '../services/api';

export function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: number) {
    const previous = quizzes;
    setQuizzes((items) => items.filter((quiz) => quiz.id !== id));

    try {
      await deleteQuiz(id);
    } catch (err) {
      setQuizzes(previous);
      setError(err instanceof Error ? err.message : 'Failed to delete quiz');
    }
  }

  if (isLoading) {
    return <p className="muted">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (quizzes.length === 0) {
    return (
      <section className="empty-state">
        <h2>No quizzes yet</h2>
        <p>Create the first quiz to populate this dashboard.</p>
        <Link className="button primary" href="/create">
          Create quiz
        </Link>
      </section>
    );
  }

  return (
    <div className="list">
      {quizzes.map((quiz) => (
        <article className="quiz-row" key={quiz.id}>
          <Link className="quiz-link" href={`/quizzes/${quiz.id}`}>
            <span className="quiz-title">{quiz.title}</span>
            <span className="muted">
              {quiz.questionCount}{' '}
              {quiz.questionCount === 1 ? 'question' : 'questions'}
            </span>
          </Link>
          <button
            aria-label={`Delete ${quiz.title}`}
            className="icon-button danger"
            onClick={() => void handleDelete(quiz.id)}
            title="Delete quiz"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </article>
      ))}
    </div>
  );
}
