import { html } from 'lit';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';

export class Button extends FormBaseViewer {
 
  handleClick(e: MouseEvent) {
    const { event } = this.template;
    if (event === 'goNext') {
      if (this.selectedPage) {
        const { pages } = this.formDefinition;
        const index = pages.findIndex(page => page.id === this.selectedPage.id);
        if (index > -1) {
          const page = pages[index + 1];
          if (page) {
            this._formAction.updateSelectedPage(page.id);
          }
        }
      }
    }
    this.emit('button-click', {
      detail: {
        type: event,
        target: e.target,
      },
    });
  }

  renderElement() {
    const { label, type, size } = this.template;
    return html`
      <sc-button type=${type} size=${size} @click=${this.handleClick}>
        ${label}
      </sc-button>
    `;
  }
 
}