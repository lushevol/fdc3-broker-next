import { html, css, nothing } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';

export class Grid3Columns extends ComponentMixin(FormBaseViewer) {
 
  static styles = css`
    .title {
      margin-bottom: 1rem;
    }

    ${ScGridStyle}
  `;
  
  caculateColumns(value = '33-33-33', index: number) {
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
  
  renderElement() {
    const columnsLayout = this.component?.template?.columnsLayout;

    return html`
      <div class=title>${this.component.template.label}</div>
      <sc-grid-row ?no-gutters=${this.component?.template.noSpacing}>
        ${
  this.component.components?.map((component: Component, index: number) => index > 2 ? nothing : html`
            <sc-grid-column xs=${this.caculateColumns(columnsLayout, index)}>
              ${
  this.generateComponent(component?.components, true, this.key, this.formData, this.component, this.readonly, this.component?.template.noSpacing)
}
            </sc-grid-column>
          `)
}
      </sc-grid-row>
      `;
  }
 
}