import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import { FeaturesMixin } from './features/entry-mixin.js';
import { synchronizedScroll } from '../../../shared/synchronized-scroll.js';
import { EPosition, TPosition } from '../types/utils.js';
import ScElement from '../../../shared/sc-element.js';
import { OverlappingMixin } from './overlapping-mixin.js';
import { TableStateMixin } from './table-state-mixin.js';

export type TMixin = {
  observeHorizontalScroller(position: TPosition): (scroller?: Element) => void;
  resyncHorizontalScroll(): void;
  getHorizontalScrollRatio(): number;
};

export const HorizontalScrollerMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends FeaturesMixin(OverlappingMixin(TableStateMixin(superClass))) {
      horizontalScroller = new Set<Element>();
      private _cleanHorScrollSync?: () => void;

      observeHorizontalScroller(position: TPosition) {
        return (scroller?: Element) => {
          if (
            position !== EPosition.center ||
            this.horizontalScroller.size === 5
          ) {
            return;
          }
          if (scroller) {
            this._cleanHorScrollSync?.();
            this.horizontalScroller.add(scroller);
            if (this.horizontalScroller.size === 5) {
              this._cleanHorScrollSync = synchronizedScroll([...this.horizontalScroller], scrollInfo => {
                if (scrollInfo.left) {
                  this.hideEditingPanelWhenScroll();
                  this.hideOverlappingPanelWhenScroll();
                }
              });
            }
          }
        };
      }
      
      resyncHorizontalScroll() {
        window.requestAnimationFrame(() => {
          const el = Array.from(this.horizontalScroller)[0];
          // force sync scroll
          el?.dispatchEvent(new Event('scroll'));
        });
      }

      getHorizontalScrollRatio() {
        const clientWidth =
          this.shadowRoot?.querySelector<HTMLElement>('.sc-data-grid-tbody.sc-data-grid-tbody-center')
            ?.clientWidth ?? 0;
        const bodyWidth = this.table.getCenterTotalSize() >> 0;
        return bodyWidth > clientWidth ? bodyWidth / clientWidth || 0 : 0;
      }
    }
    return Mixin;
  }
);
