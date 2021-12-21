import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// import { useStore } from 'vuex';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import Lock from '../views/Lock.vue';
import Permission from '../views/Permission.vue';
import getAddressFromStorage from '@/utils/getAddressFromStorage';
import store from '../store';

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
  const address = await getAddressFromStorage();
  if (address === 'expired' && to.name !== 'Lock') {
    return next({ path: '/lock', query: to.query });
  }

  store.commit('SET_WALLET_ADDRESS', address);

  if (to.name === 'StartView') {
    if (address) {
      return next('/home');
    }
    return next();
  } else {
    if (!address) {
      return next({ path: '/', query: to.query });
    }
    return next();
  }
});

export default router;
