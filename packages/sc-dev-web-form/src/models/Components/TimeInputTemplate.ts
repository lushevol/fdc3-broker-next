import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class TimeInputTemplate extends FormMixin('Time Input') {
  format: string;
  seconds: boolean;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
  disabledHours: [];
  disabledMinutes: [];
  disabledSeconds: [];
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new TimeInputTemplate();

    const newInstance = new TimeInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TimeInputTemplate.from(obj);
  }
}
