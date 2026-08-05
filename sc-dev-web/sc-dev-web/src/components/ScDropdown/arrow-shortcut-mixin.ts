import { TConstructor, safeMixin } from '../../shared/mixin.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import { LitElement } from 'lit';
import { Virtualizer } from '../../controllers/virtualizer/virtualizer.js';

type TArrowShortcut = {
  onKeydown(e: KeyboardEvent): void;
  onMenuKeydown(e: KeyboardEvent): void;
  OnMenuKeyup(e: KeyboardEvent): void;
  scrollElement?: HTMLElement;
  getCurrentItem(): SlMenuItem | undefined;
  setCurrentItem(target: SlMenuItem): void;
  firstMenuItem: SlMenuItem;
  lastMenuItem: SlMenuItem;
  focusOn(menuItem: SlMenuItem): void;
};
export enum E_KEYS {
  down = 'ArrowDown',
  up = 'ArrowUp',
  home = 'Home',
  end = 'End',
  enter = 'Enter',
  esc = 'Escape',
}

export const ArrowShortcutMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TArrowShortcut> & T => {
    class ArrowShortcutMixin extends superClass {
      scrollElement?: HTMLElement;
      fromStart = [E_KEYS.down.toString(), E_KEYS.home.toString()];
      fromEnd = [E_KEYS.up.toString(), E_KEYS.end.toString()];
      get menuItems() {
        const menuItems = Array.from(
          this.scrollElement?.querySelectorAll<SlMenuItem>('sl-menu-item') ?? []
        );
        // hidden only works when it is virtual
        return menuItems.filter(menu => !menu.hasAttribute('hidden'));
      }
      get firstMenuItem() {
        return this.menuItems[0];
      }
      get lastMenuItem() {
        return this.menuItems[this.menuItems.length - 1];
      }

      get arrowKey() {
        return [
          E_KEYS.up.toString(),
          E_KEYS.down.toString(),
          E_KEYS.home.toString(),
          E_KEYS.end.toString(),
        ];
      }

      setCurrentItem(target: SlMenuItem) {
        this.menuItems.forEach(item => {
          item.setAttribute('tabindex', item === target ? '0' : '-1');
        });
      }
      getCurrentItem() {
        return this.menuItems.find(_ => _.getAttribute('tabindex') === '0');
      }

      isVirtual: false;
      protected dropdownOptionsWithIndex: Map<number, any> = new Map();

      OnMenuKeyup(e: KeyboardEvent) {
        const key = e.key;
        const activeItem = this.getCurrentItem();
        if (key === E_KEYS.enter) {
          e.preventDefault();
          e.stopPropagation();
          activeItem?.click?.();
        }
      }
      hide() {}
      onMenuKeydown(e: KeyboardEvent) {
        const key = e.key;
        const activeItem = this.getCurrentItem();
        if (key === E_KEYS.esc) {
          e.preventDefault();
          e.stopPropagation();
          this.hide();
        } else if (this.menuItems.length > 0) {
          let index = activeItem ? this.menuItems.indexOf(activeItem) : 0;
          e.preventDefault();
          e.stopPropagation();
          if (key === E_KEYS.down) {
            ++index;
          } else if (key === E_KEYS.up) {
            --index;
          } else if (key === E_KEYS.home) {
            this.scrollToStart();
            index = 0;
          } else if (key === E_KEYS.end) {
            this.scrollToEnd();
            index = this.menuItems.length - 1;
          }
          if (index < 0) {
            this.scrollToEnd();
            index = this.menuItems.length - 1;
          }
          if (index > this.menuItems.length - 1) {
            this.scrollToStart();
            index = 0;
          }
          this.focusOn(this.menuItems[index]);
        }
      }

      protected virtualizer: Virtualizer;
      scrollToEnd() {
        if (this.isVirtual && this.virtualizer) {
          this.virtualizer.scrollToIndex(
            this.dropdownOptionsWithIndex.size - 1
          );
        }
      }
      scrollToStart() {
        if (this.isVirtual && this.virtualizer) {
          this.virtualizer.scrollToIndex(0);
        }
      }

      focusOn(menuItem: SlMenuItem) {
        if (!menuItem) return;
        this.setCurrentItem(menuItem);
        menuItem.focus();
      }

      // key down in trigger anchor
      onKeydown(e: KeyboardEvent) {
        const key = e.key;
        if (this.arrowKey.includes(key)) {
          e.preventDefault();
          this.updateComplete.then(() => {
            if (this.fromStart.includes(key)) {
              this.scrollToStart();
            } else {
              this.scrollToEnd();
            }
            setTimeout(() => {
              const target = this.fromStart.includes(key)
                ? this.firstMenuItem
                : this.lastMenuItem;
              this.focusOn(target);
            }, 0);
          });
        }
      }
    }
    return ArrowShortcutMixin;
  }
);
