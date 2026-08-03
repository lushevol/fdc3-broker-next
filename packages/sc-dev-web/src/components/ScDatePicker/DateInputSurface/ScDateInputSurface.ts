import { LitElement, html } from 'lit';
import { scDatePickerName } from '../DatePicker/constants.js';
import { scDateInputName } from '../DateInput/constants.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { baseStyling, resetShadowRoot } from '../ScDatePicker.style.js';
import type { InferredFromSet } from '../typings.js';
import { DateInputSurfaceStyling } from './ScDateInputSurface.style.js';
import ScTheme from '../../../styles/ScTheme.js';

const alwaysOpenElementSet = new Set([
  scDateInputName,
  scDatePickerName,
]);

export class ScDateInputSurface extends ElementMixin(LitElement) {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    resetShadowRoot,
    DateInputSurfaceStyling,
  ]);

  close() {
    this.emit('sc-hide');
  }

  protected onBodyClick = (ev: MouseEvent) => {
    ev.stopPropagation();
    const elements =
      (ev.composedPath() as HTMLElement[])
        .filter(({ nodeType }) => nodeType === Node.ELEMENT_NODE);
    const shouldClose =
      elements.some(n => 
        (n.classList.contains('calendar-day') && !n.hasAttribute('aria-hidden')) ||
         n.classList.contains('action-bar')) ||
      !elements.some(
        n =>
          alwaysOpenElementSet.has(n.localName as InferredFromSet<typeof alwaysOpenElementSet>)
      );

    shouldClose && this.close();
  };

  render() {
    return html`<div class=surface-container part=container @click=${this.onBodyClick}><slot></slot></div>`;
  }
}
