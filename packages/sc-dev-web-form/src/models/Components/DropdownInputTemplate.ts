import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DropdownInputTemplate extends FormMixin('Dropdown Input') {
  options = [{
    label: 'Option 1',
    value: 'Option1',
  }];
  maxRow = true;
  readonlyRows = 3;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new DropdownInputTemplate();

    const newInstance = new DropdownInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DropdownInputTemplate.from(obj);
  }
}
