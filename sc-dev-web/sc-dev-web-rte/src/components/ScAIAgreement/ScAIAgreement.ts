import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import ScRteElement from '../../shared/sc-rte-element.js';
import { HasSlotController } from '../../shared/slot.js';
const acceptableUseAgreementUrl = 'http://go/ai-policy';
export class ScAIAgreement extends ScRteElement {
  static styles = css`
    .sc-ai-agreement-footer {
      font-size: 0.75rem;
      color: var(--sc-form-control-placeholder-color, --sc-color-grey-400);
      padding: var(--sc-ai-agreement-footer-padding, 0rem);
      text-align: justify;
    }
    `;
  readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
    'content',
  );
    @property({ type: String, attribute: 'ai-model' }) aiModel = 'YODA';
    @property({ type: Object }) links = {
      'Acceptable Use Agreement': acceptableUseAgreementUrl,
    };

    render() {
      const hasDefaultSlot = this.hasSlotController.test('[default]');
      const hasContentSlot = this.hasSlotController.test('content');
      return hasDefaultSlot ? html`<slot></slot>` :
        html`
        ${
  hasContentSlot ? html`<slot name="content" slot="content" class="sc-ai-agreement-footer"></slot>` :
    html`<div class="sc-ai-agreement-footer">
          <span>AI content may contain errors. By using it, you agree to verify accuracy, accept and comply with our&nbsp;</span>
          <sc-link href=${this.links['Acceptable Use Agreement']} target="_blank">terms</sc-link>&nbsp;.
          </div>`
}
        `;
    }
}