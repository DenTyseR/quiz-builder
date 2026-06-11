import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export const QUESTION_TYPES = ['boolean', 'input', 'checkbox'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsIn(QUESTION_TYPES)
  type: QuestionType;

  @ValidateIf((question: CreateQuestionDto) => question.type === 'boolean')
  @IsBoolean()
  booleanAnswer?: boolean;

  @ValidateIf((question: CreateQuestionDto) => question.type === 'input')
  @IsString()
  @IsNotEmpty()
  inputAnswer?: string;

  @ValidateIf((question: CreateQuestionDto) => question.type === 'checkbox')
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options?: string[];

  @ValidateIf((question: CreateQuestionDto) => question.type === 'checkbox')
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  correctOptions?: string[];
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @IsOptional()
  @IsString()
  description?: string;
}
