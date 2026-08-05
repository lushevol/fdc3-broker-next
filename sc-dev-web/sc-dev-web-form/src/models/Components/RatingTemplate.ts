import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class Option {
  label: string;
  value: any;
}

export class RatingTemplate extends FormMixin('Rating') {
  mode = 'default';
  max = 5;
  size = 'sm';
  options: Option[] = [];
  optionLabel: string[] = ['Least likely','Most likely'];

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new RatingTemplate();

    const newInstance = new RatingTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return RatingTemplate.from(obj);
  }
}
