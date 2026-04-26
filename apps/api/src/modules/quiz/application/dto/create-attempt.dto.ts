import { IsString, MinLength } from "class-validator";

export class CreateAttemptDto {
  @IsString()
  @MinLength(1)
  takerName!: string;
}
