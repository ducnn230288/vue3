import { EStatusState } from '@/enums';
import { KEY_USER, LANGUAGE, LIST_LANGUAGE } from '@/utils';
import enUS from 'ant-design-vue/lib/locale/en_US';
import jaJP from 'ant-design-vue/lib/locale/ja_JP';
import viVN from 'ant-design-vue/lib/locale/vi_VN';
import dayjs from 'dayjs';
import { enLocale, jaLocale, viLocale } from './locale';
import type { GlobalState } from './reducer';

/**
 * Represents the global name for authentication.
 */
export const nameGlobal = 'Auth';
/**
 * Represents the global state of the application.
 */
export interface StateGlobal extends GlobalState {
  language?: string;
  locale?: typeof viVN | typeof enUS | typeof jaJP;
  localeDate?: typeof enLocale | typeof viLocale;
  isCollapseMenu?: boolean;
}

/**
 * Checks the language and sets the locale and localeDate accordingly.
 * @param language - The language to be checked.
 * @returns An object containing the language, locale, and localeDate.
 */
export const checkLanguage = (language: string) => {
  let locale;
  let localeDate;
  switch (language) {
    case 'en':
      locale = enUS;
      localeDate = enLocale;
      break;
    case 'vi':
      locale = viVN;
      localeDate = viLocale;
      break;
    case 'ja':
      locale = jaJP;
      localeDate = jaLocale;
      break;
  }
  dayjs.locale(language);
  localStorage.setItem('i18nextLng', language);
  document.querySelector('html')?.setAttribute('lang', language);
  return { language, locale, localeDate };
};

/**
 * Determines the language based on the current location hash.
 * If the language is found in the list of supported languages, it is returned.
 * Otherwise, the default language is returned.
 *
 * @returns The determined language.
 */
export const lang = LIST_LANGUAGE.indexOf(location.hash.split('/')[1]) > -1 ? location.hash.split('/')[1] : LANGUAGE;

/**
 * Represents the initial state for the global module.
 */
export const initialStateGlobal: StateGlobal = {
  user: JSON.parse(localStorage.getItem(KEY_USER) ?? '{}'),
  isLoading: false,
  status: EStatusState.idle,
  // ...checkLanguage(lang ?? 'vi'),
};
