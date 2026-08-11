import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DateRangeInputTemplate extends FormMixin('Date Range Input') {
  min: string;
  max: string;
  type = 'fixed';
  dynamicDate: object;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new DateRangeInputTemplate();

    const newInstance = new DateRangeInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DateRangeInputTemplate.from(obj);
  }
}
