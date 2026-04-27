import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min
} from "class-validator";

export class QuestionDto {
  @IsString()
  @MaxLength(500)
  prompt!: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options!: string[];

  @IsInt()
  @Min(0)
  correctOptionIndex!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  explanation?: string;
}
