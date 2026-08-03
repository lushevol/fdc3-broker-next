import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import ScElement from '../../../shared/sc-element.js';

export type TMixin = {
  refPlaceholder(): void;
  afterFrameUpdate(): Promise<unknown>
};

export const ToolkitMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends superClass {
      refPlaceholder() {
        // refPlaceholder
      }
      
      afterFrameUpdate() {
        return new Promise(res => {
          window.requestAnimationFrame(() => {
            window.requestIdleCallback(() => {
              res(true);
            });
          });
        });
      }
    }
    return Mixin;
  }
);
