import { Type } from "class-transformer";
import {
  IsIn,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}
