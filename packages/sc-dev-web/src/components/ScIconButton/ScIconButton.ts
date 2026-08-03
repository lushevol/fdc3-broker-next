import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScIconButtonStyle from './ScIconButton.style.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-spinner.js';
import { ButtonBase } from '../ScButton/ButtonBase.js';

export class ScIconButton extends ButtonBase {
  static styles = ScTheme.getStyles().concat([ScIconButtonStyle]);

  @property({ type: String }) name = '';

  // @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property({ type: Boolean, attribute: 'no-pill' }) noPill = false;

  render() {
    this.type = this._getButtonType();
    
    const buttonClasses = classMap({
      ['sc-button']: true,
      ['sc-icon-button']: true,
      // ['no-border']: this.noBorder,
      //['loading']: this.loading,
      [`sc-icon-button-${this.size}`]: true,
      ['disabled']: this.disabled,
      ['pill']: !this.noPill,
    });
    return html`
      <sc-button 
        class='${buttonClasses}'
        ?no-pill=${this.noPill}
        .disabled=${this.disabled}
        type=${this.type}
        size=${this.size}
        state=${this.state}
        icon-button
      >
        <sc-icon .name=${this.name} size=${this.size} ></sc-icon>
      </sc-button>
    `;
  }
}
