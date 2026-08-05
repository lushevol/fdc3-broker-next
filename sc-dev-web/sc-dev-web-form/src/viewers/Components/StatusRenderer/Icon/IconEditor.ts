import { html } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';

export class IconEditor extends BaseEditor {

  renderLabel: any = () => {};

  renderOtherGeneral = () => {
    const { name = 'home--line' } = this.component.template;
    return html`
      <div class=row>
        <sc-icon-selector
          label="Icon"
          value=${name}
          @value-changed=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'name');
    this.requestUpdate();
  }}
        ></sc-icon-selector>
      </div>
    `;
  };
  
  renderAllStyleAndLayout = () => {
    const { size = 'sm' } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          label=Size
          value=${size}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          <sc-radio value=xxs>XXS</sc-radio>
          <sc-radio value=xs>XS</sc-radio>
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
          <sc-radio value=xl>XL</sc-radio>
          <sc-radio value=xxl>XXL</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-icon .component=${this.component} .key=${this.key}>
      </form-icon>
    `;
  };
}