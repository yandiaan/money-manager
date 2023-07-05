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
        meta: { requiresAuth: true },
      },
      {
        path: "/transaction",
        component: () => import("@/views/transaction.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/plan",
        component: () => import("@/views/plan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/account",
        component: () => import("@/views/account.vue"),
        meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    // Cek status autentikasi pengguna
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      // Token otentikasi tidak ada, alihkan ke halaman login
      next('/login');
    } else {
      // Token otentikasi ada, lanjutkan
      next();
    }
  } else {
    // Halaman tidak memerlukan autentikasi, lanjutkan
    next();
  }
});

export default router;
