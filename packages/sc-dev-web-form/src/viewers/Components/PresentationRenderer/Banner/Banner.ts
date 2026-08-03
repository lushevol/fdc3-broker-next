import { html, PropertyValues } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Banner extends FormBaseViewer {
 
  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.updateInnerHTML();
  }

  updateInnerHTML() {
    const { body = '' } = this.template;
    const dom = this.shadowRoot?.querySelector('.bannerBody');
    if (dom) {
      dom.innerHTML = body;
    }
  }

  renderElement() {
    this.updateInnerHTML();
    const { label, titleSize = 'xl', bodySize = 'sm', spaceSize = 'md', backgroundColor = 'gradient-blue', textAlignment = 'left', imageSrc, imagePosition = 'right' } = this.template;
    return html`
      <sc-banner
        title=${label}
        .titleSize=${titleSize}
        .bodySize=${bodySize}
        .spaceSize=${spaceSize}
        .backgroundColor=${backgroundColor}
        .textAlignment=${textAlignment}
        .imageSrc=${imageSrc}
        .imagePosition=${imagePosition}
      >
        <div class="bannerBody" slot=body></div>
      </sc-banner>
    `;
  }
 
}