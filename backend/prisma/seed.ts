import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'A small sample quiz for local development.',
      questions: {
        create: [
          {
            text: 'JavaScript is single-threaded by default.',
            type: 'boolean',
            answer: JSON.stringify(true),
            order: 0,
          },
          {
            text: 'Which keyword declares a block-scoped variable?',
            type: 'input',
            answer: JSON.stringify('let'),
            order: 1,
          },
          {
            text: 'Which are JavaScript primitive types?',
            type: 'checkbox',
            options: JSON.stringify(['string', 'number', 'array', 'boolean']),
            answer: JSON.stringify(['string', 'number', 'boolean']),
            order: 2,
          },
        ],
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
