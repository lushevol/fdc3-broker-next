import { html, nothing } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import '../../../FormEditor/ComponentEditor.js';
import type { Component } from '../../../../models/Component.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';

export class AccordionEditor extends ComponentMixin(ContainerBaseEditor) {
  
  renderStyleAndLayout = () => {
    const { labelSize } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Title size"
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

  renderBehavior = () => {
    const { open } = this.component?.template ?? {};
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Collapsed"
            ?checked=${!open}
            @sc-change=${(e: CustomEvent) => {
    this.onChange(!e.detail.checked, 'open');
    this.requestUpdate();
  }}
          >
          </sc-switch>
        </div>
      </div>
    `;
  };
  
  renderBasicComponent = () => {
    const { labelSize, open } = this.component?.template ?? {};
    return html`
      <sc-accordion 
        summary-line="0" 
        icon-position="right" 
        .labelSize=${labelSize}
        .open=${open} 
      >
        <div slot="summary" style='font-weight: 600'>
          ${
  this.component.template?.label
}
        </div>
        ${
  this.generateComponent(this.component.components, false, undefined, undefined)
}
        ${renderDragDropZone(this.onDrop, this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component))}
      </sc-accordion>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
    `;
  };
}