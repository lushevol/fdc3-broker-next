import { ScButton } from '../../ScButton/ScButton.js';

import { ElementMixin } from '../mixins/element-mixin.js';
import { yearGridButtonStyling } from './ScYearGridButton.style.js';

export class ScYearGridButton extends ElementMixin(ScButton) {
  static styles = [
    yearGridButtonStyling,
  ];
}
