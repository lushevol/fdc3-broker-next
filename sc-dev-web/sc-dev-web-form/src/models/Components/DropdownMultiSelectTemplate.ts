import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DropdownMultiSelectTemplate extends FormMixin('Dropdown Multi Select') {
  value: [];
  options = [{
    label: 'Option 1',
    value: 'Option1',
  }];
  multipleRows = false;
  maxRows = false;
  selectAll = false;
  readonlyRows = 3;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new DropdownMultiSelectTemplate();

    const newInstance = new DropdownMultiSelectTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DropdownMultiSelectTemplate.from(obj);
  }
}
