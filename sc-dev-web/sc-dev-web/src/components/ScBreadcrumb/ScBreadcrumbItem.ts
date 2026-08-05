import { html } from 'lit';
import { property } from 'lit/decorators.js';

import SlBreadcrumbItem from '@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.component.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import ScBreadcrumbItemStyle from './ScBreadcrumbItem.style.js';
import '../../../elements/sc-icon.js';
import { HasSlotController } from '../../shared/slot.js';
import { when } from 'lit/directives/when.js';
import { LINK_TARGET } from '../../shared/util.js';

export class ScBreadcrumbItem extends ScElement {
  static styles = ScTheme.getStyles().concat([ScBreadcrumbItemStyle]);

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'group');
  }

  static get scopedElements() {
    return {
      'sl-breadcrumb-item': SlBreadcrumbItem,
    };
  }
  private readonly hasSlotController = new HasSlotController(this, 'prefix', 'suffix');

  @property() href?: string;

  @property() target?: `${LINK_TARGET}`;

  render() {
    const hasPrefix = this.hasSlotController.test('prefix');
    const hasSuffix = this.hasSlotController.test('suffix');
    return html`
      <sl-breadcrumb-item
        class='sc-breadcrumb-item'
        .href='${this.href}'
        .target='${this.target}'
      >
        <slot name='separator' slot='separator'>
          <sc-icon name='chevron-right' compact></sc-icon>
        </slot>
        ${when(hasPrefix, () => html`<slot name='prefix' slot='prefix'></slot>`)}
        <slot></slot>
        ${when(hasSuffix, () => html`<slot name='suffix' slot='suffix'></slot>`)}
      </sl-breadcrumb-item>
    `;
  }
}
