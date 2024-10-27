import i18next from '@/i18next';
import router from '@/router';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import './index.less';
const bootstrap = async () => {
  const app = createApp(App);
  i18next(app);
  app.use(router);

  const pinia = createPinia();
  app.use(pinia);

  app.mount('#app');
};

bootstrap();
