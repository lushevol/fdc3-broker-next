import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class Switch extends FormBaseViewer {
 
  renderElement() {
    const { 
      label,
      tooltip,
      value, 
      defaultValue,
      placeholder, 
      helpText, 
      borderType = 'line', 
      disabled, 
      readonly, 
      required,
      labelPosition = 'right',
      size,
      labelSize,
    } = this.template;
    const labelClassElement = this.shadowRoot
      ?.querySelector('sc-switch')
      ?.shadowRoot?.querySelector('sc-label')
      ?.shadowRoot?.querySelector('.label') as HTMLElement;
    if (labelClassElement) {
      const colorValue = 'var(--sc-checkbox-font-color, var(--sc-color-blue-900))';
      labelPosition === 'top'
        ? labelClassElement.style.removeProperty('color')
        : labelClassElement.style.setProperty('color', colorValue);
    }
    
    return html`
      <sc-switch
        label=${label}
        tooltip=${tooltip}
        ?checked=${value !== undefined ? value : defaultValue}
        placeholder=${placeholder}
        border-type=${borderType}
        @sc-change=${(e: CustomEvent) => this.onValueChange?.(e.detail.checked)}
        ?readonly=${readonly || this.readonly}
        ?disabled=${disabled}
        ?required=${required}
        size=${size}
        .labelPosition=${labelPosition}
        label-size=${labelSize}
      >
        <div slot="help">${unsafeHTML(helpText)}</div>
      </sc-switch>
    `;
  }
 
}