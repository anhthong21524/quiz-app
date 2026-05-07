<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "../../i18n";
import { validatePrivateQuizCode } from "../../services/publicQuizApi";

const { t } = useI18n();
const router = useRouter();

const codeInput = ref("");
const codeError = ref("");
const isValidating = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => inputRef.value?.focus());

watch(codeInput, (val) => {
  if (val.trim().length === 6 && !isValidating.value) {
    void submitCode();
  }
});

async function submitCode() {
  const code = codeInput.value.trim().toUpperCase();
  codeError.value = "";
  isValidating.value = true;
  try {
    const quiz = await validatePrivateQuizCode(code);
    router.push({ name: "public-quiz", params: { slug: quiz.slug }, query: { accessCode: code } });
  } catch {
    codeError.value = t("participant.privateEntry.invalidCode");
  } finally {
    isValidating.value = false;
  }
}
</script>

<template>
  <section class="min-h-[calc(100vh-128px)] bg-white dark:bg-slate-950 text-slate-950 dark:text-white grid place-items-center px-4 py-12 sm:px-6">
    <div class="w-full max-w-md grid gap-6">

      <!-- Header -->
      <div class="grid gap-3 text-center">
        <div
          class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke-linecap="round" />
          </svg>
        </div>
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-amber-600 dark:text-amber-400">
          {{ t('participant.privateEntry.eyebrow') }}
        </p>
        <h1 class="text-3xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
          {{ t('participant.privateEntry.title') }}
        </h1>
        <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">
          {{ t('participant.privateEntry.description') }}
        </p>
      </div>

      <!-- Code entry card -->
      <div class="grid gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl shadow-slate-900/10">
        <label class="grid gap-2" for="access-code">
          <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">{{ t('participant.privateEntry.label') }}</span>
          <input
            id="access-code"
            ref="inputRef"
            v-model="codeInput"
            type="text"
            autocomplete="off"
            spellcheck="false"
            maxlength="6"
            placeholder="e.g. A1B2C3"
            :disabled="isValidating"
            class="h-14 w-full rounded-xl border px-4 text-center text-2xl font-bold uppercase tracking-[0.25em] outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal placeholder:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            :class="
              codeError
                ? 'border-red-400 bg-white dark:bg-slate-800 text-red-800 dark:text-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900'
            "
            @input="codeError = ''"
          />
          <!-- Reserved space: shows error or spinner when validating, counter while typing -->
          <div class="min-h-5 flex items-center justify-between">
            <p v-if="codeError" class="text-sm font-medium text-red-600 dark:text-red-400" aria-live="polite">
              {{ codeError }}
            </p>
            <span v-else-if="isValidating" class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
              </svg>
              {{ t('participant.privateEntry.validating') }}
            </span>
            <span v-else class="sr-only" aria-live="polite"></span>
            <p v-if="!codeError && codeInput.length > 0" class="text-right text-xs tabular-nums text-slate-400 dark:text-slate-500 ml-auto">
              {{ codeInput.trim().length }} / 6
            </p>
          </div>
        </label>
      </div>

      <!-- Escape hatch -->
      <p class="text-center text-sm text-slate-500 dark:text-slate-400">
        {{ t('participant.privateEntry.noCode') }}
        <RouterLink
          to="/quizzes"
          class="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
        >
          {{ t('participant.privateEntry.browsePublic') }}
        </RouterLink>
      </p>

    </div>
  </section>
</template>
