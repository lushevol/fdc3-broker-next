import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Image extends FormBaseViewer {
 
  openLink() {
    const { link, target } = this.template;
    window.open(link, target);
  }

  renderElement() {
    const { alt, width, height, src, link } = this.template;
    if (!src) {
      return html`
      <style>
      .image_container{
        background-color: var(--sc-color-grey-50);
        padding:1rem 0;
        text-align:center;
      }
      </style>
      <div class="image_container"><sc-icon name="image-fill" size="lg" style="color:var(--sc-label-color, var(--sc-color-grey-650))"></sc-icon></div>
      `;
    }
    return html`
      <img
        alt=${alt}
        width=${width || '100%'}
        height=${height}
        src=${src}
        @click=${link ? this.openLink : null}
        style='cursor: ${link ? 'pointer' : 'default'}'
      >
      </img>
    `;
  }
 
}