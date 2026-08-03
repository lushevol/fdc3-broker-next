import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScBasicLayoutStyle from './ScBasicLayout.style.js';
import { HasSlotController } from '../../shared/slot.js';

export class ScBasicLayout extends ScElement {
  static styles = ScTheme.getStyles().concat([ScBasicLayoutStyle]);

  @property({ type: String }) title = '';

  @property({ type: Boolean, attribute: 'limit-width' }) limitWidth = false;

  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'title',
  );

  render() {
    const classes = classMap({
      'sc-basic-layout': true,
      'part-width': this.limitWidth,
    });
    const hasTitleSlot = this.hasSlotController.test('title');
    return html`
      <div class=${classes}>
        ${(hasTitleSlot || this.title) ? html`
          <sc-title level="2" class='title'>
            ${this.title ? html`${this.title}` : html`
              <slot name='title'></slot>
            `}
          </sc-title>
        ` : null}
        <slot></slot>
      </div>
    `;
  }
}