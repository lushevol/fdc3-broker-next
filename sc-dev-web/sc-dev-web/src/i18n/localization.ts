import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from '../../locale-module/locale-codes.js';
import * as template_zh_cn from '../../locales/zh-CN.js';

const localizedTemplates = new Map([
  ['zh-CN', template_zh_cn],
]);

export const locales = {
  en: 'English',
  'zh-CN': '中文 (简体)',
};

export const { getLocale, setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  // @ts-ignore
  loadLocale: async (locale: string) => localizedTemplates.get(locale),
});
