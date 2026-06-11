import { QuizForm } from '../../components/QuizForm';

export default function CreateQuizPage() {
  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Builder</p>
          <h1>Create quiz</h1>
        </div>
      </section>
      <QuizForm />
    </>
  );
}
