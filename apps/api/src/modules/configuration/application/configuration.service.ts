import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {
  DEFAULT_SUBJECT_DOMAINS,
  SubjectDomainConfiguration,
  SUBJECT_DOMAIN_MAX_LENGTH
} from "@quiz-app/shared";
import {
  CONFIGURATION_REPOSITORY,
  ConfigurationRepository
} from "../domain/configuration.repository";

export interface ConfigurationUser {
  id: string;
}

@Injectable()
export class ConfigurationService {
  constructor(
    @Inject(CONFIGURATION_REPOSITORY)
    private readonly configurationRepository: ConfigurationRepository
  ) {}

  async getConfiguration(user: ConfigurationUser): Promise<SubjectDomainConfiguration> {
    const configuration = await this.configurationRepository.getSubjectDomains(user.id);
    return configuration ?? { subjectDomains: DEFAULT_SUBJECT_DOMAINS };
  }

  async updateSubjectDomains(
    user: ConfigurationUser,
    subjectDomains: string[]
  ): Promise<SubjectDomainConfiguration> {
    const normalized = this.normalizeSubjectDomains(subjectDomains);
    return this.configurationRepository.saveSubjectDomains(user.id, normalized);
  }

  private normalizeSubjectDomains(subjectDomains: string[]) {
    const seen = new Set<string>();
    const normalizedSubjects: string[] = [];

    for (const subjectDomain of subjectDomains) {
      const normalized = subjectDomain.trim().replace(/\s+/g, " ");
      const key = normalized.toLowerCase();

      if (!normalized) {
        throw new BadRequestException("Subject / Domain names cannot be blank.");
      }

      if (normalized.length > SUBJECT_DOMAIN_MAX_LENGTH) {
        throw new BadRequestException(
          `Subject / Domain names must be ${SUBJECT_DOMAIN_MAX_LENGTH} characters or fewer.`
        );
      }

      if (seen.has(key)) {
        throw new BadRequestException(`${normalized} is already configured.`);
      }

      seen.add(key);
      normalizedSubjects.push(normalized);
    }

    if (!normalizedSubjects.length) {
      throw new BadRequestException("Configure at least one Subject / Domain.");
    }

    return normalizedSubjects;
  }
}
