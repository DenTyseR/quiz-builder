'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createQuiz, QuestionType } from '../services/api';

type QuestionForm = {
  id: string;
  text: string;
  type: QuestionType;
  booleanAnswer: boolean;
  inputAnswer: string;
  options: string[];
  correctOptions: string[];
};

const createQuestion = (): QuestionForm => ({
  id: crypto.randomUUID(),
  text: '',
  type: 'boolean',
  booleanAnswer: true,
  inputAnswer: '',
  options: ['Option A', 'Option B'],
  correctOptions: ['Option A'],
});

export function QuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    createQuestion(),
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateQuestion(id: string, patch: Partial<QuestionForm>) {
    setQuestions((items) =>
      items.map((question) =>
        question.id === id ? { ...question, ...patch } : question,
      ),
    );
  }

  function updateOption(questionId: string, index: number, value: string) {
    setQuestions((items) =>
      items.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const previousValue = question.options[index];
        const options = question.options.map((option, optionIndex) =>
          optionIndex === index ? value : option,
        );
        const correctOptions = question.correctOptions.map((option) =>
          option === previousValue ? value : option,
        );

        return { ...question, options, correctOptions };
      }),
    );
  }

  function addOption(questionId: string) {
    setQuestions((items) =>
      items.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                `Option ${question.options.length + 1}`,
              ],
            }
          : question,
      ),
    );
  }

  function removeOption(questionId: string, index: number) {
    setQuestions((items) =>
      items.map((question) => {
        if (question.id !== questionId || question.options.length <= 2) {
          return question;
        }

        const removed = question.options[index];
        const options = question.options.filter(
          (_, itemIndex) => itemIndex !== index,
        );
        const correctOptions = question.correctOptions.filter(
          (option) => option !== removed,
        );

        return {
          ...question,
          options,
          correctOptions: correctOptions.length ? correctOptions : [options[0]],
        };
      }),
    );
  }

  function toggleCorrectOption(questionId: string, option: string) {
    setQuestions((items) =>
      items.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const isSelected = question.correctOptions.includes(option);
        const correctOptions = isSelected
          ? question.correctOptions.filter((item) => item !== option)
          : [...question.correctOptions, option];

        return {
          ...question,
          correctOptions: correctOptions.length ? correctOptions : [option],
        };
      }),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const quiz = await createQuiz({
        title,
        description: description || undefined,
        questions: questions.map((question) => ({
          text: question.text,
          type: question.type,
          booleanAnswer:
            question.type === 'boolean' ? question.booleanAnswer : undefined,
          inputAnswer:
            question.type === 'input' ? question.inputAnswer : undefined,
          options: question.type === 'checkbox' ? question.options : undefined,
          correctOptions:
            question.type === 'checkbox' ? question.correctOptions : undefined,
        })),
      });

      router.push(`/quizzes/${quiz.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="builder" onSubmit={(event) => void handleSubmit(event)}>
      <fieldset className="panel">
        <label>
          <span>Quiz title</span>
          <input
            onChange={(event) => setTitle(event.target.value)}
            placeholder="JavaScript fundamentals"
            required
            value={title}
          />
        </label>
        <label>
          <span>Description</span>
          <textarea
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional context for this quiz"
            value={description}
          />
        </label>
      </fieldset>

      <div className="question-stack">
        {questions.map((question, index) => (
          <fieldset className="panel question-panel" key={question.id}>
            <div className="question-header">
              <h2>Question {index + 1}</h2>
              <button
                aria-label={`Remove question ${index + 1}`}
                className="icon-button danger"
                disabled={questions.length === 1}
                onClick={() =>
                  setQuestions((items) =>
                    items.filter((item) => item.id !== question.id),
                  )
                }
                title="Remove question"
                type="button"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <label>
              <span>Prompt</span>
              <input
                onChange={(event) =>
                  updateQuestion(question.id, { text: event.target.value })
                }
                placeholder="Enter the question"
                required
                value={question.text}
              />
            </label>

            <label>
              <span>Question type</span>
              <select
                onChange={(event) =>
                  updateQuestion(question.id, {
                    type: event.target.value as QuestionType,
                  })
                }
                value={question.type}
              >
                <option value="boolean">Boolean</option>
                <option value="input">Input</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </label>

            {question.type === 'boolean' && (
              <div className="inline-options">
                <label>
                  <input
                    checked={question.booleanAnswer}
                    name={`boolean-${question.id}`}
                    onChange={() =>
                      updateQuestion(question.id, { booleanAnswer: true })
                    }
                    type="radio"
                  />
                  True
                </label>
                <label>
                  <input
                    checked={!question.booleanAnswer}
                    name={`boolean-${question.id}`}
                    onChange={() =>
                      updateQuestion(question.id, { booleanAnswer: false })
                    }
                    type="radio"
                  />
                  False
                </label>
              </div>
            )}

            {question.type === 'input' && (
              <label>
                <span>Expected answer</span>
                <input
                  onChange={(event) =>
                    updateQuestion(question.id, {
                      inputAnswer: event.target.value,
                    })
                  }
                  placeholder="Short text answer"
                  required
                  value={question.inputAnswer}
                />
              </label>
            )}

            {question.type === 'checkbox' && (
              <div className="options-editor">
                <div className="subheader">
                  <span>Choices</span>
                  <button
                    className="button secondary compact"
                    onClick={() => addOption(question.id)}
                    type="button"
                  >
                    <Plus size={16} />
                    Add choice
                  </button>
                </div>
                {question.options.map((option, optionIndex) => (
                  <div
                    className="option-row"
                    key={`${question.id}-${optionIndex}`}
                  >
                    <input
                      aria-label={`Correct choice ${optionIndex + 1}`}
                      checked={question.correctOptions.includes(option)}
                      onChange={() => toggleCorrectOption(question.id, option)}
                      type="checkbox"
                    />
                    <input
                      aria-label={`Choice ${optionIndex + 1}`}
                      onChange={(event) =>
                        updateOption(
                          question.id,
                          optionIndex,
                          event.target.value,
                        )
                      }
                      required
                      value={option}
                    />
                    <button
                      aria-label={`Remove choice ${optionIndex + 1}`}
                      className="icon-button"
                      disabled={question.options.length <= 2}
                      onClick={() => removeOption(question.id, optionIndex)}
                      title="Remove choice"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button
          className="button secondary"
          onClick={() => setQuestions((items) => [...items, createQuestion()])}
          type="button"
        >
          <Plus size={18} />
          Add question
        </button>
        <button
          className="button primary"
          disabled={isSubmitting}
          type="submit"
        >
          <Save size={18} />
          {isSubmitting ? 'Saving...' : 'Save quiz'}
        </button>
      </div>
    </form>
  );
}
