<template>
  <section class="grid two">
    <article class="card stack">
      <p class="eyebrow">Overview</p>
      <h2 class="section-title">Ship quizzes from a clean monorepo foundation.</h2>
      <p class="hint">
        This starter pairs a Vue 3 authoring UI with a NestJS API, shared TypeScript
        contracts, and Playwright coverage.
      </p>
      <div class="actions">
        <RouterLink class="primary" to="/editor">Create a quiz</RouterLink>
        <RouterLink class="secondary" to="/quizzes">Review quiz list</RouterLink>
      </div>
    </article>

    <article class="card stack">
      <p class="eyebrow">Architecture</p>
      <ul>
        <li>Vue 3 + Vite + Pinia frontend with typed API services</li>
        <li>NestJS backend organized by module, application, domain, and infrastructure</li>
        <li>Shared contracts package reused by both apps and e2e tests</li>
      </ul>
    </article>
  </section>
</template>

