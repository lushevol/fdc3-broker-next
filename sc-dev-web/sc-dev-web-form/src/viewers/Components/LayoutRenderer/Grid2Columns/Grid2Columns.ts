import { html, css, nothing } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';

export class Grid2Columns extends ComponentMixin(FormBaseViewer) {
 
  static styles = css`
    .title {
      margin-bottom: 1rem;
    }

    ${ScGridStyle}
  `;

  caculateColumns(value: string, index: number) {
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

  renderElement() {
    const columnsLayout = this.component?.template?.columnsLayout || '50-50';

    return html`
      <div class=title>${this.component.template.label}</div>
      <sc-grid-row ?no-gutters=${this.component?.template.noSpacing}>
        ${
  this.component.components?.map((component: Component, index: number) => index > 1 ? nothing : html`
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