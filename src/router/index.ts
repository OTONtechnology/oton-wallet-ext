import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import getAddress from '@/utils/getAddress';
import { getStorageItem } from '@/utils/extension';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'StartView',
    component: StartView,
    beforeEnter: async (to, from, next) => {
      const address = await getStorageItem('addr');
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
      const address = await getStorageItem('addr');
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
