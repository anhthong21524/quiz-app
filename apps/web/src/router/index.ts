import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth-session";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MyQuizzesView from "../views/MyQuizzesView.vue";
import CreateQuizView from "../views/CreateQuizView.vue";
import QuizEditorView from "../views/QuizEditorView.vue";
import ProfileView from "../views/ProfileView.vue";
import AccountSettingsView from "../views/AccountSettingsView.vue";
import PasswordSettingsView from "../views/PasswordSettingsView.vue";
import { applySeo } from "../services/seo";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Dashboard",
          description: "Review quiz activity, status summaries, and in-progress quiz work in Quiz App.",
          canonicalPath: "/",
          breadcrumbs: [{ name: "Dashboard", path: "/" }]
        }
      }
    },
    {
      path: "/home",
      redirect: { name: "home" }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        bareLayout: true,
        seo: {
          title: "Sign in",
          description: "Sign in to Quiz App to create, manage, and publish quizzes.",
          canonicalPath: "/login",
          breadcrumbs: [{ name: "Sign in", path: "/login" }]
        }
      }
    },
    {
      path: "/quizzes",
      name: "quizzes",
      component: MyQuizzesView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "My Quizzes",
          description: "Search, filter, sort, publish, and edit quizzes in Quiz App.",
          canonicalPath: "/quizzes",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "My Quizzes", path: "/quizzes" }
          ]
        }
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Profile",
          description: "Manage your personal information and profile settings in Quiz App.",
          canonicalPath: "/profile",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "Profile", path: "/profile" }
          ]
        }
      }
    },
    {
      path: "/account",
      name: "account",
      component: AccountSettingsView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Account",
          description: "Manage account settings for your Quiz App account.",
          canonicalPath: "/account",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "Account", path: "/account" }
          ]
        }
      }
    },
    {
      path: "/password",
      name: "password",
      component: PasswordSettingsView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Password",
          description: "Manage password settings for your Quiz App account.",
          canonicalPath: "/password",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "Password", path: "/password" }
          ]
        }
      }
    },
    {
      path: "/create-quiz",
      name: "create-quiz",
      component: CreateQuizView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Create Quiz",
          description: "Build a new quiz with setup details, guided question entry, and answer options.",
          canonicalPath: "/create-quiz",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "Create Quiz", path: "/create-quiz" }
          ]
        }
      }
    },
    {
      path: "/editor",
      name: "editor",
      component: QuizEditorView,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Quiz Editor",
          description: "Create API-backed quizzes with titles, descriptions, questions, and correct answers.",
          canonicalPath: "/editor",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "Quiz Editor", path: "/editor" }
          ]
        }
      }
    },
    {
      path: "/editor/:id",
      name: "edit-quiz",
      component: QuizEditorView,
      props: true,
      meta: {
        requiresAuth: true,
        seo: {
          title: "Edit Quiz",
          description: "Edit an existing API-backed quiz in Quiz App.",
          breadcrumbs: [
            { name: "Dashboard", path: "/" },
            { name: "My Quizzes", path: "/quizzes" },
            { name: "Edit Quiz", path: "/editor" }
          ]
        }
      }
    }
  ]
});

router.beforeEach((to) => {
  const authenticated = isAuthenticated();

  if (to.meta.requiresAuth && !authenticated) {
    return { name: "login" };
  }

  if (to.name === "login" && authenticated) {
    return { name: "home" };
  }

  return true;
});

router.afterEach((to) => {
  applySeo(to);
});
