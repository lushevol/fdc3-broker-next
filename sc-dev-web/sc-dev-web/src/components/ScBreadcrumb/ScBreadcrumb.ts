import { html } from 'lit';
import { property } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-link.js';
import ScBreadcrumbItemStyle from './ScBreadcrumb.style.js';
import { watch } from '../../shared/watch.js';
export class ScBreadcrumb extends ScElement {
  static styles = ScTheme.getStyles().concat([ScBreadcrumbItemStyle]);
  /**
   * The label to use for the breadcrumb control. This will not be shown on the screen, but it will be announced by
   * screen readers and other assistive devices to provide more context for users.
   */
  @property() label = 'Breadcrumb';

  @property({ type: Boolean }) compressed = false;

  @property({ type: Boolean }) fill = false;

  get items() {
    const slots = this.querySelectorAll('sc-breadcrumb-item');
    return Array.from(slots) || [];
  }
  get isCompressed() {
    return this.items.length > 3 && this.compressed;
  }

  @watch('compressed')
  async handleCompressedChange() {
    await this.updateComplete;
    const breadcrumbItems = this.items;
    if (breadcrumbItems.length < 4) {
      return;
    }

    const collapsedItems = breadcrumbItems.splice(
      1,
      breadcrumbItems.length - 2
    );
    if (this.isCompressed) {
      breadcrumbItems[0].setAttribute('slot', 'begin-item');
      breadcrumbItems[1].setAttribute('slot', 'end-item');
    } else {
      breadcrumbItems[0].removeAttribute('slot');
      breadcrumbItems[1].removeAttribute('slot');
    }
    collapsedItems.forEach(el => {
      if (this.isCompressed) {
        el.setAttribute('slot', 'compressed');
      } else {
        el.removeAttribute('slot');
      }
    });
  }

  async handleSlotChange() {
    this.handleCompressedChange();
    this.items.forEach(item => {
      item.addEventListener('click', e=>this.handleAction(e));
    });
  }
  handleAction(event: any) {
    this.emit('sc-action', {
      detail: {
        target: event.target,
      },
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.items.forEach(item => {
      item.removeEventListener('click',this.handleAction);
    });
  }

  render() {
    return html`
      <sc-breadcrumb-wrap
        .label=${this.label}
        ?isCompressed=${this.isCompressed}
        class="sc-breadcrumb-wrap ${this.fill ? 'sc-breadcrumb-wrap-fill' : ''}"
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <slot name="separator" slot="separator">
          <sc-icon name="chevron-right" compact></sc-icon>
        </slot>

        <slot name="begin-item" slot="begin-item"></slot>
        <slot name="compressed" slot="compressed"></slot>
        <slot name="end-item" slot="end-item"></slot>
      </sc-breadcrumb-wrap>
    `;
  }
}
