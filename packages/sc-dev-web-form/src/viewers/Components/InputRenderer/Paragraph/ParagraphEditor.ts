import { html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/PrefillAnswer.js';

export class ParagraphEditor extends FormBaseEditor {

  @state() _ellipsis = false;
  
  renderOtherGeneral = () => {};
  
  renderTooltip = () => {};

  renderStyleAndLayout = () => {
    const { size = 'md', rows } = this.component?.template ?? {};
    return html`
      ${this._ellipsis ? html`<div class=row>
        <sc-number-input
          label=Rows
          value=${rows}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'rows')}
        >
        </sc-number-input>
      </div>` : nothing}
      <div class=row>
        <sc-radio-group
          direction=horizontal
          label="Size"
          value=${size}
          columns=3
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'size')}
        >
          <sc-radio value=xs>XS</sc-radio>
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { ellipsis } = this.component?.template ?? {};
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Ellipsis"
            ?checked=${ellipsis}
            @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.checked, 'ellipsis');
    if (!e.detail.checked) {
      this.onChange(undefined, 'rows');
    }
    this._ellipsis = e.detail.checked;
  }}
          >
          </sc-switch>
        </div>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-paragraph .component=${this.component} .key=${this.key}>
      </form-paragraph>
    `;
  };
}