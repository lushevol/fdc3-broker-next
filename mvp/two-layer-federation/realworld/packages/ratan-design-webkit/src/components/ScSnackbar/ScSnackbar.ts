import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { AnimateAlertBase } from '../common/AnimateAlertBase/AnimateAlertBase.js';
import ScSnackbarStyle from './ScSnackbar.style.js';
import '../../../elements/sc-divider.js';
import '../../../elements/sc-icon.js';

export class ScSnackbar extends AnimateAlertBase {

  static styles = super.styles.concat([ScSnackbarStyle]);
  //@ts-ignore
  @property({ type: String })
    placement: 'top' | 'bottom' = 'top';

  get iconName() {
    let name;
    switch (this.type) {
      case 'info':
        name = 'info-circle--fill';
        break;
      case 'disabled':
        name = 'denied';
        break;
      case 'warning':
        name = 'alert-triangle--fill';
        break;
      case 'error':
        name = 'alert-circle--fill';
        break;
      case 'success':
      default:
        name = 'checkmark-circle--fill';
        break;
    }
    return name;
  }

  renderIcon() {
    if (this.type === 'loading') {
      return html`<sc-spinner size="sm" ></sc-spinner>`;
    } else {
      const typeIconClasses = classMap({
        ['type-icon']: true,
        [`${this.type}`]: true,
      });
      return html`
        <sc-icon
          class='${typeIconClasses}'
          name='${this.iconName}'
          size='sm'
        ></sc-icon>
      `;
    }
  }

  renderCloseIcon() {
    return html`
      <sc-icon name='cross' size='sm' class="close-icon"></sc-icon>
    `;
  }

  renderDelimiter() {
    return this.closable ? html`
      <slot name='delimiter'><sc-divider compact line-height='xxl'></sc-divider></slot>
    ` : html``;
  }

  formatAction(): void {
    this.actionButtons.forEach(item => {
      item.size = 'xxs';
      item.style = 'height:100%';
      item.noPill = true;
      item.snack = true;
    });
  }

  classes() {
    return 'sc-snackbar';
  }
}
