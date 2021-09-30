import { createApp } from 'vue';
import VueFinalModal from 'vue-final-modal';
import axios from 'axios';
import VueAxios from 'vue-axios';
import i18n from './i18n';
import App from './App.vue';
import router from './router';
import store from './store';
import BaseCheckbox from './components/BaseCheckbox.vue';

const app = createApp(App);

app.use(store)
  .use(i18n)
  .use(router)
  .use(VueFinalModal())
  .use(VueAxios, axios);

app.component('BaseCheckbox', BaseCheckbox);

app.mount('#app');
