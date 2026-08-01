import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { BUTTON_STATE, BUTTON_TYPE, SIZE } from '../../shared/util.js';
import { btnTypeConverter, sizeConverter, stateConverter } from '../../shared/converter.js';
export class ButtonBase extends ScopedElementsMixin(LitElement) {
  @property({ converter: btnTypeConverter }) type: `${BUTTON_TYPE}` = BUTTON_TYPE.default;

  @property({ converter: sizeConverter }) size: `${SIZE}` = SIZE.sm;

  @property({ converter: stateConverter }) state: `${BUTTON_STATE}` = BUTTON_STATE.default;

  @property({ type: Boolean }) fill = false;

  @property({ type: Boolean }) inverse = false;

  @property({ type: Boolean }) loading = false;
  
  @property({ type: Boolean }) disabled = false;  
  
  @property({ type: Boolean }) readonly = false;  

  @property({ type: Boolean, attribute: 'icon-button' }) iconButton = false;  

  protected _getButtonType() {
    /*compatible with legacy button type*/
    if (this.fill) {
      return BUTTON_TYPE.default;
    }
    return this.type as BUTTON_TYPE;
  }
  
  getSpinnerSize() {
    let spinnerSize;
    //offset spinner size
    switch (this.size) {
      // case 'lg':
      //   spinnerSize = 'md';
      //   break;
      default:
        spinnerSize = this.size;
        break;
    }
    return spinnerSize;
  }

  getSpinnerColor() {
    let spinnerColor;
    switch (this.type) {
      case 'primary':
        spinnerColor = 'white';
        break;
      default:
        spinnerColor = 'deepBlue';
        break;
    }
    return spinnerColor;
  }
  
  getLoadingExtraStyles(hasLeftIcon: boolean) {
    let gap = 0, marginRight = 0;
    switch (this.size) {
      case 'lg':
        gap = 0.75;
        marginRight = 0.75;
        break;
      case 'md':
        gap = 0.5;
        marginRight = 0.5;
        break;
      case 'sm':
        gap = 0.5;
        marginRight = 0.275;
        break;
      case 'xs':
        gap = 0.3;
        marginRight = 0.25;
        break;
      case 'xxs':
        gap = 0.3;
        marginRight = 0.15;
        break;
      default:
        gap = 0.5;
        marginRight = 0.5;
        break;
    }
    return hasLeftIcon ? `gap: ${gap}rem;` : `margin-right: ${marginRight}rem;`;
  }
}

