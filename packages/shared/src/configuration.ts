export const SUBJECT_DOMAIN_MAX_LENGTH = 80;

export const DEFAULT_SUBJECT_DOMAINS = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "English",
  "Programming",
  "General Knowledge"
];

export interface SubjectDomainConfiguration {
  subjectDomains: string[];
}

export interface UpdateSubjectDomainsPayload {
  subjectDomains: string[];
}
