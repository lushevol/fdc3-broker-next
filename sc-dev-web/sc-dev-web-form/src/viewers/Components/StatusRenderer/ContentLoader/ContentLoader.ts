import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class ContentLoader extends FormBaseViewer {
 
  renderElement() {
    const { type, height, radius } = this.template;
    return html`
      <sc-content-loader
        type=${type}
        radius=${type === 'square' ? radius : 'sm'}
        .height=${height}
      >
      </sc-content-loader>    
    `;
  }
}