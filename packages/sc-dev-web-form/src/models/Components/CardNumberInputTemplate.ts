import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class CardNumberInputTemplate extends FormMixin('Card Number Input') {
  size = 'md';
  iconSize = 'md';
  textAlign = 'left';
  maxLength = 16;
  borderType = 'box';
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new CardNumberInputTemplate();

    const newInstance = new CardNumberInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return CardNumberInputTemplate.from(obj);
  }
}
