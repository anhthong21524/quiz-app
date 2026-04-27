import { SubjectDomainConfiguration } from "@quiz-app/shared";

export const CONFIGURATION_REPOSITORY = Symbol("CONFIGURATION_REPOSITORY");

export interface ConfigurationRepository {
  getSubjectDomains(ownerId: string): Promise<SubjectDomainConfiguration | null>;
  saveSubjectDomains(ownerId: string, subjectDomains: string[]): Promise<SubjectDomainConfiguration>;
}
