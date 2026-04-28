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
      component: () => import("../views/HomeView.vue"),
      meta: {
        seo: {
          title: "Home",
          description: "Take quizzes, explore topics, and improve every day with Quiz App.",
          canonicalPath: "/",
          breadcrumbs: [{ name: "Home", path: "/" }]
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
      component: () => import("../views/UserGuidelineView.vue"),
      meta: {
        seo: {
          title: "User Guideline",
          description:
            "Learn how to use Quiz App — getting started, creating quizzes, and taking quizzes as a participant.",
          canonicalPath: "/guide",
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "User Guideline", path: "/guide" }
          ]
        }
      }
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        seo: {
          title: "About",
          description:
            "Learn how Quiz App helps learners practice, improve, and build knowledge with simple quizzes.",
          canonicalPath: "/about",
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" }
          ]
        }
      }
    },
    {
      path: "/quizzes",
      name: "public-quizzes",
      component: () => import("../views/PublicQuizzesView.vue"),
      meta: {
        seo: {
          title: "Public Quizzes",
          description: "Browse published public quizzes and start one without signing in.",
          canonicalPath: "/quizzes",
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Public Quizzes", path: "/quizzes" }
          ]
        }
      }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        seo: {
          title: "Sign in",
          description: "Sign in to Quiz App to create, manage, and publish quizzes.",
          canonicalPath: "/login",
          breadcrumbs: [{ name: "Sign in", path: "/login" }]
        }
      }
    },
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: () => import("../views/AuthCallbackView.vue"),
      meta: { bareLayout: true }
    },
    {
      path: "/quizzes/private",
      name: "private-quiz-entry",
      component: () => import("../views/PrivateQuizEntryView.vue"),
      meta: {
        seo: {
          title: "Private Quiz",
          description: "Enter your private quiz access code to unlock and start the quiz.",
          canonicalPath: "/quizzes/private",
          breadcrumbs: [
            { name: "Home", path: "/" },
            { name: "Private Quiz", path: "/quizzes/private" }
          ]
        }
      }
    },
    {
      path: "/q/:slug",
      name: "public-quiz",
      component: () => import("../views/PublicQuizLandingPage.vue"),
      meta: {
        seo: {
          title: "Public Quiz",
          description: "Enter your name and start a public Quiz App quiz.",
          breadcrumbs: [{ name: "Public Quiz", path: "/q" }]
        }
      }
    },
    {
      path: "/q/:slug/take",
      name: "public-quiz-take",
      component: () => import("../views/PublicQuizTakeView.vue"),
      meta: {
        seo: {
          title: "Take Quiz",
          description: "Answer questions in a public Quiz App quiz.",
          breadcrumbs: [{ name: "Take Quiz", path: "/q" }]
        }
      }
    },
    {
      path: "/management",
      name: "management",
      component: () => import("../views/ManagementView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Management",
          description:
            "Your Quiz App management dashboard — stats, recent quizzes, and quick actions.",
          canonicalPath: "/management",
          breadcrumbs: [{ name: "Management", path: "/management" }]
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
      name: "results",
      component: () => import("../views/ResultQuizPage.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Quiz Results",
          description: "View and analyze results for all quizzes in Quiz App.",
          canonicalPath: managementPath("/results")
        }
      }
    },
    {
      path: managementPath("/results/:quizId"),
      name: "result-quiz-detail",
      component: () => import("../views/ResultQuizDetailView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Quiz Results",
          description: "View submissions and analytics for a single quiz.",
          canonicalPath: managementPath("/results")
        }
      }
    },
    {
      path: managementPath("/quizzes"),
      name: "quizzes",
      component: () => import("../views/MyQuizzesView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "My Quizzes",
          description: "Search, filter, sort, publish, and edit quizzes in Quiz App.",
          canonicalPath: managementPath("/quizzes"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "My Quizzes", path: managementPath("/quizzes") }
          ]
        }
      }
    },
    {
      path: managementPath("/profile"),
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Profile",
          description:
            "Manage your personal information and profile settings in Quiz App.",
          canonicalPath: managementPath("/profile"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Profile", path: managementPath("/profile") }
          ]
        }
      }
    },
    {
      path: managementPath("/configuration"),
      alias: [managementPath("/account")],
      name: "configuration",
      component: () => import("../views/ConfigurationSettingsView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Configuration",
          description:
            "Configure quiz setup defaults and Subject / Domain choices in Quiz App.",
          canonicalPath: managementPath("/configuration"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Configuration", path: managementPath("/configuration") }
          ]
        }
      }
    },
    {
      path: managementPath("/password"),
      name: "password",
      component: () => import("../views/PasswordSettingsView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Password",
          description: "Manage password settings for your Quiz App account.",
          canonicalPath: managementPath("/password"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Password", path: managementPath("/password") }
          ]
        }
      }
    },
    {
      path: managementPath("/create-quiz"),
      name: "create-quiz",
      component: () => import("../views/CreateQuizView.vue"),
      meta: {
        requiresAuth: true,
        seo: {
          title: "Create Quiz",
          description:
            "Build a new quiz with setup details, guided question entry, and answer options.",
          canonicalPath: managementPath("/create-quiz"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Create Quiz", path: managementPath("/create-quiz") }
          ]
        }
      }
    },
    {
      path: managementPath("/quizzes/:id/questions"),
      name: "edit-quiz-questions",
      component: () => import("../views/CreateQuizView.vue"),
      props: true,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Edit Quiz",
          description: "Edit quiz configuration and questions in the guided quiz builder.",
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "My Quizzes", path: managementPath("/quizzes") },
            { name: "Edit Questions", path: managementPath("/quizzes") }
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
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        seo: {
          title: "Page Not Found",
          description: "The page you are looking for does not exist.",
          breadcrumbs: [{ name: "Home", path: "/" }, { name: "Not Found", path: "" }]
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
