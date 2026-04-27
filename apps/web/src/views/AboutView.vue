<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

type ValueCard = {
  title: string;
  description: string;
  icon: "spark" | "target" | "progress";
};

const authStore = useAuthStore();

const startQuizRoute = computed(() =>
  authStore.isAuthenticated ? { name: "create-quiz" } : { name: "login" }
);

const values: ValueCard[] = [
  {
    title: "Simple by design",
    description: "Question flows stay direct, readable and easy to finish without extra setup.",
    icon: "spark"
  },
  {
    title: "Practice with purpose",
    description: "Short quiz sessions help teachers, teams and self-learners build useful recall.",
    icon: "target"
  },
  {
    title: "Progress you can see",
    description: "Results and answer feedback make the next review step easier to spot.",
    icon: "progress"
  }
];
</script>

<template>
  <section class="min-h-full bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
    <div class="mx-auto grid w-full max-w-[1180px] gap-14 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">

      <!-- Hero -->
      <section class="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:gap-14">
        <div class="mx-auto grid max-w-2xl justify-items-center gap-6 text-center lg:mx-0 lg:justify-items-start lg:text-left">
          <p class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M7 5.5h10M7 11.5h7M7 17.5h5" stroke-linecap="round" />
              <path d="M4.5 4h15v16h-15z" stroke-linejoin="round" />
            </svg>
            About Quiz App
          </p>

          <div class="grid gap-5">
            <h1 class="max-w-[680px] text-5xl font-extrabold leading-[1.06] tracking-normal text-slate-950 sm:text-6xl dark:text-white">
              Make learning feel
              <span class="block text-emerald-600 dark:text-emerald-400">clear and doable.</span>
            </h1>
            <p class="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              Quiz App helps teachers, teams and self-learners create, share and take quizzes that are easy to start, simple to follow and useful for everyday practice.
            </p>
          </div>

          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 font-bold text-white shadow-[0_12px_24px_rgba(5,150,105,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              :to="startQuizRoute"
            >
              Create a quiz
            </RouterLink>
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              :to="{ name: 'public-quizzes' }"
            >
              Browse quizzes
            </RouterLink>
          </div>
        </div>

        <!-- Illustration -->
        <div class="relative mx-auto h-[340px] w-full max-w-[560px]" aria-hidden="true">
          <div class="absolute inset-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40"></div>
          <div class="absolute left-8 top-10 h-3 w-3 rounded-full bg-emerald-200 dark:bg-emerald-700"></div>
          <div class="absolute right-16 top-14 h-5 w-5 text-amber-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14" stroke-linecap="round" />
            </svg>
          </div>

          <div class="animate-float absolute left-[9%] top-[12%] w-[60%] rounded-[26px] border border-emerald-100 bg-white p-6 shadow-[0_24px_45px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_24px_45px_rgba(0,0,0,0.3)]">
            <div class="mb-6 flex items-center justify-between">
              <span class="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-600"></span>
              <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div class="grid gap-4">
              <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                <span class="mb-3 block h-2.5 w-32 rounded-full bg-slate-300 dark:bg-slate-500"></span>
                <span class="block h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-600"></span>
              </div>
              <div class="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/50">
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-extrabold text-white">A</span>
                <span class="grid flex-1 gap-2">
                  <span class="block h-2.5 w-24 rounded-full bg-emerald-500"></span>
                  <span class="block h-2.5 w-full rounded-full bg-emerald-100 dark:bg-emerald-900"></span>
                </span>
                <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-emerald-600 dark:bg-slate-700">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>
              <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/50">
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-extrabold text-slate-400 dark:bg-slate-600 dark:text-slate-400">B</span>
                <span class="grid flex-1 gap-2">
                  <span class="block h-2.5 w-20 rounded-full bg-slate-300 dark:bg-slate-500"></span>
                  <span class="block h-2.5 w-11/12 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                </span>
              </div>
            </div>
          </div>

          <div class="animate-float-delayed absolute bottom-8 right-8 grid w-[43%] gap-3">
            <div class="rounded-2xl bg-white p-4 shadow-[0_18px_36px_rgba(15,23,42,0.12)] dark:bg-slate-800 dark:shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
              <div class="mb-4 flex items-center justify-between gap-3">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-2xl font-extrabold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">3</span>
                <span class="grid flex-1 gap-2">
                  <span class="block h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-600"></span>
                  <span class="block h-2.5 w-4/5 rounded-full bg-slate-100 dark:bg-slate-700"></span>
                </span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <span class="block h-full w-3/4 rounded-full bg-emerald-500"></span>
              </div>
            </div>
            <div class="rounded-2xl bg-amber-400 px-5 py-4 shadow-[0_18px_34px_rgba(245,158,11,0.18)]">
              <div class="mb-2.5 flex items-center gap-2">
                <span class="grid h-6 w-6 place-items-center rounded-full bg-white/30">
                  <svg class="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span class="block h-2.5 w-16 rounded-full bg-white/70"></span>
              </div>
              <span class="block h-2 w-24 rounded-full bg-white/50"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature highlights -->
      <section class="grid gap-4 sm:grid-cols-3" aria-label="Quiz App highlights">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <strong class="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Create</strong>
          <p class="mt-2 font-bold text-slate-950 dark:text-white">quiz authoring that stays focused</p>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Build questions, answers and quiz details without leaving the flow.</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <strong class="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Share</strong>
          <p class="mt-2 font-bold text-slate-950 dark:text-white">public quizzes that are easy to start</p>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Learners can browse published quizzes and start practicing quickly.</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 18V6M5 18h14" stroke-linecap="round" />
              <path d="m8 15 3-4 3 2 4-7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <strong class="block text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Review</strong>
          <p class="mt-2 font-bold text-slate-950 dark:text-white">feedback that points to the next step</p>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Clear results help creators and learners understand what improved.</p>
        </article>
      </section>

      <!-- What we care about -->
      <section class="grid gap-8 pt-2" aria-labelledby="about-values-title">
        <div class="mx-auto grid max-w-2xl gap-3 text-center">
          <h2 id="about-values-title" class="text-3xl font-extrabold text-slate-950 dark:text-white">What we care about</h2>
          <p class="text-slate-600 dark:text-slate-400">
            Focused on the small details that make quizzes worth using: clear questions, steady momentum, and feedback you can act on.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="value in values"
            :key="value.title"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800"
          >
            <div class="mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg v-if="value.icon === 'spark'" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" stroke-linejoin="round" />
                <path d="M19 16v4M17 18h4" stroke-linecap="round" />
              </svg>
              <svg v-else-if="value.icon === 'target'" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke-linecap="round" />
              </svg>
              <svg v-else class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 18V6M5 18h14" stroke-linecap="round" />
                <path d="m8 15 3-4 3 2 4-7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">{{ value.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ value.description }}</p>
          </article>
        </div>
      </section>

      <!-- Brand story -->
      <section class="mx-auto grid max-w-2xl gap-3 text-center">
        <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Built for everyday use</h2>
        <p class="text-slate-600 dark:text-slate-400">
          We built Quiz App because most tools were either too complex to set up or too limited to grow with.
          We wanted something a teacher could configure in minutes and a learner could start without an account.
        </p>
      </section>

      <!-- Closing CTA -->
      <section class="rounded-2xl bg-emerald-600 px-8 py-12 text-center dark:bg-emerald-700">
        <h2 class="text-2xl font-extrabold text-white sm:text-3xl">Ready to get started?</h2>
        <p class="mx-auto mt-3 max-w-md text-emerald-100">
          Create your first quiz in minutes — no credit card, no setup required.
        </p>
        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <RouterLink
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            :to="startQuizRoute"
          >
            Create a quiz
          </RouterLink>
          <RouterLink
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-7 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            :to="{ name: 'public-quizzes' }"
          >
            Browse quizzes
          </RouterLink>
        </div>
      </section>

    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite 1.2s;
}
</style>
