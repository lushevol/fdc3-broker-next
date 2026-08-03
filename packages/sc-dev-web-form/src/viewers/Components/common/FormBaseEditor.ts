import { html } from 'lit';
import { consume } from '@lit/context';
import { state } from 'lit/decorators.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { formContext } from '../../contexts/form-context.js';
import { BaseEditor } from './BaseEditor.js';
import '../common/PrefillAnswer.js';
export class FormBaseEditor extends BaseEditor {

  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @state() 
    formDefinition: FormDefinition;

  @state() _populate = false;

  renderOtherGeneral: any = () => {
    const { helpText, placeholder } = this.component?.template ?? {};
    return html`
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
      <div class=row>
        <sc-text-input
          label="Placeholder"
          value=${placeholder}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'placeholder')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderBehavior: any = () => {
    const { required, disabled, readonly, hidden } = this.component?.template ?? {};
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

  updatePopulatorComponent(referrenceId: string, currentId: string) {
    this.page?.getComponent(referrenceId)?.updatePopulators(currentId);
  }

  renderTooltip: any = () => {
    const { tooltip } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-text-input
          label="Tooltip"
          value=${tooltip}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'tooltip')}
        >
        </sc-text-input>
      </div>
    `;
  };

  getFilterOption(_options: any) {
    const filteredOptions = _options.filter((option: any) => ((option.id || option.name) || (option.id || option.title)  || (option.label || option.value)));
    if (filteredOptions.length !== _options.length) {
      return filteredOptions;
    }
    return _options;
  }
}