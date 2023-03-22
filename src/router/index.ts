import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// import { useStore } from 'vuex';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import Lock from '../views/Lock.vue';
import Permission from '../views/Permission.vue';
import store from '../store';
import vault from '@/utils/vault';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/permission',
    name: 'Permission',
    component: Permission,
  },
  {
    path: '/lock',
    name: 'Lock',
    component: Lock,
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
  history: createWebHashHistory('#'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const vaultStatus = await vault.getStatus();

  if (vaultStatus === 'LOCK' && to.name !== 'Lock') {
    return next({ path: '/lock', query: to.query });
  }
  if (vaultStatus === 'EMPTY' && to.name !== 'StartView') {
    return next({ path: '/', query: to.query });
  }
  let address = await vault.getAddress();

  if (!address) {
    await vault.init();
  }

  address = await vault.getAddress();

  store.commit('SET_WALLET_ADDRESS', address);

  if (to.name === 'StartView' && address) {
    return next('/home');
  } else {
    return next();
  }
});

export default router;
