import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth-session";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MyQuizzesView from "../views/MyQuizzesView.vue";
import CreateQuizView from "../views/CreateQuizView.vue";
import QuizEditorView from "../views/QuizEditorView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: "/home",
      redirect: { name: "home" }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { bareLayout: true }
    },
    { path: "/quizzes", name: "quizzes", component: MyQuizzesView, meta: { requiresAuth: true } },
    {
      path: "/create-quiz",
      name: "create-quiz",
      component: CreateQuizView,
      meta: { requiresAuth: true }
    },
    { path: "/editor", name: "editor", component: QuizEditorView, meta: { requiresAuth: true } },
    {
      path: "/editor/:id",
      name: "edit-quiz",
      component: QuizEditorView,
      props: true,
      meta: { requiresAuth: true }
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
