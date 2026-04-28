<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="min-h-full bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
    <div
      class="mx-auto flex min-h-[60vh] w-full max-w-[1180px] flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8"
    >
      <p class="text-5xl font-bold text-slate-200 dark:text-slate-700">404</p>
      <h1 class="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p class="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <RouterLink
        :to="{ name: 'home' }"
        class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Go home
      </RouterLink>
    </div>
  </section>
</template>
