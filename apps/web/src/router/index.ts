import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import MyQuizzesView from "../views/MyQuizzesView.vue";
import QuizEditorView from "../views/QuizEditorView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
      meta: { bareLayout: true }
    },
    {
      path: "/login",
      redirect: { name: "login" }
    },
    { path: "/quizzes", name: "quizzes", component: MyQuizzesView },
    { path: "/editor", name: "editor", component: QuizEditorView },
    { path: "/editor/:id", name: "edit-quiz", component: QuizEditorView, props: true }
  ]
});
