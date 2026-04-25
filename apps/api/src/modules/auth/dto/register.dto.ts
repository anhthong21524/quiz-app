import { RegisterPayload } from "@quiz-app/shared";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto implements RegisterPayload {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
