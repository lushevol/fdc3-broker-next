import { html } from 'lit';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { RepeaterBaseMixin } from './RepeaterBaseMixin.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import type { Component } from '../../../../models/Component.js';

export class RepeaterEditor extends RepeaterBaseMixin(ContainerBaseEditor) {
  connectedCallback() {
    super.connectedCallback();
    this._editor = true;
    this.requestUpdate();
  }
  
  repeat() {
    this._repeatTimes += 1;
    this.addNewGroup();
    this.onChange?.(this._repeatTimes, 'repeatTimes');
  }

  renderOtherGeneral = () => {
    const { buttonText } = this.component.template;
    return html`
      <div class=row>
        <sc-text-input
          label="Button text"
          value=${buttonText}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'buttonText')}
        >
        </sc-text-input>
      </div>
    `;
  };

  renderOtherBehavior = () => {
    const { readonly, disabled } = this.component.template;

    return html`
      <div class=row>
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
            label=Disabled
            ?checked=${disabled}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'disabled')}
          >
          </sc-switch>
        </div>
      </div>
      
    `;
  };

  updateAllRepeatGroup = (data: any) => {
    const newAddedComponent = data?.newComponent;
    if (newAddedComponent) {
      this.emptyArr.map((d: null, index: number) => {
        if (index > 0) {
          const _nc = this.component.addComponent(newAddedComponent.type)?.newComponent;
          _nc.id = `${_nc.id}_${index}`;
          _nc.repeatGroupIndex = index;
        }
      });
    }
  };

  deleteGroup(index: number) {
    if (this.component.components) {
      this.component.components = this.component.components.filter((c: Component) => c.repeatGroupIndex !== index);
      this._repeatTimes -= 1;
      this.onChange?.(this._repeatTimes, 'repeatTimes');
      this.requestUpdate();
    }
  }

  renderBasicComponent = () => {
    const { id } = this.component;
    const { label, type, buttonText } = this.component?.template ?? {};
    return html`
      ${this.emptyArr.map((d: null, index: number) => html`
        <sc-box class='repeater-box' type=${type || 'transparent'}>
          <div class='box-body' id="${id}">
            <div style='margin-bottom: 1rem'>
              <sc-label
                label="${label}"
                label-size=lg
              ></sc-label>
            </div>
            ${this.generateComponent(this.getComponentsByIndex(index))}
            ${renderDragDropZone(e => {
                this.onDrop(e, null, null, this.updateAllRepeatGroup);
              }, 
              this.dragDropState?._highlighting, 
              ()=> this.renderEmptyLabel(this.component))
            }
          </div>
          ${this.renderDeleteIcon(index)}
        </sc-box>`)
}
      <sc-button @click=${this.repeat}>${buttonText}</sc-button>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}