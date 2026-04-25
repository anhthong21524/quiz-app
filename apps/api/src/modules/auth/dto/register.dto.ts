import { AUTH_FIELD_LIMITS, AUTH_PASSWORD_POLICY, RegisterPayload } from "@quiz-app/shared";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateBy
} from "class-validator";

const WEAK_PASSWORDS = new Set<string>(AUTH_PASSWORD_POLICY.weakPasswords);

function IsNotWeakPassword() {
  return ValidateBy({
    name: "isNotWeakPassword",
    validator: {
      validate: (value: unknown) =>
        typeof value === "string" && !WEAK_PASSWORDS.has(value.trim().toLowerCase()),
      defaultMessage: () => "Choose a less common password."
    }
  });
}

export class RegisterDto implements RegisterPayload {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty({ message: "Email is required." })
  @IsEmail({}, { message: "Enter a valid email address." })
  @MaxLength(AUTH_FIELD_LIMITS.emailMaxLength, {
    message: `Email must be ${AUTH_FIELD_LIMITS.emailMaxLength} characters or fewer.`
  })
  email!: string;

  @IsString({ message: "Password is required." })
  @IsNotEmpty({ message: "Password is required." })
  @MinLength(AUTH_PASSWORD_POLICY.minLength, {
    message: `Use at least ${AUTH_PASSWORD_POLICY.minLength} characters.`
  })
  @MaxLength(AUTH_PASSWORD_POLICY.maxLength, {
    message: `Use ${AUTH_PASSWORD_POLICY.maxLength} characters or fewer.`
  })
  @IsNotWeakPassword()
  password!: string;
}
