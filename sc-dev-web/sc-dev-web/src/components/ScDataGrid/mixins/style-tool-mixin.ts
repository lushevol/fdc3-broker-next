import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../shared/mixin.js';

type TMixin = {
  makeClassName(name: string): string;
  cleanClassName(name: string): string;
};

export const StyleToolMixin = (classNamePrefix: string) => {
  return safeMixin(
    <T extends TConstructor<LitElement>>(
      superClass: T
    ): TConstructor<TMixin> & T => {
      class Mixin extends superClass {
        makeClassName(name: string) {
          return `${classNamePrefix}${name}`;
        }
        
        cleanClassName(str: string): string {
          return str.replace(/[^a-z0-9\-_]/gi, '-');
        }
      }
      return Mixin;
    }
  );
};
