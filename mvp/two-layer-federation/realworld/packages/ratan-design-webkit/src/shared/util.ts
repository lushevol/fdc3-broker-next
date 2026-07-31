import { getTag } from './isEuqalWith/getTag.js';
import { objectTag, stringTag } from './isEuqalWith/tags.js';
import { HTMLTemplateResult } from 'lit';

export interface PartNameInfo {
  readonly [name: string]: string | boolean | number;
}

export const partNameMap = (partNameInfo: PartNameInfo) => {
  return Object.keys(partNameInfo)
    .filter((key) => partNameInfo[key])
    .join(' ');
};

export enum DIRECTION {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export enum LABEL_POSITION {
  left = 'left',
  right = 'right',
  top = 'top',
  topRight = 'top-right',
  bottom = 'bottom',
}

export enum LINK_TARGET {
  '_blank' = '_blank',
  '_parent' = '_parent',
  '_self' = '_self',
  '_top' = '_top',
}

export enum ICON_SIZE {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

export enum ICON_ALIGN {
  left = 'left',
  right = 'right',
}

export enum IMAGE_ALIGN {
  left = 'left',
  right = 'right',
  background = 'background',
}

export enum TEXT_SIZE {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

export enum TEXT_ALIGN {
  left = 'left',
  center = 'center',
  right = 'right',
  justify = 'justify',
}

export enum VERTICAL_ALIGN {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

export enum COLOR {
  blue = 'blue',
  'dark-blue' = 'dark-blue',
  amber = 'amber',
  green = 'green',
  grey = 'grey',
  red = 'red',
  transparent = 'transparent',
}

export enum POSITION {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
}

export enum LABEL_ALIGN {
  left = 'left',
  right = 'right',
}

export interface FONT_SIZE_TYPE {
  [key: string]: string;
}

export enum UTIL_SIZE_TYPE {
  'xxs' = 'xxs',
  'xs' = 'xs',
  'sm' = 'sm',
  'md' = 'md',
  'lg' = 'lg',
}

export const FontSizeMapping: FONT_SIZE_TYPE = {
  xxs: '0.75rem',
  xs: '0.875rem',
  sm: '1rem',
  md: '1.125rem',
  lg: '1.25rem',
  xl: '1.5rem',
  xxl: '2rem',
};

export const HeadingSizeMapping: FONT_SIZE_TYPE = {
  xxs: '0.75rem',
  xs: '0.875rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '2.5rem',
};

export enum SIZE {
  none = 'none',
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

export enum FLOAT {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum COMPACT_SIZE {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export enum PAGINATION_SIZE {
  sm = 'sm',
  md = 'md',
}

export enum BADGE_TYPE {
  number = 'number',
  text = 'text',
  dot = 'dot',
}

export enum MODE {
  'default' = 'default',
  'icon' = 'icon',
}

export enum TAG_TYPE {
  disabled = 'disabled',
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  error = 'error',
  transparent = 'transparent',
  blue = 'blue',
  'dark-blue' = 'dark-blue',
  red = 'red',
  amber = 'amber',
  green = 'green',
  grey = 'grey',
  black = 'black',
  white = 'white',
  greydash = 'grey-dash',
}

export interface SIZE_TYPE {
  [key: string]: number;
}

export interface OPTION_TYPE {
  label: string;
  value: any;
}

export const SizeMapping: SIZE_TYPE = {
  none: 0,
  xxs: 0.25,
  xs: 0.5,
  sm: 1,
  md: 1.5,
  lg: 3,
};

export const debounce = (fn: (...args: any) => any, wait: number) => {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    // @ts-ignore
    timeout = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, wait);
  };
};

export enum BUTTON_TYPE {
  secondary = 'secondary',
  default = 'primary',
  text = 'text',
  link = 'link',
}

export enum BUTTON_STATE {
  default = 'default',
  error = 'error',
  alert = 'alert',
  success = 'success',
}

export interface TAG_ATTRIBUTES {
  type: TAG_TYPE;
  iconName: string;
  content: string;
}

export interface CARD_SUPPLEMENTARY_ATTRIBUTES {
  iconName: string;
  details: string;
}

export function throttle(fn: (...args: any) => any, context: any, wait: number) {
  let inThrottle: boolean;
  return function (...args: any) {
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}

export function isNotEmptyish<T>(val: T): val is NonNullable<T> {
  return (
    val !== undefined &&
    val !== null &&
    !Number.isNaN(val) &&
    !(getTag(val) === stringTag && !`${val}`.trim()) &&
    !(getTag(val) === objectTag && !Object.keys(val).length) &&
    !(Array.isArray(val) && !val.length)
  );
}

export function isEmptyish<T>(val: T) {
  return !isNotEmptyish(val);
}

export function closest(
  el: Element,
  selector: string | ((target: Element) => boolean) = 'body',
  deep = true,
  max = 999,
): Element | undefined {
  let e: Element & { host?: any } = el;
  let count = 0;
  do {
    count++;
    if (e.parentNode === null && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && deep) {
      e = e.host;
    } else {
      e = e.parentNode as Element;
    }

    if (!e) {
      return;
    }

    // test node
    if (
      (typeof selector === 'string' && e?.matches instanceof Function && e.matches(selector)) ||
      (e && selector instanceof Function && selector(e))
    ) {
      return e;
    }
  } while (count < max);
}

export const handleCustomEvent = (e: Event) => {
  console.log(e);
  console.log((e as CustomEvent).detail);
};
const CATCHABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
export type SVGResult =
  | HTMLTemplateResult
  | SVGSVGElement
  | typeof RETRYABLE_ERROR
  | typeof CATCHABLE_ERROR;
export const iconCache = new Map<string, Promise<SVGResult>>();

export const libraryCache = new Map();

export function sizeUp(size: keyof typeof SIZE): SIZE {
  const sizes = Object.values(SIZE);
  const index = sizes.indexOf(SIZE[size]);
  return index > -1 ? sizes[index + 1] : SIZE[size];
}
export function sizeDown(size: keyof typeof SIZE): SIZE {
  const sizes = Object.values(SIZE);
  const index = sizes.indexOf(SIZE[size]);
  return index > 0 ? sizes[index - 1] : SIZE[size];
}

export function isMobileDevice() {
  return /mobile|android|iphone|ipad|ipod|blackberry|iemobile|windows phone|phone|webos/i.test(
    navigator.userAgent,
  );
}
export function isTabletDevice() {
  return /tablet|ipad/i.test(navigator.userAgent);
}
export function detectDeviceType() {
  return isMobileDevice() ? 'mobile' : isTabletDevice() ? 'tablet' : 'desktop';
}
