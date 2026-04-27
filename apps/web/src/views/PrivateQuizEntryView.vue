<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { validatePrivateQuizCode } from "../services/publicQuizApi";

const router = useRouter();

const codeInput = ref("");
const codeError = ref("");
const isValidating = ref(false);

async function submitCode() {
  const code = codeInput.value.trim().toUpperCase();
  if (!code) {
    codeError.value = "Please enter an access code.";
    return;
  }
  if (code.length !== 6) {
    codeError.value = "Access code must be exactly 6 characters.";
    return;
  }

  codeError.value = "";
  isValidating.value = true;
  try {
    const quiz = await validatePrivateQuizCode(code);
    router.push({ name: "public-quiz", params: { slug: quiz.slug }, query: { accessCode: code } });
  } catch {
    codeError.value = "Invalid or expired code. Please check and try again.";
  } finally {
    isValidating.value = false;
  }
}
</script>

<template>
  <section class="min-h-full bg-white dark:bg-slate-950 text-slate-950 dark:text-white">
    <div class="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

      <!-- Header -->
      <div class="grid gap-4">
        <p class="text-sm font-extrabold uppercase tracking-[0.08em] text-amber-600 dark:text-amber-400">
          Private quiz
        </p>
        <div class="grid gap-3">
          <h1 class="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
            Enter your access code
          </h1>
          <p class="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
            This quiz is private. Enter the 6-character code shared by the quiz creator to unlock it.
          </p>
        </div>
      </div>

      <!-- Code entry card -->
      <div class="mx-auto w-full max-w-md">
        <form
          class="grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6"
          novalidate
          @submit.prevent="submitCode"
        >
          <label class="grid gap-2" for="access-code">
            <span class="text-sm font-extrabold text-slate-700 dark:text-slate-300">Access code</span>
            <input
              id="access-code"
              v-model="codeInput"
              type="text"
              autocomplete="off"
              spellcheck="false"
              maxlength="6"
              placeholder="e.g. A1B2C3"
              class="h-14 w-full rounded-xl border px-4 text-center text-2xl font-bold uppercase tracking-[0.25em] outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:normal-case placeholder:tracking-normal placeholder:text-base"
              :class="
                codeError
                  ? 'border-red-400 bg-white dark:bg-slate-800 text-red-800 dark:text-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-100 dark:focus:ring-amber-900'
              "
              @input="codeError = ''"
            />
            <p v-if="codeError" class="text-sm font-medium text-red-600 dark:text-red-400" aria-live="polite">
              {{ codeError }}
            </p>
          </label>

          <button
            type="submit"
            class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 font-bold text-white shadow transition hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 dark:focus-visible:ring-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isValidating"
          >
            <svg v-if="isValidating" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
            </svg>
            <span>{{ isValidating ? "Validating..." : "Unlock quiz" }}</span>
            <svg v-if="!isValidating" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  </section>
</template>
