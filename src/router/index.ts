import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import Permission from '../views/Permission.vue';

// import { getStorageItem } from '@/utils/extension';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/permission',
    name: 'Permission',
    component: Permission,
  },
  {
    path: '/',
    name: 'StartView',
    component: StartView,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
