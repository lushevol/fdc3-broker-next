import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';

export class ProgressBarEditor extends BaseEditor {

  renderLabel: any = () => {};

  renderOtherGeneral = () => {
    const { type = 'success' } = this.component.template;
    return html`
    <div class=row>
        <sc-radio-group
          columns=2
          label=Type
          value=${type}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'type')}
        >
          <sc-radio value=info>Info</sc-radio>
          <sc-radio value=success>Success</sc-radio>
          <sc-radio value=warning>Warning</sc-radio>
          <sc-radio value=error>Error</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const {  size = 'sm' } = this.component.template;

    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          label=Size
          value=${size}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { indeterminate, showLabel } = this.component.template;
    return html`
      <div>
        <sc-switch
          label="Indeterminate"
          ?checked=${indeterminate}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'indeterminate')}
        >
        </sc-switch>
      </div>
      <div>
        <sc-switch
          label="Show label"
          ?checked=${showLabel}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'showLabel')}
        >
        </sc-switch>
      </div>
    `;
  };

  renderDataOptions: any = () => {
    const { value, defaultValue } = this.component.template;
    return html`
      <div class=row>
        <sc-number-input 
          label=Value
          min=0
          max=100
          value=${value || defaultValue}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'defaultValue')}
        >
        </sc-number-input>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-progress-bar .component=${this.component} .key=${this.key}>
      </form-progress-bar>
    `;
  };
}