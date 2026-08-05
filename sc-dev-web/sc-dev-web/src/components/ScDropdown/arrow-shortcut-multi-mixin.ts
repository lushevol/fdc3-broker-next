import { TConstructor, safeMixin } from '../../shared/mixin.js';
import { LitElement } from 'lit';
import { ArrowShortcutMixin, E_KEYS } from './arrow-shortcut-mixin.js';


export const ArrowShortcutMultiMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): T => {
    class ArrowShortcutMultiMixin extends ArrowShortcutMixin(superClass) {
      get menuItems() {
        const menuItems = Array.from(
          this.scrollElement?.querySelectorAll('.list-item') ?? []
        );
        return menuItems.filter(menu => !menu.hasAttribute('hidden'));
      }
      OnMenuKeyup(e: KeyboardEvent) {
        const key = e.key;
        const activeItem = this.getCurrentItem();
        if (key === E_KEYS.enter && activeItem) {
          e.preventDefault();
          e.stopPropagation();
          const checkbox = activeItem.querySelector('sc-checkbox');
          
          // @ts-ignore
          if (this.isExpandedMenuItem(activeItem)) {
            // @ts-ignore
            this.updateExpandedBehaviour(activeItem);
            return;
          }
          if (checkbox) {
            checkbox.click();
          }
        }
      }
    }
    return ArrowShortcutMultiMixin;
  }
);
