import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateNested
} from "class-validator";
import { QuestionDto } from "./question.dto";

export class CreateQuizDto {
  @IsString()
  @MaxLength(120)
  title!: string;

  @IsString()
  @MaxLength(500)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  subject?: string;

  @IsOptional()
  @IsIn(["Easy", "Medium", "Hard"])
  difficulty?: "Easy" | "Medium" | "Hard";

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(180)
  timeLimit?: number | null;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsBoolean()
  isExposed?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  accessCode?: string;

  @IsOptional()
  @IsBoolean()
  allowSummary?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReviewAnswers?: boolean;

  @IsOptional()
  @IsBoolean()
  allowRetake?: boolean;

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}
