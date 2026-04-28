<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "../../i18n";

type FeatureCard = {
  title: string;
  description: string;
  icon: "book" | "clock" | "chart" | "trophy";
};

const { t, tm } = useI18n();
const featureCards = computed(() => tm<FeatureCard[]>("home.featureCards"));
</script>

<template>
  <section class="min-h-full bg-white text-slate-950">
    <div class="mx-auto grid w-full max-w-[1180px] gap-14 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <section
        class="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)] lg:gap-12"
        aria-labelledby="home-hero-title"
      >
        <div class="mx-auto grid max-w-2xl justify-items-center gap-6 text-center lg:mx-0 lg:justify-items-start lg:text-left">
          <p class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
              <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 3Z" stroke-linejoin="round" />
            </svg>
            {{ t("home.badge") }}
          </p>

          <div class="grid gap-5">
            <h1
              id="home-hero-title"
              class="max-w-[720px] text-5xl font-extrabold leading-[1.04] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl"
            >
              {{ t("home.titleLine1") }}
              <span class="block text-emerald-600">{{ t("home.titleLine2") }}</span>
            </h1>
            <p class="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              {{ t("home.subtitle") }}
            </p>
          </div>

          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 font-bold text-white shadow-[0_12px_24px_rgba(5,150,105,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
              :to="{ name: 'public-quizzes' }"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.6v12.8a1 1 0 0 0 1.55.84l9.85-6.4a1 1 0 0 0 0-1.68L9.55 4.76A1 1 0 0 0 8 5.6Z" />
              </svg>
              {{ t("home.primaryCta") }}
            </RouterLink>
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100"
              :to="{ name: 'public-quizzes' }"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" stroke-linejoin="round" />
              </svg>
              {{ t("home.secondaryCta") }}
            </RouterLink>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-600 lg:justify-start">
            <div class="flex -space-x-2" aria-hidden="true">
              <span class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-emerald-100 text-sm font-extrabold text-emerald-700">A</span>
              <span class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-amber-100 text-sm font-extrabold text-amber-700">B</span>
              <span class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-sky-100 text-sm font-extrabold text-sky-700">C</span>
              <span class="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-rose-100 text-sm font-extrabold text-rose-700">D</span>
            </div>
            <p>{{ t("home.community") }}</p>
          </div>
        </div>

        <div class="relative mx-auto h-[330px] w-full max-w-[560px] sm:h-[420px]" aria-hidden="true">
          <div class="absolute inset-6 rounded-full bg-emerald-50"></div>
          <div class="absolute left-4 top-20 h-3 w-3 rounded-full bg-emerald-200"></div>
          <div class="absolute right-10 top-28 h-5 w-5 text-amber-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M12 5v14M5 12h14" stroke-linecap="round" />
            </svg>
          </div>

          <div class="absolute left-[8%] top-[14%] h-[74%] w-[52%] rounded-[28px] border-[12px] border-emerald-900/45 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
            <div class="absolute -top-10 left-1/2 h-12 w-28 -translate-x-1/2 rounded-lg bg-slate-700 shadow-lg">
              <span class="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-white"></span>
            </div>
            <div class="grid gap-5 p-6 pt-12">
              <div class="grid gap-1.5">
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ t("home.questionProgress") }}</span>
                <span class="text-xs font-semibold leading-snug text-slate-700">{{ t("home.questionPrompt") }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span class="h-2 w-20 rounded-full bg-emerald-500"></span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-8 w-8 shrink-0 rounded-full border-[3px] border-slate-200"></span>
                <span class="h-2 w-28 rounded-full bg-slate-200"></span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-8 w-8 shrink-0 rounded-full border-[3px] border-slate-200"></span>
                <span class="h-2 w-24 rounded-full bg-slate-100"></span>
              </div>
            </div>
          </div>

          <div class="absolute right-[14%] top-[12%] flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <span class="text-2xl font-extrabold text-emerald-600">92%</span>
            <div class="grid gap-0.5">
              <span class="text-[10px] font-bold text-slate-800">{{ t("home.scoreTitle") }}</span>
              <span class="text-[10px] text-slate-400">{{ t("home.scoreRank") }}</span>
            </div>
          </div>

          <div class="absolute bottom-10 right-10 grid w-[38%] gap-2 sm:right-4">
            <div class="h-14 rounded-[18px] bg-emerald-500 shadow-[0_14px_28px_rgba(16,185,129,0.25)]"></div>
            <div class="h-12 rounded-[18px] bg-amber-400 shadow-[0_14px_28px_rgba(245,158,11,0.18)]"></div>
            <div class="h-12 rounded-[18px] bg-blue-500 shadow-[0_14px_28px_rgba(59,130,246,0.18)]"></div>
          </div>

          <div class="absolute bottom-8 right-4 h-36 w-5 rotate-12 rounded-full bg-emerald-500 shadow-lg sm:right-0">
            <span class="absolute -top-4 left-0 h-5 w-5 rounded-full bg-rose-300"></span>
            <span class="absolute -bottom-7 left-0 h-8 w-5 bg-slate-800 [clip-path:polygon(50%_100%,0_0,100%_0)]"></span>
          </div>
        </div>
      </section>

      <section id="features" class="grid gap-5" aria-labelledby="features-title">
        <h2 id="features-title" class="sr-only">{{ t("home.featuresTitle") }}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="feature in featureCards"
            :key="feature.title"
            class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-emerald-100 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
          >
            <div class="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <svg v-if="feature.icon === 'book'" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5 4A3.5 3.5 0 0 1 9 7.5V20a3.5 3.5 0 0 0-3.5-3.5H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1.5ZM18.5 4H20a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1h-1.5A3.5 3.5 0 0 0 15 20V7.5A3.5 3.5 0 0 1 18.5 4Z" />
              </svg>
              <svg v-else-if="feature.icon === 'clock'" class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="feature.icon === 'chart'" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 12.5A1.5 1.5 0 0 1 6.5 11h1A1.5 1.5 0 0 1 9 12.5v5A1.5 1.5 0 0 1 7.5 19h-1A1.5 1.5 0 0 1 5 17.5v-5ZM10.5 6.5A1.5 1.5 0 0 1 12 5h1a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 13 19h-1a1.5 1.5 0 0 1-1.5-1.5v-11ZM16 9.5A1.5 1.5 0 0 1 17.5 8h1A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-8Z" />
              </svg>
              <svg v-else class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4h10v2h3a1 1 0 0 1 1 1v1a5 5 0 0 1-5 5h-.4A5.02 5.02 0 0 1 13 15.58V18h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2.42A5.02 5.02 0 0 1 8.4 13H8a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1h3V4Zm0 4H5a3 3 0 0 0 2 2.83V8Zm12 0h-2v2.83A3 3 0 0 0 19 8Z" />
              </svg>
            </div>
            <div class="grid gap-1.5">
              <h3 class="text-base font-extrabold text-slate-950">{{ feature.title }}</h3>
              <p class="text-sm leading-6 text-slate-600">{{ feature.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-3xl bg-emerald-600 px-8 py-12 text-center" aria-labelledby="cta-title">
        <div class="mx-auto grid max-w-lg gap-6">
          <div class="grid gap-3">
            <h2 id="cta-title" class="text-3xl font-extrabold text-white sm:text-4xl">
              {{ t("home.ctaTitle") }}
            </h2>
            <p class="text-base leading-7 text-emerald-100">
              {{ t("home.ctaDescription") }}
            </p>
          </div>
          <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 font-bold text-emerald-700 shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
              :to="{ name: 'public-quizzes' }"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.6v12.8a1 1 0 0 0 1.55.84l9.85-6.4a1 1 0 0 0 0-1.68L9.55 4.76A1 1 0 0 0 8 5.6Z" />
              </svg>
              {{ t("home.ctaBrowse") }}
            </RouterLink>
            <RouterLink
              class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-400 px-7 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
              :to="{ name: 'login' }"
            >
              {{ t("home.ctaRegister") }}
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
