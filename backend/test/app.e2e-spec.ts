import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { QuizzesController } from '../src/quizzes/quizzes.controller';
import { QuizzesService } from '../src/quizzes/quizzes.service';

describe('QuizzesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
      providers: [
        {
          provide: QuizzesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                title: 'Sample quiz',
                questionCount: 2,
              },
            ]),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/quizzes (GET)', () => {
    return request(app.getHttpServer())
      .get('/quizzes')
      .expect(200)
      .expect([{ id: 1, title: 'Sample quiz', questionCount: 2 }]);
  });
});
