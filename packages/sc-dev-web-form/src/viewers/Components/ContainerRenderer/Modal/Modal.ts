import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

export class Modal extends ComponentMixin(FormBaseViewer) {
 
  @state() showModal = false;

  handleAction(e: CustomEvent) {
    this.showModal = false;
  }

  renderElement() {
    const { label, size, triggerElement, primaryButton, secondaryButton, config } = this.component?.template ?? {};
    return html`
      ${triggerElement === 'button' ? html`
        <sc-button type=${config?.buttonType || 'primary'} @click=${() => this.showModal = true}>${config?.triggerText}</sc-button>
      ` : nothing}
      <sc-modal
        header=${label}
        size=${size}
        ?open=${this.showModal}
        footer-type="button"
        button-text-primary=${primaryButton}
        button-text-secondary=${secondaryButton}
        @sc-hide=${() => this.showModal = false}
        @sc-action=${this.handleAction}
      >
        <div class="modal-body">
          ${
  this.generateComponent(this.component.components, true, this.key, this.formData, this.component, this.readonly)
}
        </div>
      </sc-modal>
    `;
  }
}