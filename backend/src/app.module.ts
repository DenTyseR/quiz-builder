import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { QuizzesController } from './quizzes/quizzes.controller';
import { QuizzesService } from './quizzes/quizzes.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesService],
})
export class AppModule {}
