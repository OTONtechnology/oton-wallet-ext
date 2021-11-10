import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// import { useStore } from 'vuex';
import StartView from '../views/StartView.vue';
import Home from '../views/Home.vue';
import Permission from '../views/Permission.vue';
import getAddressFromStorage from '@/utils/getAddressFromStorage';

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

router.beforeEach(async (to, from, next) => {
  if (to.name === 'StartView') {
    const address = await getAddressFromStorage();
    if (address) {
      return next('/home');
    }
    return next();
  } else {
    const address = await getAddressFromStorage();
    if (!address) {
      return next('/');
    }
    return next();
    // const address = await getAddressFromStorage();
    // console.log(address);
    // if (address) {
    //   return next();
    // }
  }
});

export default router;
