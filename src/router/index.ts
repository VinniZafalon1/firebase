import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/welcome' },
  { path: '/login', component: () => import('../views/LoginPage.vue'), meta: { guestOnly: true } },
  { path: '/register', component: () => import('../views/RegisterPage.vue'), meta: { guestOnly: true } },
  { path: '/reset-password', component: () => import('../views/ResetPasswordPage.vue'), meta: { guestOnly: true } },
  { path: '/welcome', component: () => import('../views/WelcomePage.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('../views/ProfilePage.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/welcome' },
];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

router.beforeEach(async (to) => {
  const authState = useAuth();
  await authState.waitUntilReady();
  if (to.meta.requiresAuth && !authState.user.value) return '/login';
  if (to.meta.guestOnly && authState.user.value) return '/welcome';
  return true;
});

export default router;
