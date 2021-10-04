import { createApp } from 'vue';
import VueFinalModal from 'vue-final-modal';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Toast from 'vue-toastification';
import i18n from './i18n';
import App from './App.vue';
import router from './router';
import store from './store';
import BaseCheckbox from './components/BaseCheckbox.vue';
import Tr from './components/Tr.vue';

const app = createApp(App);

app.use(store)
  .use(i18n)
  .use(router)
  .use(VueFinalModal())
  .use(VueAxios, axios)
  .use(Toast, {
    transition: 'Vue-Toastification__fade',
    maxToasts: 10,
    newestOnTop: true,
    hideProgressBar: true,
    closeButton: false,
  });

app.component('BaseCheckbox', BaseCheckbox);
app.component('Tr', Tr);

app.mount('#app');
