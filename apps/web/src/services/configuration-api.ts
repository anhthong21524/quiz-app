import type { SubjectDomainConfiguration, UpdateSubjectDomainsPayload } from "@quiz-app/shared";
import { httpClient } from "./http";

export async function fetchConfiguration() {
  const response = await httpClient.get<SubjectDomainConfiguration>("/configuration");
  return response.data;
}

export async function updateSubjectDomains(subjectDomains: string[]) {
  const payload: UpdateSubjectDomainsPayload = { subjectDomains };
  const response = await httpClient.put<SubjectDomainConfiguration>(
    "/configuration/subject-domains",
    payload
  );
  return response.data;
}
