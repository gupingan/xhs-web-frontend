// 更新 router.js
import Vue from "vue";
import VueRouter from "vue-router";
import AppMain from "./components/AppMain.vue";
import UserLogin from "./components/UserLogin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: UserLogin,
  },
  {
    path: "/main",
    component: AppMain,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
