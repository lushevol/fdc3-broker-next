import { html, nothing, css } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import GridColumnsStyle from '../style.js';

export class Grid2ColumnsEditor extends ComponentMixin(ContainerBaseEditor) {

  renderStyleAndLayout = () => {
    const { columnsLayout = '50-50', noSpacing } = this.component?.template ?? {};
    return html`
      <div class=row>
        <sc-checkbox 
          ?checked=${!!noSpacing}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.checked ? [{}] : undefined, 'noSpacing');
  }}
        >
          No padding
        </sc-checkbox>
      </div>
      <div class=row>
        <sc-radio-group
          columns=2
          direction=horizontal
          label="Layout"
          value=${columnsLayout}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'columnsLayout')}
        >
          <sc-radio value='50-50'>50-50</sc-radio>
          <sc-radio value='25-75'>25-75</sc-radio>
          <sc-radio value='75-25'>75-25</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  caculateColumns(value = '50-50', index: number) {
    if (value === '50-50') {
      return 6;
    }
    if (value === '25-75') {
      return index === 0 ? 3 : 9;
    }
    if (value === '75-25') {
      return index === 0 ? 9 : 3;
    }
  }

  renderBasicComponent = () => {
    const { id, components, template } = this.component;
    const label = template?.label;
    const columnsLayout = template?.columnsLayout;
    const arr = [0, 1];
    return html`
      <style>
        ${ScGridStyle}
        ${GridColumnsStyle}
      </style>
      <div class="grid-container">
        <div class=row>${label}</div>
        <sc-grid-row no-gutters>
          ${
  arr.map((index: number) => index > 1 ? nothing : html`
                <sc-grid-column xs=${this.caculateColumns(columnsLayout, index)}>
                  ${
  this.generateComponent(components?.[index]?.components, undefined, undefined, undefined, undefined, undefined, !template.noSpacing)
}
                  ${renderDragDropZone((e: any) => this.onDrop(e, undefined, undefined, undefined, index), this.dragDropState?._highlighting, ()=> this.renderEmptyLabel(this.component, index))}
                </sc-grid-column>
            `)
} 
        </sc-grid-row>
      </div>
      <div class=${this.component?.alignment}>
        ${this.renderConditionIcon()}
        ${this.renderHiddenIcon()}
        ${this.renderCommentsIcon()}
      </div>
      `;
  };
}