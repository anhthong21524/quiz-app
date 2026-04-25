import { IsString, MaxLength } from "class-validator";

export class UpdateAvatarDto {
  @IsString()
  @MaxLength(5 * 1024 * 1024) // ~5 MB base64 ceiling
  avatarUrl!: string;
}
