import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class EmployeeMultiInputTemplate extends FormMixin('Employee Multi Input') {
  options: [];

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new EmployeeMultiInputTemplate();

    const newInstance = new EmployeeMultiInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return EmployeeMultiInputTemplate.from(obj);
  }
}
