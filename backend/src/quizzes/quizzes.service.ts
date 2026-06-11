import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto, CreateQuizDto } from './dto/create-quiz.dto';

type StoredQuestion = {
  id: number;
  text: string;
  type: string;
  options: string | null;
  answer: string | null;
  order: number;
};

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    const quiz = await this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        questions: {
          create: createQuizDto.questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            options: this.stringifyOptions(question),
            answer: this.stringifyAnswer(question),
            order: index,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return this.serializeQuiz(quiz);
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz._count.questions,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }));
  }

  async findOne(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} was not found`);
    }

    return this.serializeQuiz(quiz);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.quiz.delete({ where: { id } });
  }

  private stringifyOptions(question: CreateQuestionDto) {
    return question.type === 'checkbox'
      ? JSON.stringify(question.options ?? [])
      : null;
  }

  private stringifyAnswer(question: CreateQuestionDto) {
    if (question.type === 'boolean') {
      return JSON.stringify(question.booleanAnswer);
    }

    if (question.type === 'input') {
      return JSON.stringify(question.inputAnswer);
    }

    return JSON.stringify(question.correctOptions ?? []);
  }

  private serializeQuiz<T extends { questions: StoredQuestion[] }>(quiz: T) {
    return {
      ...quiz,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options
          ? (JSON.parse(question.options) as string[])
          : undefined,
        answer: question.answer
          ? (JSON.parse(question.answer) as boolean | string | string[])
          : undefined,
      })),
    };
  }
}
