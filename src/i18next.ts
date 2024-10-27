import type { App } from 'vue';
import i18next from 'i18next';
import I18NextVue from 'i18next-vue';
import i18nextHttpBackend from 'i18next-http-backend';

const createI18nOptions = () => {
  const fallbackLng = localStorage.getItem('i18nextLng');

  if (!fallbackLng) {
    localStorage.setItem('i18nextLng', 'en');
    document.querySelector('html')?.setAttribute('lang', 'en');
  }

  return {
    ns: 'locale',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: fallbackLng ?? 'en',
    interpolation: {
      escapeValue: false,
    },
  };
};

const createI18nInstance = () => {
  const options = createI18nOptions();
  return i18next.use(i18nextHttpBackend).init(options);
};

export const i18n = createI18nInstance();

export default function (app: App) {
  app.use(I18NextVue, { i18next });
  return app;
}
