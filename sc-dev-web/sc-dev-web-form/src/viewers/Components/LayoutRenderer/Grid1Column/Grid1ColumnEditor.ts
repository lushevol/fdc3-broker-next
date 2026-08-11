import { html, nothing, css } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import GridColumnsStyle from '../style.js';

export class Grid1ColumnEditor extends ComponentMixin(ContainerBaseEditor) {

  renderStyleAndLayout = () => {
    const { fluidLayout } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-radio-group
          columns=2
          label="Layout"
          direction=horizontal
          value=${fluidLayout}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.value, 'fluidLayout');
  }}
        >
          <sc-radio value=full>Full</sc-radio>
          <sc-radio value=flex>Fixed</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  renderBasicComponent = () => {
    const { id, components, template } = this.component;
    const { label, fluidLayout } = template;
    const arr = [0];
    return html`
      <style>
        ${ScGridStyle}
        ${GridColumnsStyle}
      </style>
      <div class="grid-container">
        <sc-grid-container ?fluid=${fluidLayout === 'full'}>
          <div class=row>${label}</div>
          <sc-grid-row>
            ${
  arr.map((index: number) => index > 0 ? nothing : html`
                <sc-grid-column>
                  ${
  this.generateComponent(components?.[index]?.components)
}
                  ${renderDragDropZone((e: any) => this.onDrop(e, undefined, undefined, undefined, index), this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component, 0))}
                  
                </sc-grid-column>
              `)
} 
          </sc-grid-row>
        </sc-grid-container>
      </div>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
      `;
  };
}