import * as template_zh_cn from '../../locales/zh-CN.js';
// @ts-ignore
import { setLocale as webkitSetLocale, getLocale as webkitGetLocale } from '@scdevkit/webkit/localization.js';

type Messages = { templates: {[key: string]: string} }; 

const localizedTemplates: {[key: string]: Messages} = {
  'zh-CN': template_zh_cn,
};

export const msg = (defaultValue: string, obj: {id: string}) => {
  const messages = localizedTemplates[webkitGetLocale() as string];
  return messages?.templates?.[obj.id] || defaultValue;
};

export const getLocale = webkitGetLocale;

export const setLocale = webkitSetLocale;