import { createI18n } from 'vue-i18n';

import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';
import tr from './i18n/tr';
import { customPlureRule } from '@/hooks/tc';

export const allowedLangs = [
  'ru',
  'en',
  'de',
  'tr',
];

const defaultDatesFormat = {
  loopShortFirst: {
    month: 'short',
    day: 'numeric',
  },
  loopShortSecond: {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  commentDate: {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  },
};

const datetimeFormats: { [key: string]: typeof defaultDatesFormat } = {};

allowedLangs.forEach((l) => {
  datetimeFormats[l] = defaultDatesFormat;
});

const messages: {
  [key: string]: {
    [key: string]: any;
  }
} = {
  ru,
  en,
  de,
  tr,
};
const i18n = createI18n({
  datetimeFormats,
  legacy: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  locale: 'en', // установка локализации по умолчанию
  fallbackLocale: 'en',
  messages, // установка сообщений локализаций
  // mode: 'composition',
  pluralRules: {
    ru: customPlureRule,
  },
});

export const getLocale = (): string => {
  const locale = i18n.global.locale as any;

  if (typeof locale === 'object' && locale.value) {
    return locale.value;
  }

  return locale;
};

export default i18n;
