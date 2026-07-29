import { html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import { getTextContent, HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import ScMenuItemStyle from './ScMenuItem.style.js';
import { SubmenuController } from './SubMenuController.js';
import '../../../elements/sc-icon.js';
import { LINK_TARGET } from '../../shared/util.js';

export class ScMenuItem extends ScElement {
  static styles = ScTheme.getStyles().concat([ScMenuItemStyle]);

  private cachedTextLabel: string;
  private cachedTextDescription: string;

  @query('slot:not([name])') defaultSlot: HTMLSlotElement;
  @query('slot[name="description"]') descriptionSlot: HTMLSlotElement;
  @query('.sc-menu-item') menuItem: HTMLElement;

  /** The type of menu item to render. To use `checked`, this value must be set to `checkbox`. */
  @property() type: 'normal' | 'checkbox' = 'normal';

  /** Draws the item in a checked state. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
  @property() value = '';

  @property() href?: string;

  @property() target: `${LINK_TARGET}` = LINK_TARGET._self;

  @property({ type: Boolean }) selected = false;

  /** Draws the menu item in a disabled state, preventing selection. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, attribute: 'prevent-default-link' }) preventDefaultLink = false;

  readonly hasSlotController = new HasSlotController(
    this,
    'submenu',
    'description',
  );

  private submenuController: SubmenuController = new SubmenuController(this, this.hasSlotController);

  get hasDescription() {
    return this.descriptionSlot && (this.descriptionSlot.childNodes.length > 0 || getTextContent(this.descriptionSlot));
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleHostClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleHostClick);
  }

  private handleDefaultSlotChange() {
    const textLabel = getTextContent(this.defaultSlot);

    // Ignore the first time the label is set
    if (typeof this.cachedTextLabel === 'undefined') {
      this.cachedTextLabel = textLabel;
      return;
    }

    // When the label changes, dispatch a slotchange event so parent controls see it
    if (textLabel !== this.cachedTextLabel) {
      this.cachedTextLabel = textLabel;
      this.dispatchEvent(
        new CustomEvent('slotchange', {
          bubbles: true,
          composed: false,
          cancelable: false,
        })
      );
    }
  }

  isSubmenu() {
    return this.hasSlotController.test('submenu');
  }

  handleLinkAction = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  private handleHostClick = (event: MouseEvent) => {
    // Prevent the click event from being emitted when the button is disabled
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else {
      this.emit('sc-action', {
        detail: {
          target: event.target,
          data: {
            href: this.href,
            target: this.target,
            value: this.value,
            checked: this.checked,
          },
        },
      });
      if (this.href && !this.preventDefaultLink) {
        window.open(this.href, this.target || '_self');
      }
    }
  };

  @watch('checked')
  handleCheckedChange() {
    // For proper accessibility, users have to use type="checkbox" to use the checked attribute
    if (this.checked && this.type !== 'checkbox') {
      this.checked = false;
      console.error('The checked attribute can only be used on menu items with type="checkbox"', this);
      return;
    }

    // Only checkbox types can receive the aria-checked attribute
    if (this.type === 'checkbox') {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    } else {
      this.removeAttribute('aria-checked');
    }
  }

  @watch('disabled')
  handleDisabledChange() {
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  @watch('type')
  handleTypeChange() {
    if (this.type === 'checkbox') {
      this.setAttribute('role', 'menuitemcheckbox');
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
    } else {
      this.setAttribute('role', 'menuitem');
      this.removeAttribute('aria-checked');
    }
  }

  render() {
    const isSubmenuExpanded = this.submenuController.isExpanded();

    return html`
      <div
        id="anchor"
        part="base"
        class=${classMap({
          'sc-menu-item': true,
          'menu-item-checked': this.checked,
          'menu-item-disabled': this.disabled,
          'menu-item--has-submenu': this.isSubmenu(),
          'menu-item--submenu-expanded': isSubmenuExpanded,
        })}
        ?aria-expanded="${isSubmenuExpanded ? true : false}"
      >
        <span part="checked-icon" class="menu-item-check">
          <sc-icon name="tick"></sc-icon>
        </span>
        <sc-link
          ?prevent-default-link=${this.preventDefaultLink}
          ?disabled=${this.disabled}
          target=${this.target || '_self'}
          href=${this.href}
          @sc-action=${(event: any) => this.handleLinkAction(event)}
          style="${this.selected ? '' : '--sc-link-content-color: none;'} --sc-link-display: block;"
        >
          <slot name="prefix" part="prefix" class="menu-item-prefix"></slot>
  
          <span class='menu-item-content'>
            <slot part="label" class="menu-item-label ${
    this.hasDescription ? 'hasDescription' : ''
  }" @slotchange=${this.handleDefaultSlotChange}></slot>
            <slot name="description" part="description" class="menu-item-description"></slot>
          </span>
  
          <slot name="suffix" part="suffix" class="menu-item-suffix"></slot>
        </sc-link>
        ${this.isSubmenu() ? html`<span part="submenu-icon" class="menu-item__chevron">
          <sc-icon name=arrow-ios-forward aria-hidden="true"></sc-icon>
        </span>` : nothing}
        ${this.submenuController.renderSubmenu()}
        <span class="menu-item-suffix-padding">
        </span>
      </div>
    `;
  }
}
