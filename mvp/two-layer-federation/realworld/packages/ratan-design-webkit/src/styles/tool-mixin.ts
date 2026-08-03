import { LitElement } from 'lit';
import { safeMixin, TConstructor } from '../shared/mixin.js';

type TTool = {
  stripExpressionMarkers(html: string): string;
  nonExistence: '-1';
  animationFrame: {
    run(fn: any): number;
    cancel(number: number): void;
  };
  timeout: {
    run(fn: any, delay: number): NodeJS.Timeout;
    cancel(number: NodeJS.Timeout): void;
  };
  generateId(): string;
  createArray(length: number, defaultValue?: any): any[];
  clamp(v: number, min: number, max: number): number;
  isClamp(v: number, min: number, max: number): boolean;
  seekParentElement<T extends Element>(source: Element, targetName: string | string[]): T;
  isAllUpdateComplete<T extends LitElement>(el: T): Promise<unknown>;
  noop(...args: any[]): any;
  removeAllNodes(el: Element): void;
};
export const ToolMixin = safeMixin(
  <T extends TConstructor<LitElement>>(superClass: T): TConstructor<TTool> & T => {
    class ToolMixin extends superClass {
      stripExpressionMarkers(html: string) {
        return html.replace(
          /<!--\?lit\$[0-9]+\$-->|<!--\??-->|<!--StartFragment-->|<!--EndFragment-->|lit\$[0-9]+\$/g,
          '',
        );
      }
      nonExistence = '-1' as const;
      animationFrame = {
        run(fn: any) {
          return window.requestAnimationFrame(fn);
        },
        cancel(number: number) {
          window.cancelAnimationFrame(number);
        },
      };
      timeout = {
        run(fn: any, delay: number) {
          return setTimeout(fn, delay);
        },
        cancel(number: NodeJS.Timeout) {
          clearTimeout(number);
        },
      };
      generateId() {
        return Math.random().toString(16).slice(2);
      }
      createArray(length: number, defaultValue: any = 1) {
        return Array(length).fill(defaultValue);
      }
      clamp(v: number, min: number, max: number) {
        return Math.min(max, Math.max(min, v));
      }
      isClamp(v: number, min: number, max: number) {
        return v >= min && v <= max;
      }
      seekParentElement<T extends Element>(source: Element, targetName: string | string[]): T {
        const predicated = typeof targetName === 'string' ? [targetName] : targetName;
        let target = source;
        while (target) {
          if (predicated.includes(target.tagName.toLowerCase())) {
            break;
          }
          target = target.parentElement as Element;
        }
        return target as T;
      }
      isAllUpdateComplete<T extends LitElement>(el: T) {
        return new Promise((res) => {
          const fn = (_el: T) => {
            _el.updateComplete.then((updateDone) => {
              if (updateDone) {
                res(true);
              } else {
                fn(_el);
              }
            });
          };
          if (el.updateComplete instanceof Promise) {
            fn(el);
          } else {
            res(true);
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      noop(...args: any[]): any {
        // console.log('You are calling default function come from Lidash-mixin');
      }
      removeAllNodes(el: Element) {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      }
    }
    return ToolMixin;
  },
);
