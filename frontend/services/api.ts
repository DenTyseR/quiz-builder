export type QuestionType = 'boolean' | 'input' | 'checkbox';

export type CreateQuestion = {
  text: string;
  type: QuestionType;
  booleanAnswer?: boolean;
  inputAnswer?: string;
  options?: string[];
  correctOptions?: string[];
};

export type CreateQuizPayload = {
  title: string;
  description?: string;
  questions: CreateQuestion[];
};

export type QuizSummary = {
  id: number;
  title: string;
  description?: string | null;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type QuizQuestion = {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  answer?: boolean | string | string[];
};

export type QuizDetail = {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getQuizzes() {
  return request<QuizSummary[]>('/quizzes', { cache: 'no-store' });
}

export function getQuiz(id: string | number) {
  return request<QuizDetail>(`/quizzes/${id}`, { cache: 'no-store' });
}

export function createQuiz(payload: CreateQuizPayload) {
  return request<QuizDetail>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteQuiz(id: number) {
  return request<void>(`/quizzes/${id}`, { method: 'DELETE' });
}
