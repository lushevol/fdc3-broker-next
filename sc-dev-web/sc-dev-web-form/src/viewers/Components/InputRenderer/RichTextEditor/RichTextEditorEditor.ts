import { html } from 'lit';
import { BaseEditor } from '../../common/BaseEditor.js';

export const Toolbars = [
  'undo',
  'redo',
  'fontstyle',
  'separate',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'alignleft',
  'aligncenter',
  'alignright',
  'orderedlist',
  'unorderedlist',
  'outdent',
  'indent',
  'insertimage',
  'addlink',
  'unlink',
  'quote',
  'table',
];

export class RichTextEditorEditor extends BaseEditor {

  renderOtherBehavior = () => {
    const { hidden, readonly, disabled, required } = this.component.template;
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Required"
            ?checked=${required}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'required')}
          >
          </sc-switch>
        </div>
        <div class=w-half>
          <sc-switch
            label="Disabled"
            ?checked=${disabled}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'disabled')}
          >
          </sc-switch>
        </div>
      </div>
      <div>
        <div class=w-half>
          <sc-switch
            label="Readonly"
            ?checked=${readonly}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'readonly')}
          >
          </sc-switch>
        </div>
        <div class=w-half>
          <sc-switch
            label="Hidden"
            ?checked=${hidden}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'hidden')}
          >
          </sc-switch>
        </div>
      </div>
    `;
  };

  renderOtherGeneral = () => {
    const { toolbar = Toolbars, tooltip, helpText } = this.component.template;
    return html`
      <div class=row>
        <sc-dropdown-multi-select
          label="Toolbar"
          .value=${toolbar}
          .data=${Toolbars.map(tb => ({
    label: tb,
    value: tb,
  }))}
          hoist
          @sc-select=${(e: CustomEvent) => this.onChange(e.detail.value, 'toolbar')}
        >
        </sc-dropdown-multi-select>
      </div>
      <div class=row>
        <sc-text-input
          label="Tooltip"
          value=${tooltip}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'tooltip')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          .toolbar=${this.simpleToolbars}
          value=${helpText}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
    `;
  };

  renderPrefillAnswer: any = () => {
    return html`
      <prefill-answer
        .component=${this.component}
        @value-changed=${(event: CustomEvent) => {
    this.onChange(event.detail.value, event.detail.name);
    this.requestUpdate();
  }}
      ></prefill-answer>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Label size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
      <form-rich-text-editor .component=${this.component} .key=${this.key}>
      </form-rich-text-editor>
    `;
  };
}