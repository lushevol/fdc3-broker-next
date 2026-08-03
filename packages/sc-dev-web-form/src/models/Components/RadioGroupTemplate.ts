import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class RadioGroupTemplate extends FormMixin('Radio Group') {
  direction: string;
  options = [{
    label: 'Radio 1',
    value: 'Radio1',
  }];
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new RadioGroupTemplate();

    const newInstance = new RadioGroupTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return RadioGroupTemplate.from(obj);
  }
}
