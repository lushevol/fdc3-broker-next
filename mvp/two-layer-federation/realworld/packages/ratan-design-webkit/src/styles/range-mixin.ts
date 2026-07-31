import { LitElement } from 'lit';
import { safeMixin, TConstructor } from '../shared/mixin.js';

type TRange = {
  shadowrootGetSelection(): Selection | StaticRange[] | null;
  staticRangeToRange(staticRange: StaticRange): Range;
  range: Range | undefined;
};

export const RangeMixin = safeMixin(
  <T extends TConstructor<LitElement>>(superClass: T): TConstructor<TRange> & T => {
    class RangeMixin extends superClass {
      shadowrootGetSelection() {
        let selection: Selection | StaticRange[] | null =
          document.getSelection() || window.getSelection();
        // if ((<any>selection).getComposedRanges) {
        //   selection = (<any>selection).getComposedRanges(
        //     this.shadowRoot
        //   ) as StaticRange[];
        // } else
        if ((this.shadowRoot as any).getSelection) {
          selection = (this.shadowRoot as any).getSelection();
        }
        return selection;
      }

      staticRangeToRange(staticRange: StaticRange) {
        const range = document.createRange();
        range.setStart(staticRange.startContainer, staticRange.startOffset);
        range.setEnd(staticRange.endContainer, staticRange.endOffset);
        return range;
      }

      /**
       * compatible range
       */
      get range() {
        const selection = this.shadowrootGetSelection();

        let range: Range | undefined;
        if (selection) {
          if (selection instanceof Selection) {
            if (selection.rangeCount) {
              range = selection.getRangeAt(0);
            }
          } else {
            range = this.staticRangeToRange(selection[0]);
          }
        }
        return range;
      }
    }
    return RangeMixin;
  },
);
