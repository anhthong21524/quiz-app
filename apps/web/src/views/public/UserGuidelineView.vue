<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "../../i18n";
import {
  userGuidelineContent,
  type GuideTabId
} from "./userGuidelineContent";

const { locale } = useI18n();
const activeTab = ref<GuideTabId>("getting-started");
const content = computed(() => userGuidelineContent[locale.value]);
</script>

<template>
  <section class="min-h-full bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
    <div class="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div class="mb-10 grid gap-3">
        <p class="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ content.badge }}
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {{ content.title }}
          <span class="text-emerald-600 dark:text-emerald-400">{{ content.titleAccent }}</span>
        </h1>
        <p class="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {{ content.intro }}
        </p>
      </div>

      <div class="mb-8 flex gap-1.5 rounded-2xl bg-emerald-600 p-1.5 dark:bg-emerald-700">
        <button
          v-for="tab in content.tabs"
          :key="tab.id"
          type="button"
          class="flex-1 rounded-xl px-5 py-3 text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          :class="activeTab === tab.id
            ? 'bg-white text-emerald-700 shadow-md'
            : 'text-emerald-50 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-show="activeTab === 'getting-started'" class="grid gap-6">
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            :src="content.gettingStarted.hero.src"
            :alt="content.gettingStarted.hero.alt"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {{ content.gettingStarted.hero.caption }}
          </div>
        </div>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.gettingStarted.quickStart.title }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ content.gettingStarted.quickStart.intro }}</p>
            </div>
          </div>

          <ol class="grid gap-4">
            <li
              v-for="(step, index) in content.gettingStarted.quickStart.steps"
              :key="step.title"
              class="flex items-start gap-3 text-slate-700 dark:text-slate-300"
            >
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">{{ index + 1 }}</span>
              <div>
                <p class="font-semibold">{{ step.title }}</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </section>

        <div class="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
            <img
              :src="content.gettingStarted.login.screenshot.src"
              :alt="content.gettingStarted.login.screenshot.alt"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {{ content.gettingStarted.login.screenshot.caption }}
            </div>
          </div>

          <div class="grid gap-4 content-start">
            <article
              v-for="card in [content.gettingStarted.login.email, content.gettingStarted.login.google]"
              :key="card.title"
              class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">{{ card.title }}</h3>
              <ol class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li v-for="(step, index) in card.steps" :key="step" class="flex gap-2">
                  <span class="font-bold text-emerald-600">{{ index + 1 }}.</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
              <p v-if="card.note" class="mt-3 text-xs text-slate-400 dark:text-slate-500">{{ card.note }}</p>
            </article>
          </div>
        </div>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6">
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.gettingStarted.createAccount.title }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.gettingStarted.createAccount.intro }}</p>
          </div>
          <ol class="grid gap-4">
            <li
              v-for="(step, index) in content.gettingStarted.createAccount.steps"
              :key="step.title"
              class="flex items-start gap-3 text-slate-700 dark:text-slate-300"
            >
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">{{ index + 1 }}</span>
              <div>
                <p class="font-semibold">{{ step.title }}</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.gettingStarted.navigation.title }}</h2>
          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">{{ content.gettingStarted.navigation.publicTitle }}</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li v-for="item in content.gettingStarted.navigation.publicPages" :key="item" class="flex items-start gap-2">
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
            <div class="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">{{ content.gettingStarted.navigation.managementTitle }}</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li v-for="item in content.gettingStarted.navigation.managementPages" :key="item" class="flex items-start gap-2">
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div v-show="activeTab === 'quiz-creator'" class="grid gap-6">
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            :src="content.creator.dashboardShot.src"
            :alt="content.creator.dashboardShot.alt"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {{ content.creator.dashboardShot.caption }}
          </div>
        </div>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.creator.dashboard.title }}</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.creator.dashboard.intro }}</p>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <article
              v-for="card in content.creator.dashboard.cards"
              :key="card.title"
              class="rounded-2xl bg-slate-50 p-5 dark:bg-slate-700/50"
            >
              <h3 class="font-bold text-slate-900 dark:text-slate-100">{{ card.title }}</h3>
              <ul class="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                <li v-for="item in card.items" :key="item" class="flex items-start gap-2">
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <div class="grid gap-6 lg:grid-cols-2">
          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
            <img
              :src="content.creator.createShot.src"
              :alt="content.creator.createShot.alt"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {{ content.creator.createShot.caption }}
            </div>
          </div>

          <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.creator.createFlow.title }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.creator.createFlow.intro }}</p>
            <div class="mt-6 grid gap-4">
              <article
                v-for="card in content.creator.createFlow.cards"
                :key="card.title"
                class="rounded-2xl bg-slate-50 p-5 dark:bg-slate-700/50"
              >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">{{ card.title }}</h3>
                <ul class="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <li v-for="item in card.items" :key="item" class="flex items-start gap-2">
                    <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </article>
            </div>
          </section>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
            <img
              :src="content.creator.resultsShot.src"
              :alt="content.creator.resultsShot.alt"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {{ content.creator.resultsShot.caption }}
            </div>
          </div>

          <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.creator.results.title }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.creator.results.intro }}</p>
            <div class="mt-6 grid gap-4">
              <article
                v-for="card in content.creator.results.cards"
                :key="card.title"
                class="rounded-2xl bg-slate-50 p-5 dark:bg-slate-700/50"
              >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">{{ card.title }}</h3>
                <ul class="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <li v-for="item in card.items" :key="item" class="flex items-start gap-2">
                    <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </div>

      <div v-show="activeTab === 'participant'" class="grid gap-6">
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            :src="content.participant.publicShot.src"
            :alt="content.participant.publicShot.alt"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {{ content.participant.publicShot.caption }}
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.participant.publicQuiz.title }}</h2>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.participant.publicQuiz.intro }}</p>
            <ol class="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li v-for="(step, index) in content.participant.publicQuiz.steps" :key="step" class="flex gap-2">
                <span class="shrink-0 font-bold text-emerald-600">{{ index + 1 }}.</span>
                <span>{{ step }}</span>
              </li>
            </ol>
            <div
              v-if="content.participant.publicQuiz.noteTitle && content.participant.publicQuiz.noteBody"
              class="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <strong>{{ content.participant.publicQuiz.noteTitle }}:</strong>
              {{ content.participant.publicQuiz.noteBody }}
            </div>
          </section>

          <div class="grid gap-4">
            <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
              <img
                :src="content.participant.landingShot.src"
                :alt="content.participant.landingShot.alt"
                class="w-full object-cover"
              />
              <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {{ content.participant.landingShot.caption }}
              </div>
            </div>
            <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
              <img
                :src="content.participant.takeShot.src"
                :alt="content.participant.takeShot.alt"
                class="w-full object-cover"
              />
              <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {{ content.participant.takeShot.caption }}
              </div>
            </div>
          </div>
        </div>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.participant.duringQuiz.title }}</h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <article
              v-for="card in content.participant.duringQuiz.cards"
              :key="card.title"
              class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50"
            >
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">{{ card.title }}</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li v-for="item in card.items" :key="item" class="flex items-start gap-2">
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <div class="grid gap-4 sm:grid-cols-2">
          <section class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">{{ content.participant.privateQuiz.title }}</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.participant.privateQuiz.intro }}</p>
            <ol class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li v-for="(step, index) in content.participant.privateQuiz.steps" :key="step" class="flex gap-2">
                <span class="font-bold text-emerald-600">{{ index + 1 }}.</span>
                <span>{{ step }}</span>
              </li>
            </ol>
            <p
              v-if="content.participant.privateQuiz.noteTitle && content.participant.privateQuiz.noteBody"
              class="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-700/50 dark:text-slate-400"
            >
              <strong>{{ content.participant.privateQuiz.noteTitle }}:</strong>
              {{ content.participant.privateQuiz.noteBody }}
            </p>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">{{ content.participant.afterSubmission.title }}</h3>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ content.participant.afterSubmission.intro }}</p>
            <ul class="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
              <li v-for="item in content.participant.afterSubmission.items" :key="item.title" class="flex items-start gap-2">
                <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m5 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <span> - {{ item.description }}</span>
                </div>
              </li>
            </ul>
            <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">{{ content.participant.afterSubmission.note }}</p>
          </section>
        </div>

        <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">{{ content.participant.troubleshooting.title }}</h2>
          <div class="mt-6 grid gap-3">
            <article
              v-for="item in content.participant.troubleshooting.items"
              :key="item.title"
              class="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
            >
              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <div class="text-sm">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ item.title }}</p>
                <p class="text-slate-500 dark:text-slate-400">{{ item.description }}</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
