import { AUTH_FIELD_LIMITS } from "@quiz-app/shared";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Enter a valid email address." })
  @MaxLength(AUTH_FIELD_LIMITS.emailMaxLength, {
    message: `Email must be ${AUTH_FIELD_LIMITS.emailMaxLength} characters or fewer.`
  })
  email!: string;

  @IsString({ message: "Password is required." })
  @IsNotEmpty({ message: "Password is required." })
  password!: string;
}
