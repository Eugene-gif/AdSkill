import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import { useStore } from "@/stores/store";

const BaseLayout = () => import("../layouts/BaseLayout.vue");
const AuthLayout = () => import("../layouts/AuthLayout.vue");

// Основные роуты
import MainRoutes from "../router/MainRoutes";
import { CurrencyData, UserRest } from "@/services/UserService";
const Authorization = () =>
  import("../modules/AuthForms/Authorization.vue");
const Register = () => import("../modules/AuthForms/Register.vue");
// const Profile = () => import('../modules/Profile/Profile.vue');

const NotFound = () => import("../components/NotFound.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "base-layout",
    redirect: "/profile",
    component: BaseLayout,
    meta: {
      requiresAuth: true,
    },
    children: [...MainRoutes],
    beforeEnter: async (to, from, next) => {
      // Сервис профиля
      const userService = new UserRest();
      const response: CurrencyData = await userService.getWallets();
      const userStore = useStore();

      if (response.isErr()) {
        const errText: any = response.error;
        console.log(errText);
      }

      if (response.isOk()) {
        userStore.setCurrencies(response.value);
      }
      next();
    },
  },
  {
    path: "/auth",
    name: "auth-layout",
    redirect: "/auth/login",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "auth-login",
        component: Authorization,
      },
      {
        path: "register",
        name: "auth-register",
        component: Register,
      },
    ],
  },
  {
    path: "/code",
    name: "code",
    component: () =>
      import("../modules/AuthForms/codeVerify/CodeVerify.vue"),
  },
  {
    path: "/:pathMath(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const profile = store.profile;
  const requireAuth = to.matched.some(
    (record) => record.meta.requiresAuth
  );
  const roles = to.matched.some((record) => record.meta.role);

  to.params.activeLink = "true";
  //
  // function checkRole() {
  //     let requiredRoles = to.meta.role;
  //
  //     for (let i = 0; i < requiredRoles.length; i++) {
  //         const hasRole = profile.role.findIndex((role) => role.value === requiredRoles[i]) !== -1;
  //
  //         if (hasRole) {
  //             next();
  //
  //             return;
  //         }
  //     }
  //
  //     profile.role.forEach((role) => {
  //         if (role.value === 'ROLE_SUPER_ADMIN') next('/organization');
  //
  //         if (role.value === 'ROLE_ORGANIZATION_ADMIN') next('/legal_entity');
  //
  //         if (role.value === 'ROLE_USER') next('/cards');
  //     });
  // }

  if (
    (to.path === "/auth/login" || to.path === "/auth/register") &&
    store.isAuthenticated
  ) {
    next("/");
  }

  if (requireAuth) {
    if (!store.isAuthenticated) {
      next({
        path: "/auth/login",
      });
    } else {
      // // if (roles) {
      // //     checkRole();
      // // } else {
      // //     next();
      // // }
      next();
    }
  } else {
    next();
  }
});

export default router;
