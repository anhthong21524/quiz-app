import { IsInt, IsObject, Min } from "class-validator";

export class SubmitAttemptDto {
  @IsObject()
  answers!: Record<string, number>;

  @IsInt()
  @Min(0)
  timeTaken!: number;
}
