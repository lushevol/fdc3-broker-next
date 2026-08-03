import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import SlBreadcrumb from '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.component.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScBreadcrumbItemStyle from './ScBreadcrumbItem.style.js';
import ScBreadcrumbWrapStyle from './ScBreadcrumbWrap.style.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-link.js';
import { styleMap } from 'lit/directives/style-map.js';

export class ScBreadcrumbWrap extends ScElement {
  constructor() {
    super();
  }

  static styles = ScTheme.getStyles().concat([
    ScBreadcrumbItemStyle,
    ScBreadcrumbWrapStyle,
  ]);

  static get scopedElements() {
    return {
      'sl-breadcrumb': SlBreadcrumb,
      'sl-dropdown': SlDropdown,
      'sl-menu': SlMenu,
    };
  }

  /**
   * The label to use for the breadcrumb control. This will not be shown on the screen, but it will be announced by
   * screen readers and other assistive devices to provide more context for users.
   */
  @property() label = 'Breadcrumb';
  @property({ type: Boolean }) isCompressed: boolean;

  stopDefaultEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @query('slot') defaultSlot: HTMLSlotElement;
  @query('slot[name="separator"]') separatorSlot: HTMLSlotElement;
  @query('slot[name="compressed"]') compressedSlot: HTMLSlotElement;

  // Generates a clone of the separator element to use for each breadcrumb item
  getSeparator() {
    const separator = this.separatorSlot.assignedElements({ flatten: true })[0];
    const clone = separator.cloneNode(true) as HTMLElement;
    [clone, ...clone.querySelectorAll('[id]')].forEach(el =>
      el.removeAttribute('id')
    );
    clone.setAttribute('data-default', '');
    clone.slot = 'separator';
    return clone;
  }
  @query('.sc-breadcrumb-dropdown') breadcrumbDropdown: HTMLElement;
  handleSlotChange() {
    const items = [
      this.breadcrumbDropdown,
      ...this.defaultSlot.assignedElements({ flatten: true }),
    ].filter(item => item.tagName.toLowerCase() === 'sc-breadcrumb-item');
    
    items.forEach(item => {
      const separator = item.querySelector('[slot="separator"]');
      if (separator === null) {
        item.append(this.getSeparator());
      } else if (separator.hasAttribute('data-default')) {
        separator.replaceWith(this.getSeparator());
      } else {
      }
    });
  }

  @query('sl-dropdown') slDropdown: SlDropdown;
  renderCompressedPart() {
    const style = styleMap({
      display: this.isCompressed ? 'flex' : 'none',
    });
    return html` <sc-breadcrumb-item
      style=${style}
      class="sc-breadcrumb-item sc-breadcrumb-dropdown"
    >
      <sl-dropdown
        class="sc-dropdown"
        @sl-hide=${this.stopDefaultEvent}
        @sl-show=${this.stopDefaultEvent}
      >
        <sc-link slot="trigger">
          <sc-icon
            label="More options"
            name="more-horizontal"
            compact
          ></sc-icon>
        </sc-link>
        <sl-menu class="sc-menu">
          <slot @click=${() => this.slDropdown.hide()} name="compressed"></slot>
        </sl-menu>
      </sl-dropdown>
    </sc-breadcrumb-item>`;
  }

  render() {
    return html`
      <sl-breadcrumb class="sc-breadcrumb" .label="${this.label}">
        <slot @slotchange=${this.handleSlotChange}></slot>

        <slot name="begin-item"></slot>

        ${this.renderCompressedPart()}

        <slot name="end-item"></slot>

        <slot name="separator" slot="separator">
          <sc-icon name="chevron-right" compact></sc-icon>
        </slot>
      </sl-breadcrumb>
    `;
  }
}
