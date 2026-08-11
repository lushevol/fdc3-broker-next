import { html } from 'lit';
import { state, queryAssignedElements, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScBottomNavbarStyle from './ScBottomNavbar.style.js';
import { ScNavbarItem } from './ScNavbarItem.js';

const MIN_NO_OF_ITEMS = 2;
const MAX_NO_OF_ITEMS = 5;

export class ScBottomNavbar extends ScElement {
    
  static styles = ScTheme.getStyles().concat([ScBottomNavbarStyle]);
  
  @property({ type: Boolean }) truncate = false;

  @queryAssignedElements({ selector: 'sc-navbar-item' })
  public items: Array<ScNavbarItem>;

  @state()
  private noOfItems = 0;

  private itemsChanged(): void {
    this.noOfItems = this.items.length;
    this.items.forEach((item: ScNavbarItem, index: number) => {
      if (index >= MAX_NO_OF_ITEMS) {
        item.hidden = true;
      } else {
        item.hidden = false;
      }
    });
  }

  render() {
    const containerClass = classMap({
      'sc-bottom-navbar': true,
      hidden: this.noOfItems < MIN_NO_OF_ITEMS,
      'sc-truncate': this.truncate,
    });
    let noOfShownItems = this.items.length;
    if (this.items.length > MAX_NO_OF_ITEMS) {
      noOfShownItems = MAX_NO_OF_ITEMS;
    } else if (this.items.length < MIN_NO_OF_ITEMS) {
      noOfShownItems = MIN_NO_OF_ITEMS;
    }
    return html`
            <style>
                ::slotted(sc-navbar-item){
                    flex-basis: calc(100% / ${noOfShownItems});
                }
            </style>
            <div class=${containerClass}>
                <slot class="navbar-item-container" @slotchange=${this.itemsChanged}></slot>
            </div>
        `;
  }
}
