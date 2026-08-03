import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DateInputTemplate extends FormMixin('Date Input') {
  min: string;
  max: string;
  type = 'fixed';
  dynamicDate: object;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new DateInputTemplate();

    const newInstance = new DateInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DateInputTemplate.from(obj);
  }
}
