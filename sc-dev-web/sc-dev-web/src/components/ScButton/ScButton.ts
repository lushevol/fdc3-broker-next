import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import ScTheme from '../../styles/ScTheme.js';
import { HasSlotController } from '../../shared/slot.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-spinner.js';
import ScButtonStyle from './ScButton.style.js';
import { ButtonBase } from './ButtonBase.js';
import { ICON_ALIGN } from '../../shared/util.js';
import { iconPosConverter, widthConverter } from '../../shared/converter.js';

/**
 * Wraps a `<button>` with a skeleton state, some modes and a delay mechanism.
 *
 * ## Details
 *
 * @attribute `type` defines the UI _mode_ of the button, the value are:`primary`, `secondary`, `text` and `link`,
 * default is empty.
 * @attribute `state` defines the UI _state_ of the button, the value are:`normal`, and `error`,
 * default is empty.
 * @attribute `size` defines the size of the button, the value are: `xxs`, `xs`, `sm`, `md`, `lg`,
 * default value is `md`.
 * @attribute `leftIcon` defines whether to show the icon in the leftside of button.
 * @attribute `rightIcon` defines whether to show the icon in the rightside of button.
 * 
 * @slot - The content of the button (text or HTML).
 */
export class ScButton extends ButtonBase {
  static styles = ScTheme.getStyles().concat([ScButtonStyle]);

  static get scopedElements() {
    return {
      'sl-button': SlButton,
    };
  }

  @property({ converter: widthConverter }) width = 'auto';

  @property({ type: String, attribute: 'left-icon' }) leftIcon: string | null = null;

  @property({ type: String, attribute: 'right-icon' }) rightIcon: string | null = null;

  @property({ type: Boolean, attribute: 'no-pill' }) noPill = false;

  @property({ type: Boolean }) compact = false;

  @property({ type: Boolean }) snack = false;
   
  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false; 

  @property({ type: Boolean }) truncate = false;

  /** Enable selected visual indicator. `selected` will be true when clicked or toggled. */
  @property({ 
    converter: {
      fromAttribute: v => v === 'toggle' ? v : v !== null && v !== 'false',
    },
  }) 
  selectable: boolean | string = false;

  /** Visual indicator that the button has already been clicked. Can be reset by toggle or removing attribute */
  @property({ type: Boolean, reflect: true }) selected = false;

  /*removed loadingText prop by Designer*/
  //@property({ type: String, attribute: 'loading-text' }) loadingText = '';

  //private readonly hasSlotController = new HasSlotController(this, 'title');

  handleClick(e: any) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation(); 
       return;
    }
    if (this.selectable) {
      return this.selected = this.selectable === 'toggle' ? !this.selected : true;
    }
    return null;
  }
  handleMouseDown(e:any) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation(); 
      return;
    }
  }

  render() {
    this.type = this._getButtonType();

    // const hasLoadingText =
    //   this.loadingText.length > 0 || this.hasSlotController.test('loading');
    const buttonClasses = classMap({
      ['sc-button']: true,
      ['sc-button-pill']: !this.noPill,
      [`sc-button-${this.type}`]: true,
      [`sc-button-state-${this.state}`]: !this.disabled,
      ['sc-button-disabled']: this.disabled,
      ['sc-button-loading']: this.loading,
      //['sc-button-fill']: this.fill,
      ['sc-button-inverse']: this.inverse,
      ['sc-button-compact']: this.compact,
      [`sc-button-size-${this.size}`]: true,
      ['sc-icon-button']: this.iconButton,
      ['sc-button-snack']: this.snack,
      ['sc-button-no-border']: this.noBorder,
      'sc-truncate': this.truncate,
      'sc-selected': this.selectable && this.selected,
    });

    /*compatible with before logic*/
    const extraStyle = this.getLoadingExtraStyles(!!this.leftIcon);
    return html`
      <sl-button
        class="${buttonClasses}"
        .disabled="${this.disabled}"
        style="--sc-button-self-width: ${this.width};"
        @mousedown=${this.handleMouseDown}
        @click=${this.handleClick}
      > 
        ${this.loading
          ? html`
              <div class="sc-button-spinner-wrapper" slot="prefix" style="${extraStyle}">
                <sc-spinner 
                  size=${this.getSpinnerSize()}
                  color=${this.getSpinnerColor()}
                >
                </sc-spinner>
                ${this.leftIcon ? 
                html `
                  <sc-icon
                    class="sc-button-icon-left"
                    name="${this.leftIcon}"
                    size="${this.size}"
                  ></sc-icon>` : ''
                }
              </div>
            `
          : this.leftIcon 
              ? html`
                  <sc-icon
                    class="sc-button-icon-left"
                    slot="prefix"
                    name="${this.leftIcon}"
                    size="${this.size}"
                  ></sc-icon>
                `
              : null}
        <slot>Button</slot>
        ${this.rightIcon
          ? html`
              <sc-icon
                class="sc-button-icon-right"
                slot="suffix"
                name="${this.rightIcon}"
                size="${this.size}"
              >
              </sc-icon>
            `
          : null}
      </sl-button>
    `;
  }
}
