<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

type TabId = "getting-started" | "quiz-creator" | "participant";

const activeTab = ref<TabId>("getting-started");

const tabs: { id: TabId; label: string }[] = [
  { id: "getting-started", label: "Getting Started" },
  { id: "quiz-creator", label: "For Quiz Creator" },
  { id: "participant", label: "For Participant" },
];
</script>

<template>
  <section class="min-h-full bg-white text-slate-950 dark:bg-slate-900 dark:text-white">
    <div class="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">

      <!-- Hero -->
      <div class="mb-10 grid gap-3">
        <p class="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          User Guideline
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          How to use <span class="text-emerald-600 dark:text-emerald-400">Quiz App</span>
        </h1>
        <p class="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Everything you need to know — whether you're creating your first quiz or taking one as a participant.
        </p>
      </div>

      <!-- Tab bar -->
      <div class="mb-8 flex gap-1.5 rounded-2xl bg-emerald-600 p-1.5 dark:bg-emerald-700">
        <button
          v-for="tab in tabs"
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

      <!-- ── GETTING STARTED ── -->
      <div v-show="activeTab === 'getting-started'" class="grid gap-6">

        <!-- Home page screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/home.jpg"
            alt="Quiz App home page"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            The Quiz App home page — start a quiz or browse public quizzes without an account.
          </div>
        </div>

        <!-- Quick start card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Quick Start</h2>
          </div>
          <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">Get the app running and sign in for the first time in four steps.</p>
          <ul class="grid gap-4">
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">1</span>
              <div>
                <p class="font-semibold">Open the web app</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Navigate to <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-emerald-700 dark:bg-slate-700 dark:text-emerald-400">http://localhost:5173</code> in your browser. The home page loads without requiring an account — you can browse public quizzes right away.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">2</span>
              <div>
                <p class="font-semibold">The API runs separately</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">The backend API is at <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-emerald-700 dark:bg-slate-700 dark:text-emerald-400">http://localhost:3000/api</code>. Regular users never need to open it directly; the web app communicates with it automatically.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">3</span>
              <div>
                <p class="font-semibold">Sign in with the default admin account</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">For local testing, use email <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-emerald-700 dark:bg-slate-700 dark:text-emerald-400">admin@quiz.app</code> and password <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-emerald-700 dark:bg-slate-700 dark:text-emerald-400">admin1234</code>. This account is seeded automatically when the API starts.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">4</span>
              <div>
                <p class="font-semibold">Protected pages require a session</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Any management page (dashboard, quiz editor, results) redirects to <strong>/login</strong> if you are not signed in. After a successful sign-in the app returns you to the page you tried to open.</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Login screenshot + sign-in cards -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
            <img
              src="/guide-images/login.jpg"
              alt="Login page"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Sign in with email/password or Google OAuth.
            </div>
          </div>

          <div class="grid gap-4 content-start">
            <!-- Sign in with email -->
            <div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
              <div class="mb-4 flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">Sign in with email</h3>
              </div>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>/login</strong>.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Enter your registered email address.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Enter your password.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Select <strong>Sign in</strong>. Inline error messages appear if credentials are incorrect.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> The app opens the management dashboard on success.</li>
              </ol>
            </div>

            <!-- Sign in with Google -->
            <div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
              <div class="mb-4 flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15.5 9A6.5 6.5 0 1 0 12 18.5" stroke-linecap="round" />
                    <path d="M12 12h8.5M17 9l3.5 3L17 15" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">Sign in with Google</h3>
              </div>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>/login</strong>.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Select <strong>Continue with Google</strong>.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Choose or confirm your Google account in the pop-up.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Grant the requested permissions.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> The app redirects back and opens the management dashboard.</li>
              </ol>
              <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">If the Google button is not visible, Google OAuth is not configured in this environment. Use email sign-in instead.</p>
            </div>
          </div>
        </div>

        <!-- Create an account -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Create an Account</h2>
          </div>
          <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">New users can self-register to create and manage their own quizzes.</p>
          <ol class="grid gap-4">
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">1</span>
              <div>
                <p class="font-semibold">Open the login page</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Navigate to <strong>/login</strong>. The sign-in form is shown by default.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">2</span>
              <div>
                <p class="font-semibold">Switch to the registration form</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Select <strong>Create an account</strong> or the equivalent link below the sign-in button.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">3</span>
              <div>
                <p class="font-semibold">Fill in the required fields</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Enter a display name, a valid email address, and a password. Inline validation messages appear immediately when a field value is missing or invalid.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">4</span>
              <div>
                <p class="font-semibold">Submit the form</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Select <strong>Register</strong>. If the email is already registered the app shows an error — use <strong>Sign in</strong> instead or try a different address.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 text-slate-700 dark:text-slate-300">
              <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">5</span>
              <div>
                <p class="font-semibold">You are signed in automatically</p>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">After a successful registration the app signs you in immediately and opens the management dashboard.</p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Navigation overview -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Navigation Overview</h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">Public pages (no account needed)</p>
              <ul class="grid gap-1 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/</code> Home landing page</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/about</code> About the app</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/quizzes</code> Browse public quizzes</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/login</code> Sign in or register</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/guide</code> This guideline page</li>
              </ul>
            </div>
            <div class="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">Management pages (sign in required)</p>
              <ul class="grid gap-1 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/management</code> Dashboard overview</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/management/quizzes</code> My Quizzes list</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/management/create-quiz</code> Create a new quiz</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/results</code> Quiz results &amp; analytics</li>
                <li class="flex gap-2"><code class="text-emerald-600 dark:text-emerald-400">/management/profile</code> Your profile &amp; settings</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <RouterLink
            class="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            :to="{ name: 'login' }"
          >
            Sign in now
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- ── FOR QUIZ CREATOR ── -->
      <div v-show="activeTab === 'quiz-creator'" class="grid gap-6">

        <!-- Dashboard screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/management-dashboard.jpg"
            alt="Management dashboard"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            The management dashboard — see your quiz stats, recent activity, and quick actions at a glance.
          </div>
        </div>

        <!-- Management Dashboard walkthrough -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Management Dashboard</h2>
          </div>
          <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">After signing in, the dashboard gives you a complete overview of your quiz activity at a glance.</p>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">Summary cards</p>
              <ul class="grid gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Total quizzes you have created</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span> Quizzes still in progress (not yet saved)</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Published quizzes available to participants</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500"></span> Total participant submissions across all quizzes</li>
              </ul>
            </div>
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-2 font-bold text-slate-800 dark:text-slate-200">Quick actions</p>
              <ul class="grid gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Create Quiz</strong> button — jump directly to the quiz builder</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Recent quizzes table — open, edit, or continue where you left off</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Hero section — context-aware prompts to help first-time creators</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Create a quiz -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-6 flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Create a Quiz</h2>
            </div>
            <ol class="grid gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">1.</span>
                <div><strong>Open Create Quiz</strong> from the header or the management dashboard.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">2.</span>
                <div>
                  <strong>Fill in the quiz configuration:</strong>
                  <ul class="mt-2 grid gap-1 pl-1">
                    <li><strong>Title</strong> — the quiz name shown to participants.</li>
                    <li><strong>Description</strong> — optional context shown on the quiz landing page.</li>
                    <li><strong>Subject / Domain</strong> — chosen from your configured subjects.</li>
                    <li><strong>Number of questions</strong> — 1 to 50.</li>
                    <li><strong>Time limit</strong> — in minutes, or <em>Unlimited</em> for no countdown.</li>
                    <li><strong>Difficulty</strong> — Easy, Medium, or Hard; shown as a badge on public listings.</li>
                  </ul>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">3.</span>
                <div>
                  <strong>Choose access and participant behavior:</strong>
                  <ul class="mt-2 grid gap-1 pl-1">
                    <li><strong>Private quiz</strong> — hides the quiz from public browse and requires a 6-character access code to start.</li>
                    <li><strong>Show summary</strong> — if enabled, participants see a score summary after submitting.</li>
                    <li><strong>Allow answer review</strong> — if enabled, participants can review correct answers and explanations.</li>
                    <li><strong>Allow retake</strong> — if enabled, participants can restart the quiz from the results page.</li>
                  </ul>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">4.</span>
                <div><strong>Select Create questions</strong> to advance to the question editor. The number of question slots matches the count you set in step 2.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">5.</span>
                <div>
                  <strong>For each question:</strong>
                  <ul class="mt-2 grid gap-1 pl-1">
                    <li>Write the question text in the main field.</li>
                    <li>Add at least two answer options. Use <strong>Add option</strong> for more choices.</li>
                    <li>Select the radio button beside the correct answer to mark it.</li>
                    <li>Optionally add an explanation — it is shown to participants during answer review.</li>
                  </ul>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">6.</span>
                <div><strong>Use the question navigator</strong> at the top of the editor to jump between questions. Completed questions show a green indicator; unanswered ones show amber.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">7.</span>
                <div><strong>Select Save quiz</strong> after the final question. The quiz is saved with status <em>In Progress</em> — you must publish it separately to make it available.</div>
              </li>
            </ol>
          </div>

          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700 self-start">
            <img
              src="/guide-images/create-quiz.jpg"
              alt="Create quiz form"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              The quiz configuration form — set title, difficulty, time limit, and access options.
            </div>
          </div>
        </div>

        <!-- Edit a quiz -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Edit a Quiz</h2>
          </div>
          <ol class="grid gap-4 text-sm text-slate-600 dark:text-slate-400">
            <li class="flex gap-2">
              <span class="font-bold text-emerald-600 shrink-0">1.</span>
              <div><strong>Open My Quizzes</strong> from the navigation.</div>
            </li>
            <li class="flex gap-2">
              <span class="font-bold text-emerald-600 shrink-0">2.</span>
              <div><strong>Find the quiz</strong> you want to edit using the search box or filters if the list is long.</div>
            </li>
            <li class="flex gap-2">
              <span class="font-bold text-emerald-600 shrink-0">3.</span>
              <div><strong>Select the edit icon</strong> (pencil) in the quiz's action column. This opens the quiz configuration form pre-filled with existing values.</div>
            </li>
            <li class="flex gap-2">
              <span class="font-bold text-emerald-600 shrink-0">4.</span>
              <div><strong>Update the configuration</strong> as needed, then select <strong>Save configuration</strong>.</div>
            </li>
            <li class="flex gap-2">
              <span class="font-bold text-emerald-600 shrink-0">5.</span>
              <div>To change questions, select <strong>Edit questions</strong>. Use <strong>Next question</strong> to move through each slot, and <strong>Update quiz</strong> on the last question to save.</div>
            </li>
          </ol>
          <div class="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <strong>Note:</strong> Published quizzes open in view-only mode. To modify a published quiz, go to <strong>My Quizzes</strong>, unpublish it first, make your edits, then publish it again when ready.
          </div>
        </div>

        <!-- My Quizzes screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/my-quizzes.jpg"
            alt="My Quizzes page"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            My Quizzes — search, filter, sort, publish, share, duplicate, or delete any of your quizzes.
          </div>
        </div>

        <!-- Manage Quizzes -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 4.75h10M7 9.75h10M7 14.75h10" stroke-linecap="round" />
                <path d="M5 4.75h.01M5 9.75h.01M5 14.75h.01" stroke-linecap="round" />
                <path d="M4 3h16v18H4z" stroke-linejoin="round" opacity="0.3" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Manage Quizzes</h2>
          </div>
          <p class="mb-4 text-sm text-slate-500 dark:text-slate-400">The <strong>My Quizzes</strong> page is your central workspace for organizing and acting on all your quizzes.</p>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Finding quizzes</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Type in the <strong>Search</strong> box to filter by title or subject in real time.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Use the <strong>Status</strong> filter to show only In Progress, Published, or Unpublished quizzes.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Use the <strong>Subject</strong> filter to narrow to a specific topic area.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Select a column header to sort by that field; select again to reverse the order.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> Toggle between <strong>list</strong> and <strong>grid</strong> view using the icons in the top-right.</li>
              </ol>
            </div>
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Actions per quiz</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Preview</strong> — open the public quiz landing page in a new tab.</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Edit</strong> — open the configuration or question editor.</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Share</strong> — copy the shareable quiz link or access code.</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Publish / Unpublish</strong> — toggle participant access.</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Duplicate</strong> — create a full copy including all questions.</li>
                <li class="flex items-center gap-2"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400"></span> <strong>Delete</strong> — permanently remove the quiz (confirmation required).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Quiz statuses -->
        <div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <h3 class="mb-4 text-lg font-extrabold text-slate-950 dark:text-white">Quiz Statuses</h3>
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="flex items-start gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/40">
              <span class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400"></span>
              <div>
                <p class="font-bold text-amber-800 dark:text-amber-300">In Progress</p>
                <p class="text-sm text-amber-700 dark:text-amber-400">Still being built; not available to participants. Edit freely without affecting anyone.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
              <span class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"></span>
              <div>
                <p class="font-bold text-emerald-800 dark:text-emerald-300">Published</p>
                <p class="text-sm text-emerald-700 dark:text-emerald-400">Live and available. Public quizzes appear in the browse list; private ones require an access code.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl bg-slate-100 p-4 dark:bg-slate-700/50">
              <span class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-400"></span>
              <div>
                <p class="font-bold text-slate-700 dark:text-slate-300">Unpublished</p>
                <p class="text-sm text-slate-600 dark:text-slate-400">Exists but not accessible to participants. Can be published again at any time.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Publish & Share detail -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Publish &amp; Share a Quiz</h2>
          </div>
          <div class="grid gap-6 lg:grid-cols-2">
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">How to publish</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>My Quizzes</strong>.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Find the quiz you want to make live.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Open its action menu (three-dot icon) or use the <strong>Publish</strong> button directly.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Confirm the publish action in the dialog that appears.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> The quiz status badge changes to <em>Published</em> immediately.</li>
              </ol>
            </div>
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">How to share</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> With a published quiz, select the <strong>Share</strong> action.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Copy the shareable link. Sending this URL lets anyone open the quiz landing page directly.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> For <strong>private quizzes</strong>, also copy and share the 6-character access code. Participants must enter this code before they can start.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> To revoke access, select <strong>Unpublish</strong> from the action menu. The quiz link stops working immediately.</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Quiz Results screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/quiz-results.jpg"
            alt="Quiz Results page"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Quiz Results — analyze submissions, filter by subject or date, and export as CSV.
          </div>
        </div>

        <!-- Review Results detail -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 18V6M5 18h14" stroke-linecap="round" />
                <path d="m8 15 3-4 3 2 4-7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Review Results</h2>
          </div>
          <div class="grid gap-6 lg:grid-cols-2">
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Results overview page</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>Quiz Results</strong> from the navigation.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Read the summary cards at the top: total quizzes, total submissions, and average score across all quizzes.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Use the <strong>Search</strong> box to filter by quiz name.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Use <strong>Subject</strong> and <strong>Date range</strong> filters to narrow the results.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> Select <strong>Export CSV</strong> to download the current filtered list as a spreadsheet.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">6.</span> Select a quiz row to open its submission detail page.</li>
              </ol>
            </div>
            <div>
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Submission detail page</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> The detail page lists every submission for that quiz: participant name, score, time spent, and submission date.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Select a submission row to expand it and see the participant's selected answers, the correct answers, and any explanations.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Use the <strong>Export CSV</strong> button on this page to download submissions for that specific quiz.</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Profile & Settings -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Profile &amp; Settings</h2>
          </div>
          <div class="grid gap-5 sm:grid-cols-3">
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Profile</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>Profile</strong> from the account menu.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> View your display name and email address.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Upload a new avatar image — must be under 2 MB. The image is cropped to a circle.</li>
              </ol>
            </div>
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Subjects</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>Account Settings</strong>.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Add, rename, reorder, or remove Subject / Domain values.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> These values populate the subject dropdown when creating or editing a quiz.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> At least one subject must remain configured at all times.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">5.</span> Select <strong>Reset to defaults</strong> to restore the original list.</li>
              </ol>
            </div>
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Password</p>
              <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>Password</strong> from the account settings.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Enter your current password to verify your identity.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Enter a new password and confirm it.</li>
                <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> Select <strong>Update password</strong>. The change takes effect immediately.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FOR PARTICIPANT ── -->
      <div v-show="activeTab === 'participant'" class="grid gap-6">

        <!-- Public Quizzes screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/public-quizzes.jpg"
            alt="Public Quizzes page"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Public Quizzes — browse all available quizzes and use "Enter code" to access private ones.
          </div>
        </div>

        <!-- Take a public quiz -->
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-6 flex items-center gap-3">
              <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l6 4-6 4V8z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Take a Public Quiz</h2>
            </div>
            <ol class="grid gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">1.</span>
                <div><strong>Open Public Quizzes</strong> from the top navigation. No account is required.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">2.</span>
                <div><strong>Browse or search</strong> for a quiz. Use the search box to filter by title or subject, or sort by difficulty or date.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">3.</span>
                <div><strong>Select a quiz card</strong> to open its landing page. The landing page shows the quiz title, description, question count, time limit, and difficulty.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">4.</span>
                <div><strong>Enter your name</strong> in the participant name field. This name appears in the creator's results page.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">5.</span>
                <div><strong>Select Start quiz</strong>. The quiz loads immediately and the timer (if any) begins counting down.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">6.</span>
                <div><strong>Answer each question</strong> by selecting one of the choices. Use the question navigator to jump to any question at any time. Answered questions are highlighted.</div>
              </li>
              <li class="flex gap-2">
                <span class="font-bold text-emerald-600 shrink-0">7.</span>
                <div><strong>Select Submit quiz</strong> when you are ready. A confirmation dialog appears if any questions are unanswered. If the timer reaches zero the quiz is submitted automatically.</div>
              </li>
            </ol>
            <div class="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <strong>Timed quizzes:</strong> the countdown is shown in the header. If you navigate away the app warns you that your progress may be lost.
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700 self-start">
            <img
              src="/guide-images/quiz-landing.jpg"
              alt="Quiz landing page"
              class="w-full object-cover"
            />
            <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Quiz landing page — review the quiz details and enter your name to begin.
            </div>
          </div>
        </div>

        <!-- Quiz take screenshot -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-slate-700">
          <img
            src="/guide-images/quiz-take.jpg"
            alt="Quiz taking view"
            class="w-full object-cover"
          />
          <div class="bg-slate-50 px-5 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            The quiz taking view — answer questions one by one, use the navigator, and submit when ready.
          </div>
        </div>

        <!-- During a quiz tips -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">During a Quiz</h2>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Question navigator</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Each numbered button in the navigator represents one question.</li>
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> <strong>Filled / green</strong> — question has been answered.</li>
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span> <strong>Outlined / amber</strong> — question not yet answered.</li>
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"></span> Select any button to jump directly to that question.</li>
              </ul>
            </div>
            <div class="rounded-xl bg-slate-50 p-5 dark:bg-slate-700/50">
              <p class="mb-3 font-bold text-slate-800 dark:text-slate-200">Changing an answer</p>
              <ul class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> You can revisit and change any answer before submitting.</li>
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Navigate back to the question and select a different option.</li>
                <li class="flex items-start gap-2"><span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span> Once submitted, answers cannot be changed.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Private quiz -->
          <div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-4 flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">Take a Private Quiz</h3>
            </div>
            <p class="mb-3 text-sm text-slate-500 dark:text-slate-400">Private quizzes do not appear in the public listing. You need a 6-character access code from the quiz creator to enter.</p>
            <ol class="grid gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex gap-2"><span class="font-bold text-emerald-600">1.</span> Open <strong>Public Quizzes</strong> from the navigation.</li>
              <li class="flex gap-2"><span class="font-bold text-emerald-600">2.</span> Select <strong>Enter code</strong> (shown near the top of the page).</li>
              <li class="flex gap-2"><span class="font-bold text-emerald-600">3.</span> Type the 6-character code shared by the creator and submit it.</li>
              <li class="flex gap-2"><span class="font-bold text-emerald-600">4.</span> The quiz landing page opens — enter your name and start.</li>
            </ol>
            <p class="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">If the quiz creator sent you a direct link that already contains the access code, it opens the landing page directly — you do not need to enter the code manually.</p>
          </div>

          <!-- After submission -->
          <div class="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-4 flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m6 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h3 class="text-lg font-extrabold text-slate-950 dark:text-white">After Submission</h3>
            </div>
            <p class="mb-3 text-sm text-slate-500 dark:text-slate-400">What you see after submitting depends on the settings the quiz creator chose.</p>
            <ul class="grid gap-3 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex items-start gap-2">
                <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <div><strong>Result summary</strong> — shows your final score, number of correct answers, and time taken.</div>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <div><strong>Answer review</strong> — shows each question with your answer highlighted, the correct answer, and any explanations the creator added.</div>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                <div><strong>Retake option</strong> — a <em>Retake quiz</em> button restarts the attempt from question 1 with a fresh timer.</div>
              </li>
            </ul>
            <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">If none of these are enabled by the creator, the page shows a simple confirmation that your submission was received.</p>
          </div>
        </div>

        <!-- Troubleshooting -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
          <div class="mb-6 flex items-center gap-3">
            <div class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-950 dark:text-white">Troubleshooting</h2>
          </div>
          <div class="grid gap-3">
            <div class="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="text-sm">
                <p class="font-semibold text-slate-800 dark:text-slate-200">Quiz not visible in the public list</p>
                <p class="text-slate-500 dark:text-slate-400">The quiz may not be published, or it may be private. Ask the creator to share the direct link or access code.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="text-sm">
                <p class="font-semibold text-slate-800 dark:text-slate-200">Access code rejected</p>
                <p class="text-slate-500 dark:text-slate-400">Codes are case-sensitive. Make sure the quiz is still published — if the creator unpublished it the code will not work.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="text-sm">
                <p class="font-semibold text-slate-800 dark:text-slate-200">Timer ran out before submitting</p>
                <p class="text-slate-500 dark:text-slate-400">When the countdown reaches zero the app automatically submits whatever answers you have given. Unanswered questions count as incorrect.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <div class="text-sm">
                <p class="font-semibold text-slate-800 dark:text-slate-200">No score or answer review shown after submitting</p>
                <p class="text-slate-500 dark:text-slate-400">The quiz creator may have disabled the summary and answer review options. Only a submission confirmation is shown in that case.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-start">
          <RouterLink
            class="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            :to="{ name: 'public-quizzes' }"
          >
            Browse quizzes
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>
