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
    description: "A focused quiz experience that keeps learners moving without extra noise.",
    icon: "spark"
  },
  {
    title: "Practice with purpose",
    description: "Quizzes help turn quick answers into stronger recall and better habits.",
    icon: "target"
  },
  {
    title: "Progress you can see",
    description: "Creators and learners get clear feedback that makes the next step obvious.",
    icon: "progress"
  }
];
</script>

<template>
  <section class="min-h-full bg-white text-slate-950">
    <div class="mx-auto grid w-full max-w-[1180px] gap-14 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <section class="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)] lg:gap-14">
        <div class="mx-auto grid max-w-2xl justify-items-center gap-6 text-center lg:mx-0 lg:justify-items-start lg:text-left">
          <p class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="M12 3v18M5 7h14M7 12h10M9 17h6" stroke-linecap="round" />
            </svg>
            About Quiz App
          </p>

          <div class="grid gap-5">
            <h1 class="max-w-[680px] text-5xl font-extrabold leading-[1.06] tracking-normal text-slate-950 sm:text-6xl">
              Make learning feel
              <span class="block text-emerald-600">clear and doable.</span>
            </h1>
            <p class="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Quiz App helps people create, share and take quizzes that are easy to start, simple to follow and useful for everyday practice.
            </p>
          </div>

          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 font-bold text-white shadow-[0_12px_24px_rgba(5,150,105,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              :to="startQuizRoute"
            >
              Start a quiz
            </RouterLink>
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
              :to="{ name: 'quizzes' }"
            >
              Browse quizzes
            </RouterLink>
          </div>
        </div>

        <div class="relative mx-auto h-[340px] w-full max-w-[560px]" aria-hidden="true">
          <div class="absolute inset-8 rounded-full bg-emerald-50"></div>
          <div class="absolute left-8 top-10 h-3 w-3 rounded-full bg-emerald-200"></div>
          <div class="absolute right-16 top-14 h-5 w-5 text-amber-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14" stroke-linecap="round" />
            </svg>
          </div>

          <div class="absolute left-[9%] top-[12%] w-[58%] rounded-[26px] border border-emerald-100 bg-white p-6 shadow-[0_24px_45px_rgba(15,23,42,0.12)]">
            <div class="mb-6 flex items-center justify-between">
              <span class="h-3 w-28 rounded-full bg-slate-200"></span>
              <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                  <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <div class="grid gap-4">
              <div class="rounded-2xl bg-emerald-50 p-4">
                <span class="mb-3 block h-2.5 w-24 rounded-full bg-emerald-500"></span>
                <span class="block h-2.5 w-full rounded-full bg-emerald-100"></span>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <span class="mb-3 block h-2.5 w-20 rounded-full bg-slate-300"></span>
                <span class="block h-2.5 w-11/12 rounded-full bg-slate-200"></span>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <span class="mb-3 block h-2.5 w-28 rounded-full bg-slate-300"></span>
                <span class="block h-2.5 w-4/5 rounded-full bg-slate-200"></span>
              </div>
            </div>
          </div>

          <div class="absolute bottom-8 right-8 grid w-[42%] gap-3">
            <div class="rounded-2xl bg-white p-4 shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
              <div class="mb-4 flex items-end gap-2">
                <span class="h-9 w-4 rounded-full bg-emerald-300"></span>
                <span class="h-14 w-4 rounded-full bg-emerald-500"></span>
                <span class="h-20 w-4 rounded-full bg-emerald-600"></span>
              </div>
              <span class="block h-2.5 w-24 rounded-full bg-slate-200"></span>
            </div>
            <div class="rounded-2xl bg-amber-400 p-5 shadow-[0_18px_34px_rgba(245,158,11,0.18)]"></div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 sm:grid-cols-3" aria-label="Quiz App highlights">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <strong class="block text-3xl font-extrabold text-emerald-600">10k+</strong>
          <p class="mt-2 font-bold text-slate-950">learners practicing</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">A growing community using quizzes to build confidence.</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <strong class="block text-3xl font-extrabold text-emerald-600">4</strong>
          <p class="mt-2 font-bold text-slate-950">core quiz flows</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">Create, browse, edit and take quizzes from one workspace.</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <strong class="block text-3xl font-extrabold text-emerald-600">Every day</strong>
          <p class="mt-2 font-bold text-slate-950">steady improvement</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">Short practice sessions make learning easier to repeat.</p>
        </article>
      </section>

      <section class="grid gap-6" aria-labelledby="about-values-title">
        <div class="mx-auto grid max-w-2xl gap-3 text-center">
          <h2 id="about-values-title" class="text-3xl font-extrabold text-slate-950">What we care about</h2>
          <p class="text-slate-600">
            The product stays focused on the little things that make quizzes more useful: clarity, momentum and feedback.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="value in values"
            :key="value.title"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
          >
            <div class="mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
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
            <h3 class="text-lg font-extrabold text-slate-950">{{ value.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ value.description }}</p>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
