import { LitElement } from 'lit';
import { safeMixin, TConstructor } from '../shared/mixin.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';

type TVirtualAnchor = {
  getBoundingClientRect: () => DOMRect;
};
type TPopup = {
  popupElement: SlPopup;
  togglePopup(): void;
  showPopup(): void;
  hidePopup(): void;
  setVirtualAnchor(virtualAnchor: TVirtualAnchor): void;
  isPopupActive: boolean;
};

export const PopupMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TPopup> & T => {
    class PopupMixin extends ScopedElementsMixin(superClass) {
      static get scopedElements() {
        return {
          'sl-popup': SlPopup,
        };
      }

      get popupElement() {
        return this.renderRoot.querySelector('sl-popup') as SlPopup;
      }
      isActive = false;
      get isPopupActive() {
        return this.isActive;
      }
      togglePopup() {
        if (this.popupElement.active) {
          this.hidePopup();
        } else {
          this.showPopup();
        }
      }
      showPopup() {
        this.popupElement.active = true;
        this.isActive = true;
      }
      hidePopup() {
        this.popupElement.active = false;
        this.isActive = false;
      }
      setVirtualAnchor(virtualAnchor: TVirtualAnchor) {
        this.popupElement.anchor = virtualAnchor;
        if (this.popupElement.active) {
          this.popupElement.reposition();
        }
      }
    }
    return PopupMixin;
  }
);
