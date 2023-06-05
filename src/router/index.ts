import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // DEFAULT LAYOUT
  {
    path: "",
    redirect: "/login",
    component: () => import("@/layouts/default.vue"),
    children: [
      {
        path: "/home",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "/transaction",
        component: () => import("@/views/transaction.vue"),
      },
      {
        path: "/plan",
        component: () => import("@/views/plan.vue"),
      },
    ],
  },

  // BLANK LAYOUT
  {
    path: "",
    component: () => import("@/layouts/blank.vue"),
    children: [
      {
        path: "/blank",
        component: () => import("@/views/blank.vue"),
      },
      {
        path: "/login",
        component: () => import("@/views/login.vue"),
      },
      {
        path: "/register",
        component: () => import("@/views/register.vue"),
      },
    ],
  },

  // NOT FOUND
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/not-found.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
