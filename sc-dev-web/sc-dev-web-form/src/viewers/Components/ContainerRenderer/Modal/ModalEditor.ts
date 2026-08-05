import { html, nothing } from 'lit';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import ModalStyle from './Modal.style.js';

const TriggerElementOptions = [
  { label: 'Button', value: 'button' },
];

export class ModalEditor extends ComponentMixin(ContainerBaseEditor) {

  onConfigChange(value: string, key: string) {
    const config = { ...this.component.template.config, [key]: value };
    this.onChange(config, 'config');
  }

  renderOtherGeneral = () => {
    const { triggerElement, primaryButton, secondaryButton, config } = this.component.template;
    return html`
      <div class=row>
        <sc-dropdown-input
          label="Trigger element"
          .data=${TriggerElementOptions}
          value=${triggerElement}
          @sc-select=${(e: CustomEvent) => this.onChange(e.detail.value, 'triggerElement')}
        ></sc-dropdown-input>
      </div>
      ${triggerElement ? html`
        <div class=row>
          <sc-text-input
            label="Trigger element text"
            value=${config?.triggerText}
            @sc-input=${(e: CustomEvent) => this.onConfigChange(e.detail.value, 'triggerText')}
          ></sc-text-input>
        </div>
        ` : nothing}
      ${triggerElement === 'button' ? html`
        <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Trigger button type"
          value=${config?.buttonType || 'primary'}
          @sc-change=${(e: CustomEvent) => this.onConfigChange(e.detail.value, 'buttonType')}
        >
          <sc-radio value=primary>Primary</sc-radio>
          <sc-radio value=secondary>Secondary</sc-radio>
          <sc-radio value=text>Text</sc-radio>
          <sc-radio value=link>Link</sc-radio>
        </sc-radio-group>
      </div>
        ` : nothing}
      <div class=row>
        <sc-text-input
          label="Modal primary button"
          value=${primaryButton}
           @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'primaryButton')}
        ></sc-text-input>
      </div>
      <div class=row>
        <sc-text-input
          label="Modal secondary button"
          value=${secondaryButton}
           @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'secondaryButton')}
        ></sc-text-input>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { size } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Modal size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    const { id, components } = this.component;
    const { label, primaryButton, secondaryButton } = this.component?.template ?? {};
    return html`
      <style>
        ${ModalStyle}
      </style>
      <sc-box type="default">
        <div class='box-body' id="${id}">
          ${label ? html`<div style='margin-bottom: 1rem'>
            <sc-label
              label="${label}"
              label-size="md"
            ></sc-label>
          </div>` : nothing }
          ${
  this.generateComponent(components)
}
          ${this.renderEmptyLabel(this.component)}
          ${renderDragDropZone(this.onDrop, this.dragDropState?._highlighting)}
          ${primaryButton ? html`
            <div class="button-container">
              ${secondaryButton ? html`<sc-button type="secondary" size="sm">${secondaryButton}</sc-button>` : nothing}
              <sc-button size="sm">${primaryButton}</sc-button>
            </div>
          ` : nothing}
        </div>
      </sc-box>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
      </div>
    `;
  };
}