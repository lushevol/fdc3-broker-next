import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class CheckboxTemplate extends FormMixin('Checkbox Group') {
  direction: string;
  options = [{
    label: 'Checkbox 1',
    value: 'Checkbox1',
  }];
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new CheckboxTemplate();

    const newInstance = new CheckboxTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return CheckboxTemplate.from(obj);
  }
}
