import { Injectable } from "@nestjs/common";
import { SubjectDomainConfiguration } from "@quiz-app/shared";
import { ConfigurationRepository } from "../../domain/configuration.repository";

@Injectable()
export class InMemoryConfigurationRepository implements ConfigurationRepository {
  private readonly configurations = new Map<string, SubjectDomainConfiguration>();

  async getSubjectDomains(ownerId: string): Promise<SubjectDomainConfiguration | null> {
    return this.configurations.get(ownerId) ?? null;
  }

  async saveSubjectDomains(
    ownerId: string,
    subjectDomains: string[]
  ): Promise<SubjectDomainConfiguration> {
    const configuration = { subjectDomains };
    this.configurations.set(ownerId, configuration);
    return configuration;
  }
}
