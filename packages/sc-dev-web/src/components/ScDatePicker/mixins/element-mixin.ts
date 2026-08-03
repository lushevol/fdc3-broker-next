import type { LitConstructor } from '../typings.js';
import type { ElementMixinProperties, MixinReturnType } from './typings.js';
import { CUSTOM_EVENTS_TYPE } from '../../../shared/sc-custom-events.js';
import type { ScEventInit } from '../../../shared/sc-element.js';

export const ElementMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, ElementMixinProperties> => {
  class ElementMixinClass extends SuperClass {

    public emit<T extends string & keyof CUSTOM_EVENTS_TYPE>(name: T, options?: ScEventInit<T> | undefined): void {
      const event = new CustomEvent(name, {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {},
        ...options,
      });
  
      this.dispatchEvent(event);
      return event as any;
    }

    public query<T extends HTMLElement>(selector: string): T | null {
      return this.root.querySelector(selector) as T;
    }

    public queryAll<T extends HTMLElement>(selector: string): T[] {
      return Array.from(
        this.root.querySelectorAll(selector) ?? []
      );
    }

    public get root(): ShadowRoot {
      return this.shadowRoot as ShadowRoot;
    }
  }

  return ElementMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    ElementMixinProperties
  >;
};
