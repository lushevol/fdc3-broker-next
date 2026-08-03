import { LitElement } from 'lit';
import { getAncestorsOf } from '../shared/ancestor.js';
import { safeMixin, TConstructor } from '../shared/mixin.js';
import { PopupMixin } from './popup-mixin.js';

type TMixin = {
  /** Retrieve a list of scrollable parent elements including open shadowroot host & slot */
  getScrollableParents(): Element[];
  /** Will attach this listener to window mousedown if defined. Override as needed.
   * Defaults to `hidePopup()` when mouse is outside */
  popupHandleWinMousedown?: (e: MouseEvent) => void;
  /** Will attach this listener to window/parent scroll if defined. Override as needed.
   * Defaults to `hidePopup()` */
  popupHandleWinScroll?: (e: Event) => void;
  /** Will attach this listener to window resize if defined. Override as needed.
   * Defaults to `hidePopup()` */
  popupHandleWinResize?: (e: Event) => void;
  /** Util function to call `event.stopPropagation()` */
  popupHandleStopPropagation(e: Event): void;
};

/**
 * Mixin to automatically handle hiding on scroll, resize, mousedown outside, etc.
 */
export const PopupHandledMixin = safeMixin(
  <T extends TConstructor<LitElement>>(superClass: T): TConstructor<TMixin> & T => {
    class PopupHandledMixin extends PopupMixin(superClass) {
      getScrollableParents() {
        const result: Element[] = [];
        for (const parent of getAncestorsOf(this)) {
          const { overflowX, overflowY } = getComputedStyle(parent);
          if (
            overflowX === 'scroll' ||
            overflowX === 'auto' ||
            overflowY === 'scroll' ||
            overflowY === 'auto'
          ) {
            result.push(parent);
          }
        }
        return result;
      }

      // override as needed
      popupHandleWinMousedown = (e: Event) => {
        if (this.isPopupActive && !e.composedPath().includes(this)) {
          this.hidePopup();
        }
      };
      popupHandleWinScroll = (e: Event) => {
        if (e.isTrusted) {
          this.isPopupActive && this.hidePopup();
        }
      };
      popupHandleWinResize = () => {
        this.isPopupActive && this.hidePopup();
      };

      popupHandleStopPropagation(e: Event) {
        e.stopPropagation();
      }

      private _scrollParents?: EventTarget[] = [];

      connectedCallback(): void {
        super.connectedCallback();
        if (this.popupHandleWinMousedown)
          window.addEventListener('mousedown', this.popupHandleWinMousedown);
        if (this.popupHandleWinResize)
          window.addEventListener('resize', this.popupHandleWinResize, true);
        if (this.popupHandleWinScroll) {
          window.addEventListener('scroll', this.popupHandleWinScroll, true);

          this.updateComplete.then(() => {
            // sometimes hierarchy is not yet readily styled, wait for first update
            // note: cannot handle parent dynamic scroll style changes
            window.requestIdleCallback(() => {
              this._scrollParents = this.getScrollableParents();
              for (const el of this._scrollParents)
                el.addEventListener('scroll', this.popupHandleWinScroll, true);
            });
          });
        }
      }

      disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.popupHandleWinMousedown)
          window.removeEventListener('mousedown', this.popupHandleWinMousedown);
        if (this.popupHandleWinResize)
          window.removeEventListener('resize', this.popupHandleWinResize, true);
        if (this.popupHandleWinScroll) {
          window.removeEventListener('scroll', this.popupHandleWinScroll, true);
          let el: EventTarget | null | undefined;
          while ((el = this._scrollParents?.pop()))
            el.removeEventListener('scroll', this.popupHandleWinScroll, true);
        }
      }
    }
    return PopupHandledMixin;
  },
);
