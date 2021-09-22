import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import StartView from '../views/StartView.vue';
import ImportWalletView from '../views/ImportWalletView.vue';
import CreateWalletView from '../views/CreateWalletView.vue';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'StartView', component: StartView },
  { path: '/import', name: 'ImportView', component: ImportWalletView },
  { path: '/create', component: CreateWalletView },
  { path: '/home', component: Home },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
