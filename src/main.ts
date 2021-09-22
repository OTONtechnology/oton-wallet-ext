import { createApp } from 'vue';
import VueFinalModal from 'vue-final-modal';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import BaseCheckbox from './components/BaseCheckbox.vue';

const app = createApp(App);

app.use(store).use(router).use(VueFinalModal()).use(VueAxios, axios);

app.component('BaseCheckbox', BaseCheckbox);

app.mount('#app');
