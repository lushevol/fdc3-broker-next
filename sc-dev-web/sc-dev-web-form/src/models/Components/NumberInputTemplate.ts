import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class NumberInputTemplate extends FormMixin('Number Input') {
  min: number;
  max: number;
  type = 'number';
  maxDecimals = 0;
  labelSize = 'md';
  
  constructor(min?: number, max?: number) {
    super();
    this.min = min !== undefined ? min : this.min;
    this.max = max !== undefined ? max : this.max;
  }

  get isValid() {
    let valid = true;
    const minValid = !this.min || !isNaN(this.min);
    const maxValid = !this.max || !isNaN(this.max);
    const minMaxValid =
      this.min === undefined ||
      this.max === undefined ||
      this.min <= this.max;
    valid = minValid && maxValid && minMaxValid;
    return valid;
  }

  static from(obj?: object) {
    if (!obj) return new NumberInputTemplate();

    const newInstance = new NumberInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return NumberInputTemplate.from(obj);
  }
}
