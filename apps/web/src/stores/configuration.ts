import { defineStore } from "pinia";
import {
  DEFAULT_SUBJECT_DOMAINS,
  SUBJECT_DOMAIN_MAX_LENGTH
} from "@quiz-app/shared";
import type { AppError } from "../lib/api/errors";
import { isAppError, normalizeApiError } from "../lib/api/errors";
import {
  fetchConfiguration,
  updateSubjectDomains
} from "../services/configuration-api";

interface ConfigurationState {
  subjectDomains: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: AppError | null;
}

function normalizeSubjectDomain(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueSubjectDomains(values: string[]) {
  const seen = new Set<string>();
  const subjects: string[] = [];

  for (const value of values) {
    const normalized = normalizeSubjectDomain(value);
    const key = normalized.toLowerCase();

    if (normalized && !seen.has(key)) {
      seen.add(key);
      subjects.push(normalized);
    }
  }

  return subjects;
}

function toAppError(error: unknown): AppError {
  const appError = isAppError(error) ? error : normalizeApiError(error);
  return {
    ...appError,
    userMessage: appError.userMessage ?? "Could not save Subject / Domain settings."
  };
}

export const useConfigurationStore = defineStore("configuration", {
  state: (): ConfigurationState => ({
    subjectDomains: [...DEFAULT_SUBJECT_DOMAINS],
    isLoading: false,
    isSaving: false,
    error: null
  }),

  getters: {
    primarySubjectDomain: (state) => state.subjectDomains[0] ?? "",
    hasDefaultSubjectDomains: (state) =>
      state.subjectDomains.length === DEFAULT_SUBJECT_DOMAINS.length &&
      state.subjectDomains.every((subject, index) => subject === DEFAULT_SUBJECT_DOMAINS[index])
  },

  actions: {
    async loadConfiguration() {
      this.isLoading = true;
      this.error = null;

      try {
        const configuration = await fetchConfiguration();
        const subjectDomains = uniqueSubjectDomains(configuration.subjectDomains);
        this.subjectDomains = subjectDomains.length ? subjectDomains : [...DEFAULT_SUBJECT_DOMAINS];
      } catch (error) {
        this.error = toAppError(error);
      } finally {
        this.isLoading = false;
      }
    },

    async saveSubjectDomains(subjectDomains: string[]) {
      this.isSaving = true;
      this.error = null;

      try {
        const configuration = await updateSubjectDomains(subjectDomains);
        this.subjectDomains = uniqueSubjectDomains(configuration.subjectDomains);
        return null;
      } catch (error) {
        this.error = toAppError(error);
        return this.error.userMessage ?? "Could not save Subject / Domain settings.";
      } finally {
        this.isSaving = false;
      }
    },

    async addSubjectDomain(value: string) {
      const normalized = normalizeSubjectDomain(value);

      if (!normalized) {
        return "Enter a Subject / Domain name.";
      }

      if (normalized.length > SUBJECT_DOMAIN_MAX_LENGTH) {
        return `Use ${SUBJECT_DOMAIN_MAX_LENGTH} characters or fewer.`;
      }

      if (this.subjectDomains.some((subject) => subject.toLowerCase() === normalized.toLowerCase())) {
        return `${normalized} is already configured.`;
      }

      return this.saveSubjectDomains([...this.subjectDomains, normalized]);
    },

    async updateSubjectDomain(index: number, value: string) {
      const normalized = normalizeSubjectDomain(value);

      if (!normalized) {
        return "Enter a Subject / Domain name.";
      }

      if (normalized.length > SUBJECT_DOMAIN_MAX_LENGTH) {
        return `Use ${SUBJECT_DOMAIN_MAX_LENGTH} characters or fewer.`;
      }

      if (!this.subjectDomains[index]) {
        return "Subject / Domain was not found.";
      }

      const duplicated = this.subjectDomains.some(
        (subject, subjectIndex) =>
          subjectIndex !== index && subject.toLowerCase() === normalized.toLowerCase()
      );

      if (duplicated) {
        return `${normalized} is already configured.`;
      }

      const nextSubjectDomains = [...this.subjectDomains];
      nextSubjectDomains.splice(index, 1, normalized);
      return this.saveSubjectDomains(nextSubjectDomains);
    },

    async removeSubjectDomain(index: number) {
      if (this.subjectDomains.length <= 1) {
        return "Keep at least one Subject / Domain.";
      }

      if (!this.subjectDomains[index]) {
        return "Subject / Domain was not found.";
      }

      const nextSubjectDomains = [...this.subjectDomains];
      nextSubjectDomains.splice(index, 1);
      return this.saveSubjectDomains(nextSubjectDomains);
    },

    async resetSubjectDomains() {
      return this.saveSubjectDomains([...DEFAULT_SUBJECT_DOMAINS]);
    }
  }
});
