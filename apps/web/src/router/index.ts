import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useGlobalLoading } from "../composables/useGlobalLoading";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";
import ManagementView from "../views/ManagementView.vue";
import PublicQuizzesView from "../views/PublicQuizzesView.vue";
import MyQuizzesView from "../views/MyQuizzesView.vue";
import ResultQuizPage from "../views/ResultQuizPage.vue";
import ResultQuizDetailView from "../views/ResultQuizDetailView.vue";
import CreateQuizView from "../views/CreateQuizView.vue";
import QuizEditorView from "../views/QuizEditorView.vue";
import ProfileView from "../views/ProfileView.vue";
import AccountSettingsView from "../views/AccountSettingsView.vue";
import PasswordSettingsView from "../views/PasswordSettingsView.vue";
import PublicQuizLandingPage from "../views/PublicQuizLandingPage.vue";
import PublicQuizTakeView from "../views/PublicQuizTakeView.vue";
import AuthCallbackView from "../views/AuthCallbackView.vue";
import { applySeo } from "../services/seo";

const managementPath = (path: string) => `/management${path}`;

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        seo: {
          title: "About",
          description: "Learn how Quiz App helps learners practice, improve, and build knowledge with simple quizzes.",
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
      component: PublicQuizzesView,
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
      component: LoginView,
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
      component: AuthCallbackView,
      meta: { bareLayout: true }
    },
    {
      path: "/q/:slug",
      name: "public-quiz",
      component: PublicQuizLandingPage,
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
      component: PublicQuizTakeView,
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
      component: ManagementView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Management",
          description: "Your Quiz App management dashboard — stats, recent quizzes, and quick actions.",
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
      redirect: { name: "account" }
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
      redirect: { name: "editor" }
    },
    {
      path: "/editor/:id",
      redirect: (to) => ({ name: "edit-quiz", params: to.params })
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
      component: ResultQuizPage,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Result Quiz",
          description: "View and analyze results for all quizzes in Quiz App.",
          canonicalPath: managementPath("/results")
        }
      }
    },
    {
      path: managementPath("/results/:quizId"),
      name: "result-quiz-detail",
      component: ResultQuizDetailView,
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
      component: MyQuizzesView,
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
      component: ProfileView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Profile",
          description: "Manage your personal information and profile settings in Quiz App.",
          canonicalPath: managementPath("/profile"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Profile", path: managementPath("/profile") }
          ]
        }
      }
    },
    {
      path: managementPath("/account"),
      name: "account",
      component: AccountSettingsView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Account",
          description: "Manage account settings for your Quiz App account.",
          canonicalPath: managementPath("/account"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Account", path: managementPath("/account") }
          ]
        }
      }
    },
    {
      path: managementPath("/password"),
      name: "password",
      component: PasswordSettingsView,
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
      component: CreateQuizView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Create Quiz",
          description: "Build a new quiz with setup details, guided question entry, and answer options.",
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
      component: CreateQuizView,
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
      name: "editor",
      component: QuizEditorView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Quiz Editor",
          description: "Create API-backed quizzes with titles, descriptions, questions, and correct answers.",
          canonicalPath: managementPath("/editor"),
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "Quiz Editor", path: managementPath("/editor") }
          ]
        }
      }
    },
    {
      path: managementPath("/editor/:id"),
      name: "edit-quiz",
      component: QuizEditorView,
      props: true,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Edit Quiz",
          description: "Edit an existing API-backed quiz in Quiz App.",
          breadcrumbs: [
            { name: "Management", path: "/management" },
            { name: "My Quizzes", path: managementPath("/quizzes") },
            { name: "Edit Quiz", path: managementPath("/editor") }
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
