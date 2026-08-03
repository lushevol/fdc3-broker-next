import { html, css, nothing } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { ComponentMixin } from '../../../utils/component-mixin.js';
import { Component } from '../../../../models/Component.js';

export class Grid1Column extends ComponentMixin(FormBaseViewer) {
 
  static styles = css`
    .title {
      margin-bottom: 1rem;
    }
    
    ${ScGridStyle}
  `;
  renderElement() {
    const { label, fluidLayout } = this.component.template;
    return html`
      <sc-grid-container ?fluid=${fluidLayout === 'full'}>
        <div class=title>${label}</div>
        <sc-grid-row>
          ${
  this.component.components?.map((component: Component, index: number) => index > 0 ? nothing : html`
              <sc-grid-column>
                ${
  this.generateComponent(component?.components, true, this.key, this.formData, this.component, this.readonly)
}
              </sc-grid-column>
            `)
}
        </sc-grid-row>
        </sc-grid-container>
      `;
  }
 
}