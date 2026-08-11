import { html, nothing } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { BaseEditor } from '../../common/BaseEditor.js';

export class ContentLoaderEditor extends BaseEditor {

  renderLabel: any = () => {};

  renderOtherGeneral = () => {
    const { type = 'line' } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          label=Type
          value=${type}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'type');
    this.requestUpdate();
  }}
        >
          <sc-radio value=circle>Circle</sc-radio>
          <sc-radio value=line>Line</sc-radio>
          <sc-radio value=square>Square</sc-radio>
          <sc-radio value=rectangle>Rectangle</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { radius, type, height = 1 } = this.component.template;
   
    return html`${type === 'square' ? html`
      <div class=row>
        <sc-radio-group
          columns=2
          label=Radius
          value=${radius}
          direction=horizontal
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'radius')}
        >
          <sc-radio value=xxs>XXS</sc-radio>
          <sc-radio value=xs>XS</sc-radio>
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
          <sc-radio value=none>None</sc-radio>
        </sc-radio-group>
      </div>` : nothing}
      <div class=row>
        <sc-number-input label='Height (rem)'
          value=${height}
          type=digit
          max-decimals= 3
          @sc-input=${(e: CustomEvent) => this.onChange(`${e.detail.value}` + 'rem', 'height')}
        ></sc-number-input>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-content-loader .component=${this.component} .key=${this.key}>
      </form-content-loader>
    `;
  };
}