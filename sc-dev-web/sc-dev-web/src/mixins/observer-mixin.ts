import { LitElement } from 'lit';
import { safeMixin, TConstructor } from '../shared/mixin.js';

type TObserver = {
  observerScope: {
    nodeState: {
      childList: boolean;
    };
    allNodeState: {
      childList: boolean;
      subtree: boolean;
    };
  };
  createMutationObserver(callback: MutationCallback): MutationObserver;
};

export const ObserverMxin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TObserver> & T => {
    class ObserverMxin extends superClass {
      observerScope = {
        nodeState: { childList: true },
        allNodeState: { childList: true, subtree: true },
      };
      createMutationObserver(callback: MutationCallback) {
        return new MutationObserver(callback);
      }
    }
    return ObserverMxin;
  }
);
