import { html } from 'lit';
import { FormBaseEditor } from '../../common/FormBaseEditor.js';
import { CompactSize } from '../../../../shared/utils.js';
import { OptionConfig } from '../../../../models/OptionConfig.js';
import { state } from 'lit/decorators.js';

const fileTypeArr = ['docx', 'pptx', 'ppt', 'pdf', 'xlsx', 'xls', 'msg', 'png', 'jpg', 'jpge', 'svg', 'txt', 'mp4', 'webp'];

export class DocumentViewerEditor extends FormBaseEditor {
  // @ts-ignore
  @state() _optionConfig: OptionConfig = {};

  willUpdate() {
    const { optionConfig } = this.component.template;
    if (optionConfig) {
      this._optionConfig = optionConfig;
    }
  }

  updateOptionConfig(value: any, key: string) {
    // @ts-ignore
    this._optionConfig[key] = value;
    this.onChange(this._optionConfig, 'optionConfig');
    this.requestUpdate();
  }

  renderOtherGeneral = () => {
    const { helpText, placeholder, fileType } = this.component.template;
    return html`
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          value=${helpText}
          .toolbar=${this.simpleToolbars}
          @sc-change=${(e: CustomEvent) => {
            this.onChange(e.detail.text, 'helpText');
            this.requestUpdate();
          }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-dropdown-input
          label="File type"
          hoist
          value=${fileType}
          clearable
          @sc-select=${(e: CustomEvent) => {
            this.onChange(e.detail.value, 'fileType');
            this.requestUpdate();
          }}
        >
        ${fileTypeArr.map((type: string) => html`
          <sc-dropdown-option value='${type}'>${type}</sc-dropdown-option>
        `)}
        </sc-dropdown-input>
      </div>
    `;
  };

  renderBehavior = () => {
    const { required, readonly } = this.component?.template ?? {};
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
            label="Readonly"
            ?checked=${readonly}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'readonly')}
          >
          </sc-switch>
        </div>
      </div>
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

  renderPrefillAnswer: any = () => {
    return html`
      <div class="options-container">
        <data-source-selector-for-option 
          .setOption=${false}
          config=${JSON.stringify(this._optionConfig)}
          component=${JSON.stringify(this.component)}
          @config-updated=${(event: CustomEvent) => this.updateOptionConfig(event.detail.value, event.detail.key)}
        >
        </data-source-selector-for-option>
      </div>
    `;
  };

  renderBasicComponent = () => {
    return html`
          <form-document-viewer .component=${this.component} .key=${this.key}>
          </form-document-viewer>
        `;
  };
}