import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { AnimateAlertBase } from '../common/AnimateAlertBase/AnimateAlertBase.js';
import ScToastStyle from './ScToast.style.js';
import '../../../elements/sc-icon.js';

export class ScToast extends AnimateAlertBase {

  static styles = super.styles.concat([ScToastStyle]);

  @property({ type: String })
    placement: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'top-right';

  @property({ type: String }) title = '';

  @property({ type: Number, converter: value => value }) rows: string | number = 3;

  get iconName() {
    let name;
    switch (this.type) {
      case 'info':
        name = 'info-circle--line';
        break;
      case 'disabled':
        name = 'denied';
        break;
      case 'warning':
        name = 'alert-triangle--line';
        break;
      case 'error':
        name = 'alert-circle--line';
        break;
      case 'success':
      default:
        name = 'checkmark-circle--line';
        break;
    }
    return name;
  }

  setDuration() {
    if (this.duration < Infinity) {
      this.style.setProperty('--sc-animation-duration', `${this.duration}ms`);
    } else {
      this.style.setProperty('--sc-animation-duration', '0ms');
      this.style.setProperty('--sc-animation-to', '100%');
    }
  }

  renderIcon() {
    const typeIconClasses = classMap({
      ['type-icon']: true,
      [`${this.type}`]: true,
    });
    return html`
      <sc-icon
        class='${typeIconClasses}'
        name='${this.iconName}'
        size='lg'
      ></sc-icon>
    `;
  }

  renderMessage() {
    return html`
      <div class='sc-toast-title'>
        <slot name='title'>${this.title}</slot>
      </div>
      <div class='sc-toast-body' style=${this.rows === 'auto' ? '' : `-webkit-line-clamp: ${this.rows}`}>
        <slot></slot>
      </div>
    `;
  }

  renderCloseIcon() {
    return html`
      <sc-icon name='cross' size='lg'></sc-icon>
    `;
  }

  formatAction(): void {
    this.actionButtons.forEach(item => {
      item.remove();
    });
  }

  classes() {
    return 'sc-toast';
  }
}
