import { html, nothing, PropertyValues } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';
import { state } from 'lit/decorators.js';

export class DividerEditor extends BaseEditor {

  renderLabel = () => {};

  renderOtherGeneral = () => {
    const { title, vertical } = this.component.template;
    return html`
    <div class=row>
      <sc-text-input
        label="Label"
        value=${title}
        border-type="box"
        @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'title')}
      >
      </sc-text-input>
    </div>
    <div class=row>
        <sc-radio-group
            columns=2
            direction=horizontal
            label="Type"
            value=${vertical}
            @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.value === 'true', 'vertical');
    this.requestUpdate();
  }}
          >
            <sc-radio value=false>Vertical</sc-radio>
            <sc-radio value=true>Horizontal</sc-radio>
          </sc-radio-group>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { size , textAlign, vertical, labelSize } = this.component.template;  
    return html`
      ${vertical ? html`
        <div class=row>
          <sc-radio-group
            columns=2
            direction=horizontal
            label="Text alignment"
            value=${textAlign}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'textAlign')}
          >
            <sc-radio value=left>Left</sc-radio>
            <sc-radio value=center>Center</sc-radio>
            <sc-radio value=right>Right</sc-radio>
          </sc-radio-group>
        </div>
        <div class=row>
          <sc-radio-group
            columns=3
            direction=horizontal
            label="Label size"
            value=${labelSize}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
          >
            ${
  CompactSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
          </sc-radio-group>
        </div>
        ` : nothing}
      
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Size"
          value=${size}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          ${
  CompactSize.map((size: string) => html`<sc-radio value=${size}>${size.toUpperCase()}</sc-radio>`)
}
        </sc-radio-group>
      </div>
      
      
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-divider .component=${this.component} .key=${this.key}>
      </form-divider>
    `;
  };
}