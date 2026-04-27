import { Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from "class-validator";
import { QuestionDto } from "./question.dto";

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}
