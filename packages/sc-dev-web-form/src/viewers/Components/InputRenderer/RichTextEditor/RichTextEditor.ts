import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { Toolbars } from './RichTextEditorEditor.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class RichTextEditor extends FormBaseViewer {
  // Sync initial value to defaultValue on first render
  firstUpdated() {
    const { value, defaultValue } = this.template;
    // Get the true initial value from form data, 'value' prop, or 'defaultValue' prop
    const initialValue =
      this.formData?.find(d => d.id === this.component.id)?.value ||
      value ||
      defaultValue;

    // If an initial value exists but is not in defaultValue yet, sync it immediately
    if (initialValue && initialValue !== defaultValue) {
      this.component.updateTemplate('defaultValue', initialValue);
    }
  }

  // Use _onValueChange inherited from FormBaseViewer instead
  // _onValueChange(e: CustomEvent) {
  //   if (this.onValueChange) {
  //     this.onValueChange(e.detail.text);
  //   } else if (this._formAction?.onValueChange) {
  //     this._formAction?.onValueChange({
  //       detail: {
  //       value: e.detail.text,
  //       component: this.component
  //     }});
  //   }
  // }

  onRTEValueChange(event: CustomEvent) {
    const newValue = event.detail.text;

    // Update the defaultValue to update JSON view
    this.component.updateTemplate('defaultValue', newValue);

    // Call the standard _onValueChange to update the runtime formData
    this._onValueChange(event);

    // Request an update to ensure the parent re-renders if needed.
    this.requestUpdate();

    if (this.mode === 'edit') {
      this._formAction?.updateFormDefinition();
    }
  }

  renderElement() {
    const { toolbar, value, defaultValue, readonly, shortcut, label, labelSize, tooltip, helpText, disabled, required } = this.template;

    // Always read from formData first to ensure most up-to-date value is always displayed
    const currentValue =
    this.formData?.find((d: any) => d.id === this.component.id)?.value ||
    value ||
    defaultValue;

    return html`
      <sc-rich-text-editor-v2
        .toolbar=${toolbar || Toolbars}
        .value=${currentValue}
        @sc-change=${this.onRTEValueChange}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        ?shortcut=${shortcut}
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        help-text=${helpText}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-rich-text-editor-v2>
    `;
  }
}
