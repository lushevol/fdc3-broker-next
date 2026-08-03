import { html, nothing, css } from 'lit';
import type { ValueChangeFunction } from '../../../../shared/formTypes.js';
import { ContainerBaseEditor } from '../../common/ContainerBaseEditor.js';
import { renderDragDropZone } from '../../../utils/DragDropZone.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import GridColumnsStyle from '../style.js';
export class Grid3ColumnsEditor extends ComponentMixin(ContainerBaseEditor) {

  renderStyleAndLayout = () => {
    const { columnsLayout = '33-33-33', noSpacing } = this.component?.template ?? {};
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
          <sc-radio value='33-33-33'>33-33-33</sc-radio>
          <sc-radio value='50-25-25'>50-25-25</sc-radio>
          <sc-radio value='25-50-25'>25-50-25</sc-radio>
          <sc-radio value='25-25-50'>25-25-50</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };

  caculateColumns(value: string, index: number) {
    if (value === '33-33-33') {
      return 4;
    }
    if (value === '25-25-50') {
      return index === 2 ? 6 : 3;
    }
    if (value === '50-25-25') {
      return index === 0 ? 6 : 3;
    }
    if (value === '25-50-25') {
      return index === 1 ? 6 : 3;
    }
  }

  renderBasicComponent = () => {
    const { components, template } = this.component;
    const label = template?.label;
    const columnsLayout = template?.columnsLayout || '33-33-33';
    const arr = [0, 1, 2];
    return html`
      <style>
        ${ScGridStyle}
        ${GridColumnsStyle}
      </style>
      <div class="grid-container">
        <div class=row>${label}</div>
        <sc-grid-row no-gutters>
          ${
  arr.map((index: number) => index > 2 ? nothing : html`
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