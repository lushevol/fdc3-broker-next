import dayjs from 'dayjs/esm/index.js';

export const noop = () => {};

export const EmptyComponent = () => null;

export const CodeReg = /\{\{((?:.|\r?\n)+?)\}\}/; 
export const ParamReg = /\{((?:.|\r?\n)+?)\}/g;

export const Size = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export const CompactSize = ['xxs', 'xs', 'sm', 'md', 'lg'];

export const FormSize = ['sm', 'md', 'lg'];

export const isEmpty = (value: any) => {
  const noValue =
    typeof value === 'undefined' ||
    value === null ||
    value.toString().trim().length === 0;
  return noValue;
};

export const isTableInvalid = (template: any, value: any) => {
  let tableInvalid = false;
  const { conf, required } = template || {};
  const tableConfig = conf || [];
  const requiredColumns = tableConfig.filter((col: any) => col.config?.required);
  if (requiredColumns.length === 0) {
    const isTableDataEmpty = value?.length ?
      value.every((row: any) => {
        const values = Object.values(row || {});
        return values.length === 0 || values.every(v => !hasValue(v));
      }) : true;
    tableInvalid = required ? isTableDataEmpty : false;
  } else {
    tableInvalid = requiredColumns.some((col: any) => {
      const colData = value?.map((row: any) => row[col.property]) || [];
        return !colData.length || colData.some((cell: any) => !hasValue(cell));
      });
  }
  return tableInvalid;
};

export const hasValue = (value: any, component?: any) => {
  if (component?.type === 'table') {
    return !isTableInvalid(component.template, value);
  }
  const noValue =
    Array.isArray(value) ? !value.length : (
      typeof value === 'undefined' ||
      value === null ||
      (typeof value === 'boolean' && !value) ||
      (typeof value === 'object' && !Object.keys(value).length) ||
      value.toString().length === 0);

  return !noValue;
};

export const getParent = (target: HTMLInputElement, className: string) => {
  let parent: any = target;
  let ele: any = target;
  while (ele.parentNode) {
    if (ele.parentNode && ele.parentNode?.className?.includes(className)) {
      parent = ele.parentNode;
      break;
    } else {
      ele = ele.parentNode;
    }
  }
  return parent;
};

export function cloneProperties(target: any, obj: object, onlyCopyOwnedProperties?: boolean) {
  for (const [key, value] of Object.entries(obj)) {
    if (onlyCopyOwnedProperties && !Reflect.has(target, key)) {
      continue;
    }

    Reflect.set(target, key, value);
  }
}

export function isValidEmail(email: string, isInternal: boolean) {
  const commonReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; 
  const internalReg = 
    /^[\&a-zA-Z0-9_.+-]+&?@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(sc|standardchartered)\.com$/; 
  const reg = isInternal ? internalReg : commonReg;
  return reg.test(email);
}

export function isValidURL(url: string) {
  const reg = /^(((http|https|ftp):\/\/)|mailto:)+/; 
  return reg.test(url);
}

export function isValidFormat(value: string, format: string) {
  const reg = new RegExp(format);
  return reg.test(value);
}

export function generateDynamicDate(days: number, type: string, rule: string) {
  let date: any;
  if ((!days && days !== 0) || !type || !rule) {
    return null;
  }

  if (rule === 'add') {
    // @ts-ignore
    date = dayjs().add(days, type);
  } else {
    // @ts-ignore
    date = dayjs().subtract(days, type);
  }

  return date ? new Date(date) : null;
}