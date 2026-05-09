import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useGlobalLoading } from "../composables/useGlobalLoading";
import { applySeo } from "../services/seo";

const managementPath = (path: string) => `/management${path}`;

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/public/HomeView.vue"),
      meta: {
        seo: {
          titleKey: "seo.home.title",
          descriptionKey: "seo.home.description",
          canonicalPath: "/",
          breadcrumbs: [{ nameKey: "navigation.home", path: "/" }]
        }
      }
    },
    {
      path: "/home",
      redirect: { name: "home" }
    },
    {
      path: "/guide",
      name: "user-guideline",
      component: () => import("../views/public/UserGuidelineView.vue"),
      meta: {
        seo: {
          titleKey: "seo.guide.title",
          descriptionKey: "seo.guide.description",
          canonicalPath: "/guide",
          breadcrumbs: [
            { nameKey: "navigation.home", path: "/" },
            { nameKey: "seo.guide.title", path: "/guide" }
          ]
        }
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/public/AboutView.vue"),
      meta: {
        seo: {
          titleKey: "seo.about.title",
          descriptionKey: "seo.about.description",
          canonicalPath: "/about",
          breadcrumbs: [
            { nameKey: "navigation.home", path: "/" },
            { nameKey: "navigation.about", path: "/about" }
          ]
        }
      }
    },
    {
      path: "/quizzes",
      name: "public-quizzes",
      component: () => import("../views/participant/QuizBrowseView.vue"),
      meta: {
        seo: {
          titleKey: "seo.publicQuizzes.title",
          descriptionKey: "seo.publicQuizzes.description",
          canonicalPath: "/quizzes",
          breadcrumbs: [
            { nameKey: "navigation.home", path: "/" },
            { nameKey: "seo.publicQuizzes.title", path: "/quizzes" }
          ]
        }
      }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/public/LoginView.vue"),
      meta: {
        seo: {
          titleKey: "seo.login.title",
          descriptionKey: "seo.login.description",
          canonicalPath: "/login",
          breadcrumbs: [{ nameKey: "seo.login.title", path: "/login" }]
        }
      }
    },
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: () => import("../views/public/AuthCallbackView.vue"),
      meta: { bareLayout: true }
    },
    {
      path: "/quizzes/user",
      name: "user-quizzes",
      component: () => import("../views/participant/UserQuizzesView.vue"),
      meta: {
        seo: {
          titleKey: "seo.userQuizzes.title",
          descriptionKey: "seo.userQuizzes.description",
          canonicalPath: "/quizzes/user",
          breadcrumbs: [
            { nameKey: "navigation.home", path: "/" },
            { nameKey: "seo.userQuizzes.title", path: "/quizzes/user" }
          ]
        }
      }
    },
    {
      path: "/q/:slug",
      name: "public-quiz",
      component: () => import("../views/participant/QuizLandingView.vue"),
      meta: {
        seo: {
          titleKey: "seo.publicQuiz.title",
          descriptionKey: "seo.publicQuiz.description",
          breadcrumbs: [{ nameKey: "seo.publicQuiz.title", path: "/q" }]
        }
      }
    },
    {
      path: "/q/:slug/take",
      name: "public-quiz-take",
      component: () => import("../views/participant/QuizTakeView.vue"),
      meta: {
        seo: {
          titleKey: "seo.takeQuiz.title",
          descriptionKey: "seo.takeQuiz.description",
          breadcrumbs: [{ nameKey: "seo.takeQuiz.title", path: "/q" }]
        }
      }
    },
    {
      path: "/quiz/:username/:slug",
      name: "user-quiz",
      component: () => import("../views/participant/QuizLandingView.vue"),
      meta: {
        seo: {
          titleKey: "seo.publicQuiz.title",
          descriptionKey: "seo.publicQuiz.description",
          breadcrumbs: [{ nameKey: "seo.publicQuiz.title", path: "/quiz" }]
        }
      }
    },
    {
      path: "/quiz/:username/:slug/take",
      name: "user-quiz-take",
      component: () => import("../views/participant/QuizTakeView.vue"),
      meta: {
        seo: {
          titleKey: "seo.takeQuiz.title",
          descriptionKey: "seo.takeQuiz.description",
          breadcrumbs: [{ nameKey: "seo.takeQuiz.title", path: "/quiz" }]
        }
      }
    },
    {
      path: "/management",
      name: "management",
      component: () => import("../views/management/DashboardView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.management.title",
          descriptionKey: "seo.management.description",
          canonicalPath: "/management",
          breadcrumbs: [{ nameKey: "seo.management.title", path: "/management" }]
        }
      }
    },
    {
      path: "/profile",
      redirect: { name: "profile" }
    },
    {
      path: "/account",
      redirect: { name: "configuration" }
    },
    {
      path: "/configuration",
      redirect: { name: "configuration" }
    },
    {
      path: "/password",
      redirect: { name: "password" }
    },
    {
      path: managementPath("/profile"),
      redirect: { name: "profile" }
    },
    {
      path: managementPath("/configuration"),
      redirect: { name: "configuration" }
    },
    {
      path: managementPath("/account"),
      redirect: { name: "configuration" }
    },
    {
      path: managementPath("/password"),
      redirect: { name: "password" }
    },
    {
      path: "/create-quiz",
      redirect: { name: "create-quiz" }
    },
    {
      path: "/editor",
      redirect: { name: "create-quiz" }
    },
    {
      path: "/editor/:id",
      redirect: (to) => ({ name: "edit-quiz-questions", params: to.params })
    },
    {
      path: "/results",
      redirect: { name: "results" }
    },
    {
      path: "/results/:quizId",
      redirect: (to) => ({ name: "result-quiz-detail", params: to.params })
    },
    {
      path: managementPath("/results"),
      redirect: { name: "results" }
    },
    {
      path: managementPath("/results/:quizId"),
      redirect: (to) => ({ name: "result-quiz-detail", params: to.params })
    },
    {
      path: managementPath("/quizzes/results"),
      name: "results",
      component: () => import("../views/management/QuizResultsView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.results.title",
          descriptionKey: "seo.results.description",
          canonicalPath: managementPath("/quizzes/results")
        }
      }
    },
    {
      path: managementPath("/quizzes/results/:quizId"),
      name: "result-quiz-detail",
      component: () => import("../views/management/QuizResultDetailView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.resultDetail.title",
          descriptionKey: "seo.resultDetail.description",
          canonicalPath: managementPath("/quizzes/results")
        }
      }
    },
    {
      path: managementPath("/quizzes"),
      name: "quizzes",
      component: () => import("../views/management/MyQuizzesView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.myQuizzes.title",
          descriptionKey: "seo.myQuizzes.description",
          canonicalPath: managementPath("/quizzes"),
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.myQuizzes.title", path: managementPath("/quizzes") }
          ]
        }
      }
    },
    {
      path: managementPath("/me/profile"),
      name: "profile",
      component: () => import("../views/management/ProfileView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.profile.title",
          descriptionKey: "seo.profile.description",
          canonicalPath: managementPath("/me/profile"),
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.profile.title", path: managementPath("/me/profile") }
          ]
        }
      }
    },
    {
      path: managementPath("/me/configuration"),
      alias: [managementPath("/me/account")],
      name: "configuration",
      component: () => import("../views/management/ConfigurationSettingsView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.configuration.title",
          descriptionKey: "seo.configuration.description",
          canonicalPath: managementPath("/me/configuration"),
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.configuration.title", path: managementPath("/me/configuration") }
          ]
        }
      }
    },
    {
      path: managementPath("/me/password"),
      name: "password",
      component: () => import("../views/management/PasswordSettingsView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.password.title",
          descriptionKey: "seo.password.description",
          canonicalPath: managementPath("/me/password"),
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.password.title", path: managementPath("/me/password") }
          ]
        }
      }
    },
    {
      path: managementPath("/create-quiz"),
      name: "create-quiz",
      component: () => import("../views/management/CreateQuizView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.createQuiz.title",
          descriptionKey: "seo.createQuiz.description",
          canonicalPath: managementPath("/create-quiz"),
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.createQuiz.title", path: managementPath("/create-quiz") }
          ]
        }
      }
    },
    {
      path: managementPath("/quizzes/:id/questions"),
      name: "edit-quiz-questions",
      component: () => import("../views/management/CreateQuizView.vue"),
      props: true,
      meta: {
        requiresAuth: true,
        seo: {
          titleKey: "seo.editQuiz.title",
          descriptionKey: "seo.editQuiz.description",
          breadcrumbs: [
            { nameKey: "seo.management.title", path: "/management" },
            { nameKey: "seo.myQuizzes.title", path: managementPath("/quizzes") },
            { nameKey: "seo.editQuiz.title", path: managementPath("/quizzes") }
          ]
        }
      }
    },
    {
      path: managementPath("/editor"),
      redirect: { name: "create-quiz" }
    },
    {
      path: managementPath("/editor/:id"),
      redirect: (to) => ({ name: "edit-quiz-questions", params: to.params })
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/public/NotFoundView.vue"),
      meta: {
        seo: {
          titleKey: "seo.notFound.title",
          descriptionKey: "seo.notFound.description",
          breadcrumbs: [
            { nameKey: "navigation.home", path: "/" },
            { nameKey: "seo.notFound.title", path: "" }
          ]
        }
      }
    }
  ]
});

const globalLoading = useGlobalLoading();

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const authenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !authenticated) {
    return { name: "login" };
  }

  if (to.name === "login" && authenticated) {
    return { name: "management" };
  }

  globalLoading.start();
  return true;
});

router.afterEach((to) => {
  globalLoading.done();
  applySeo(to);
});
