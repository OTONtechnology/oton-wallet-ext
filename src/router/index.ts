import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import getAddress from '@/utils/getAddress';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'StartView',
    component: StartView,
    beforeEnter: async (to, from, next) => {
      const address = await getAddress();
      if (address) {
        return next('Home');
      }
      return next();
    },
  },
  // { path: '/create', component: CreateWalletView },
  { path: '/home', name: 'Home', component: Home },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
