import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import Permission from '../views/Permission.vue';
import getAddressFromStorage from '@/utils/getAddressFromStorage';
// import { getStorageItem } from '@/utils/extension';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'StartView',
    component: StartView,
    beforeEnter: async (to, from, next) => {
      const address = await getAddressFromStorage();
      if (address) {
        return next({ name: 'Home' });
      }
      return next();
    },
  },
  // { path: '/create', component: CreateWalletView },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const address = await getAddressFromStorage();
      if (address) {
        return next();
      }
      return next({ name: 'StartView' });
    },
  },
  {
    path: '/permission',
    name: 'Permission',
    component: Permission,
    beforeEnter: async (to, from, next) => {
      const address = await getAddressFromStorage();
      if (address) {
        return next();
      }
      return next({ name: 'StartView' });
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
