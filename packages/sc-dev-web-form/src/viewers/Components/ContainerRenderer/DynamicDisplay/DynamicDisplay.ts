import { html, css, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { watch } from '../../../utils/watch.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import DynamicDisplayStyle from './DynamicDisplay.style.js';

export class DynamicDisplay extends ComponentMixin(FormBaseViewer) {
 
  @state() _collapsed = false;

  @state() _clicked = false;

  @state() _componentsHeight: string;

  @watch('component')
  updateState() {
    if (this.component?.template?.collapsed !== undefined) {
      this._collapsed = this.component.template.collapsed;
      if (this._collapsed) {
        setTimeout(() => {
          const element = this.shadowRoot?.querySelector('.dynamic-components div') as any;
          this._componentsHeight = element?.clientHeight;
        });
      }
    }
  }

  static styles = css`
    ${GridStyle}
    ${DynamicDisplayStyle}
  `;

  renderArrowIcon() {
    return html`
      <div class=round @click=${async () => {
    this._clicked = true;
    await this.updateComplete;
    this._collapsed = !this._collapsed;
    const element = this.shadowRoot?.querySelector('.dynamic-components') as any;
    const height = element.clientHeight;
    if (this._collapsed) {
      this._componentsHeight = height;
      element.style.setProperty('height', `${height}px`);
      setTimeout(() => { element.style.setProperty('height', 0); }, 0);
    } else {
      element.style.setProperty('height', 0);
      setTimeout(() => { element.style.setProperty('height', `${this._componentsHeight}px`); }, 0);
      setTimeout(() => { element.style.setProperty('height', 'auto'); }, 300);
    }
  }}>
        <sc-icon name=${this._collapsed ? 'arrow-ios-downward' : 'arrow-ios-upward'}></sc-icon>
      </div>
    `;
  }

  renderElement() {
    const { id, components } = this.component;
    const { value, defaultValue, label, staticHeader = true, type } = this.component?.template ?? {};
    return html`
        <div class='dynamic-display-container sc-box-type-${type} preview' id="${id}">
          <div>
            <div class="dynamic-header">
              ${staticHeader ? label : (value || defaultValue)}
            </div>
          </div>
          <div class="row dynamic-components" style=${this._collapsed && !this._clicked ? 'height: 0' : ''}>
            ${
  this.generateComponent(this.component.components, true, this.key, this.formData, this.component, this.readonly)
}
          </div>
          ${components?.length ? this.renderArrowIcon() : nothing}
        </div>
      `;
  }
 
}