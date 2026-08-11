import { Condition } from '../../../shared/conditions.js';
import { parse, evaluate } from '../../../shared/expressionEval.js';
import type { FORM_DATA_TYPE } from '../../types.js';

export const evaluateCondition = (condition: string, data = {}) => {
  if (!condition) return true;
  const node = parse(condition);
  const result = evaluate(node, { data });
  return result;
};

export const directEvaluateCondition = (condition: string, data = {}) => {
  if (!condition) return true;
  const node = parse(condition);
  const result = evaluate(node, data);
  return result;
};

const expressionRules = ['===', '!==', '>', '>=', '<', '<='];

const isContains = (data: any[], value: string | any[]) => {
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(value)) {
      return !value.some(v => !data.includes(v));
    }
    return data[0].includes(value);
  }
  return !!(data && data.includes(value));
};

const isNotContains = (data: any[], value: string) => {
  if (Array.isArray(data) && data.length > 0) {
    if (Array.isArray(value)) {
      return !data.some(d => value.includes(d));
    }
    return !data[0].includes(value);
  }
  return data ? !data.includes(value) : true;
};

const isEmpty = (data: any[]) => {
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  return !data;
};

const isNotEmpty = (data: unknown) => {
  if (Array.isArray(data)) {
    return data.length !== 0;
  }
  return !!data;
};

const conditionLookup = {
  isContains,
  isNotContains,
  isEmpty,
  isNotEmpty,
};

export const generateConditions = (conditions: Condition[], data: FORM_DATA_TYPE[] = []) => {
  if (!conditions || conditions.length <= 0) return '';
  let str = '';
  conditions.some((c: Condition, i) => {
    const { component, condition, rule, value } = c;
    if (!component) {
      str = '';
      return true;
    }
    if (i > 0) {
      str += condition || '&&';
    }
    if (c?.type && ['number-input'].includes(c.type)) {
      c.value = Number(value);
    }
    if (expressionRules.includes(rule)) {
      const selectedValue = data.find(d => d.id === component)?.value;
      if (Array.isArray(value)) {
        // @ts-ignore
        str += `'${(selectedValue || []).sort()}'${rule ||
        // @ts-ignore
          ''}'${value?.sort() || ''}'`;
      } else if (typeof value === 'string') {
        str += `'${selectedValue}'${rule ||
          ''}'${value || ''}'`;
      } else if (typeof value === 'number') {
        str += `${selectedValue}${rule ||
          ''}${value || ''}`;
      }
      else if (typeof value === 'number') {
        str += `${selectedValue}${rule ||
          ''}${value || ''}`;
      }
    } else {
      // @ts-ignore
      const inputValue = data.find(d => d.id === component)?.value;
      // @ts-ignore
      const conditionFn: (inputValue: any, value: any) => string = conditionLookup[rule];
      str += conditionFn(inputValue, value);
    }
  });
  return str;
};
