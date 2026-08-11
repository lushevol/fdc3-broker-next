import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import { FeaturesMixin } from './features/entry-mixin.js';
import { synchronizedScroll } from '../../../shared/synchronized-scroll.js';
import ScElement from '../../../shared/sc-element.js';
import { OverlappingMixin } from './overlapping-mixin.js';

export type TMixin = {
  observeBodyHeight(body?: Element): void;
  getVerticalScrollRatio(): number;
  observeVerticalScroller(scroller?: Element): void;
};

export const VerticalScrollerMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends FeaturesMixin(OverlappingMixin(superClass)) {
      bodyHeights = [-1, -1, -1];
      private _cleanVerScrollSync?: () => void;

      observeBodyHeight(body?: Element) {
        if (body) {
          this.bodyHeightObserver.observe(body);
        }
      }

      bodyHeightObserver = new ResizeObserver(entries => {
        const newHeights = [-1, -1, -1];
        for (const entry of entries) {
          const el = entry.target as HTMLDivElement;
          const position = el.getAttribute('position');
          if (position) {
            const height = entry.borderBoxSize[0].blockSize;
            newHeights[this.getPositionIndex(position)] = height;
          }
        }
        let canUpdate = false;
        newHeights.forEach((height, index) => {
          if (height !== -1 && height !== this.bodyHeights[index]) {
            this.bodyHeights[index] = height;
            canUpdate = true;
          }
        });
        if (canUpdate) {
          this.requestUpdate();
        }
      });

      verticalScroller = new Set<Element>();
      observeVerticalScroller(scroller?: Element) {
        if (this.verticalScroller.size === 2) {
          return;
        }
        if (scroller) {
          this._cleanVerScrollSync?.();
          this.verticalScroller.add(scroller);
          if (this.verticalScroller.size === 2) {
            this._cleanVerScrollSync = synchronizedScroll([...this.verticalScroller], () => {
              this.hideEditingPanelWhenScroll();
              this.hideOverlappingPanelWhenScroll();
            });
          }
        }
      }

      getVerticalScrollRatio() {
        const clientHeight =
          this.shadowRoot?.querySelector<HTMLElement>('.sc-data-grid-body-area-viewport')
            ?.clientHeight ?? 0;
        const bodyHeight = Math.max(...this.bodyHeights.filter(height => height !== -1)) >> 0;
        return bodyHeight > clientHeight ? bodyHeight / clientHeight || 0 : 0;
      }
    }
    return Mixin;
  }
);
