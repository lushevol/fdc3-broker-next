import { html, nothing, PropertyValues } from 'lit';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import '../../common/PrefillAnswer.js';
import { state } from 'lit/decorators.js';

export class TitleEditor extends FormBaseEditor {

  @state() _ellipsis = false;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this._ellipsis = this.component?.template?.ellipsis;
  }

  renderOtherGeneral = () => {};
  
  renderTooltip = () => {};

  renderStyleAndLayout = () => {
    const { level = 1, rows } = this.component?.template ?? {};
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
          value=${level}
          columns=3
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'level')}
        >
          <sc-radio value=1>H1</sc-radio>
          <sc-radio value=2>H2</sc-radio>
          <sc-radio value=3>H3</sc-radio>
          <sc-radio value=4>H4</sc-radio>
          <sc-radio value=5>H5</sc-radio>
          <sc-radio value=6>H6</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { ellipsis, hero } = this.component?.template ?? {};
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
        <div class=w-half>
          <sc-switch
            label="Hero"
            ?checked=${hero}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'hero')}
          >
          </sc-switch>
        </div>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-title .component=${this.component} .key=${this.key}>
      </form-title>
    `;
  };
}