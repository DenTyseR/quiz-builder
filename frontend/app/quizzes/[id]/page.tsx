import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getQuiz, QuizQuestion } from '../../../services/api';

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

function renderAnswer(question: QuizQuestion) {
  if (question.type === 'boolean') {
    return question.answer ? 'True' : 'False';
  }

  if (Array.isArray(question.answer)) {
    return question.answer.join(', ');
  }

  return question.answer;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;
  const quiz = await getQuiz(id).catch(() => null);

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <Link className="back-link" href="/quizzes">
        <ArrowLeft size={18} />
        Back to quizzes
      </Link>
      <section className="page-heading">
        <div>
          <p className="eyebrow">{quiz.questions.length} questions</p>
          <h1>{quiz.title}</h1>
          {quiz.description && <p className="muted">{quiz.description}</p>}
        </div>
      </section>
      <div className="question-stack">
        {quiz.questions.map((question, index) => (
          <article className="panel question-panel" key={question.id}>
            <div className="question-header">
              <h2>Question {index + 1}</h2>
              <span className="pill">{question.type}</span>
            </div>
            <p className="prompt">{question.text}</p>
            {question.type === 'checkbox' && question.options && (
              <ul className="choice-list">
                {question.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            )}
            <p className="answer">
              <span>Stored answer:</span> {renderAnswer(question)}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
