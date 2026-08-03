import { html, css, nothing, PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import { watch } from '../../../utils/watch.js';
// @ts-ignore
import GridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import DynamicDisplayStyle from './DynamicDisplay.style.js';
import '../../common/PrefillAnswer.js';

export class DynamicDisplayEditor extends ComponentMixin(ContainerBaseEditor) {
 
  static styles = css`
    ${GridStyle}
    ${DynamicDisplayStyle}
  `;

  @state() _collapsed = false;

  @state() _staticHeader = false;

  @state() _componentsHeight: number;

  @watch('component')
  updateState() {
    if (this.component?.template?.collapsed !== undefined) {
      this._collapsed = this.component.template.collapsed;
    }
    if (this.component?.template?.staticHeader !== undefined) {
      this._staticHeader = this.component.template.staticHeader;
    }
    if (this.component?.components?.length && !this._collapsed) {
      this.updateComplete.then(() => {
        const element = this.shadowRoot?.querySelector('.dynamic-components') as any;
        element?.style?.setProperty('height', 'auto');
        this._componentsHeight = element?.clientHeight;
      });
    }
  }
  
  renderLabel: any = () => {
    const { label } = this.component?.template ?? {};
    if (!this._staticHeader) return nothing;
    return html`
      <div class=row>
        <sc-text-input
          label="Label"
          value=${label}
          border-type="box"
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'label')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderOtherGeneral = () => {
    const { type } = this.component.template;
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Type"
          value=${type}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'type')}
        >
          ${
  ['default', 'info', 'success', 'warning', 'error', 'disabled', 'transparent'].map(
    (type: string) => html`<sc-radio value=${type}><span class="text-capitalize">${type}</span></sc-radio>`
  )
}
        </sc-radio-group>
      </div>
      <!-- <div class=row>
        <sc-switch
          label="Static header"
          ?checked=${this._staticHeader}
          @sc-change=${(e: CustomEvent) => {
    this._staticHeader = e.detail.checked;
    this.onChange(e.detail.checked, 'staticHeader');
  }}
        >
        </sc-switch>
      </div> -->
    `;
  };

  renderBehavior = () => {
    return html`
      <div class=row>
        <sc-switch
          label="Collapsed"
          ?checked=${this._collapsed}
          @sc-change=${async (e: CustomEvent) => {
    this.onChange(e.detail.checked, 'collapsed');
    this._collapsed = e.detail.checked;
  }}
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

  renderArrowIcon() {
    return html`
      <div class=round @click=${() => {
    this._collapsed = !this._collapsed;
  }}>
        <sc-icon name=${this._collapsed ? 'arrow-ios-downward' : 'arrow-ios-upward'}></sc-icon>
      </div>
    `;
  }

  renderBasicComponent = () => {
    const { id, components } = this.component;
    const { defaultValue, value, label, staticHeader, type } = this.component?.template ?? {};
    return html`
      <div 
        class='dynamic-display-container sc-box-type-${type}'
        style='margin-left: -0.375rem; margin-right: -0.375rem;'
        id="${id}"
      >
        <div>
          <div class="dynamic-header">
            ${ defaultValue || label || 'Dynamic Header'}
          </div>
        </div>
        <div class="dynamic-components" style="height: ${this._collapsed ? 0 : this._componentsHeight}px">
          ${this.generateComponent(components)}
          ${renderDragDropZone(this.onDrop, this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component))}
        </div>
        ${components?.length ? this.renderArrowIcon() : nothing}
      </div>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}