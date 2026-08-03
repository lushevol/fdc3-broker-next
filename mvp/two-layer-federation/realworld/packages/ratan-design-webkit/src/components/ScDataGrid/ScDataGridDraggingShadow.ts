import { html } from 'lit';
import { PopupMixin } from '../../mixins/popup-mixin.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridDraggingShadow.style.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-button.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import { property } from 'lit/decorators.js';

export class ScDataGridDraggingShadow extends StyleToolMixin(classNamePrefix)(
  PopupMixin(ScElement)
) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({ type: String })
  label?: any;

  updateDraggingShadowPosition(clientX: number, clientY: number) {
    const adjustedRect = new DOMRect(clientX, clientY, 100, 0);
    this.setVirtualAnchor({
      getBoundingClientRect() {
        return adjustedRect;
      },
    });
  }

  render() {
    this.popupElement;
    return html`
      <sl-popup placement="bottom" strategy="fixed" flip distance="8">
        <div class=${this.makeClassName('label')}>${this.label}</div>
      </sl-popup>
    `;
  }
}
