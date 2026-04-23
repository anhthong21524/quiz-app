import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsString,
  MaxLength,
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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}

