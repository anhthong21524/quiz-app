import { ArrayMinSize, IsArray, IsString, MaxLength } from "class-validator";
import { SUBJECT_DOMAIN_MAX_LENGTH, UpdateSubjectDomainsPayload } from "@quiz-app/shared";

export class UpdateSubjectDomainsDto implements UpdateSubjectDomainsPayload {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(SUBJECT_DOMAIN_MAX_LENGTH, { each: true })
  subjectDomains!: string[];
}
