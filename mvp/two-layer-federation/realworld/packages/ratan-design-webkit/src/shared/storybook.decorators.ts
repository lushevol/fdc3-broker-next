import { getTag } from './isEuqalWith/getTag.js';
import type { Conditional } from '@storybook/types';

function getTypeForObject(input: any) {
  const type = getTag(input).slice(8, -1).toLowerCase();
  const ignoreType = ['undefined', 'null'];
  return ignoreType.includes(type) ? 'object' : type;
}
function getDefaultValueForObject(input: any) {
  let res = '';
  try {
    res = JSON.stringify(input);
  } catch (e) {}
  return res;
}
function camel2hyphen(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
type TArgBase = {
  name: string;
  description: string;
  if?: Conditional;
};

// type TArgTypes =
//   | 'object'
//   | 'boolean'
//   | 'check'
//   | 'inline-check'
//   | 'radio'
//   | 'inline-radio'
//   | 'select'
//   | 'multi-select'
//   | 'number'
//   | 'range'
//   | 'color'
//   | 'date'
//   | 'text';

type TArgMaps<T = unknown> = {
  number: TArgBase & {
    defaultValue: number;
  };
  boolean: TArgBase & {
    defaultValue: boolean;
  };
  'inline-radio': TArgBase & {
    options: T[];
    defaultValue: T;
  };
  object: TArgBase & {
    defaultValue?: any;
  };
};

type GetFnArgs<T extends keyof TArgMaps> = T extends keyof TArgMaps ? TArgMaps[T] : any;

type TypeFns = {
  [K in keyof TArgMaps]?: (options: GetFnArgs<K>) => any;
};

// 'current-page': {
//   control: 'number',
//   description: 'The current selected page.',
//   table: {
//     type: { summary: 'number' },
//     defaultValue: { summary: 1 },
//     category: 'Attributes',
//   },
// },
const argTypeFns: TypeFns = {
  number(options) {
    return {
      name: options.name,
      control: 'number',
      description: options.description,
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: options.defaultValue },
        category: 'Attributes',
      },
      updateElement(element: HTMLElement, key: string, attiOrPropName: string, args: any) {
        element.setAttribute(attiOrPropName, args[key]);
      },
      if: options.if,
    };
  },
  boolean(options) {
    return {
      name: options.name,
      control: 'boolean',
      description: options.description,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: options.defaultValue },
        category: 'Attributes',
      },
      updateElement(element: HTMLElement, key: string, attiOrPropName: string, args: any) {
        element.toggleAttribute(attiOrPropName, args[key]);
      },
      if: options.if,
    };
  },
  object(options) {
    return {
      control: 'object',
      description: options.description,
      table: {
        type: { summary: getTypeForObject(options.defaultValue) },
        defaultValue: {
          summary: options.defaultValue,
          detail: getDefaultValueForObject(options.defaultValue),
        },
        category: 'Properties',
      },
      updateElement(element: HTMLElement, key: string, attiOrPropName: string, args: any) {
        (element as any)[attiOrPropName] = args[key];
      },
      if: options.if,
    };
  },
  'inline-radio'(options) {
    return {
      name: options.name,
      control: 'inline-radio',
      options: options.options,
      description: options.description,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: options.defaultValue },
        category: 'Attributes',
      },
      updateElement(element: HTMLElement, key: string, attiOrPropName: string, args: any) {
        element.setAttribute(attiOrPropName, args[key]);
      },
      if: options.if,
    };
  },
};
export function finalizeProperty(argTypes: Record<string, { control: string; name: string }>) {
  const res = {};
  for (const key in argTypes) {
    const arg = argTypes[key];
    if (arg.control === 'object') {
      res;
    }
  }
}

export const setPropertyAutomatically = (
  element: HTMLElement,
  args: any,
  argTypes: Record<
    string,
    {
      control: string;
      name: string;
      updateElement: (element: HTMLElement, key: string, attiOrPropName: string, args: any) => void;
    }
  >,
) => {
  for (const key in argTypes) {
    const argType = argTypes[key];
    argType.updateElement(element, key, argType.name || key, args);
  }
};

export const getDefaultValues = (
  argTypes: Record<
    string,
    {
      table?: {
        defaultValue?: {
          summary?: any;
        };
      };
    }
  >,
) => {
  return Object.entries(argTypes).reduce((res, [key, item]) => {
    if (typeof item?.table?.defaultValue?.summary !== 'undefined') {
      return {
        ...res,
        [key]: item?.table?.defaultValue?.summary,
      };
    }
    return res;
  }, {});
};

export function storybook<K, T extends keyof TArgMaps<K>>(
  type: T,
  options: Omit<TArgMaps<K>[T], 'name'>,
) {
  return (target: NonNullable<unknown>, key: string) => {
    const klass = target.constructor as any;
    if (!klass.argTypes) {
      klass.argTypes = {};
    }

    // eslint-disable-next-line
    klass.argTypes[key] = argTypeFns[type]!({
      name: camel2hyphen(key),
      ...(options as any),
    });
  };
}
