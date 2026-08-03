import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class EmployeeInputTemplate extends FormMixin('Employee Input') {
  options: [];

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new EmployeeInputTemplate();

    const newInstance = new EmployeeInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return EmployeeInputTemplate.from(obj);
  }
}
