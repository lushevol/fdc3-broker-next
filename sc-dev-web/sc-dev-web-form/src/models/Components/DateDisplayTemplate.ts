import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DateDisplayTemplate extends FormMixin('Date display') {
  dateType = 'full-date';
  showTime = false;
  timeOnly = false;
  hideSeconds = false;
  showTimezone = false;
  size = 'md';
  defaultValue: string;
  value: string;

  static from(obj?: object) {
    if (!obj) return new DateDisplayTemplate();

    const newInstance = new DateDisplayTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DateDisplayTemplate.from(obj);
  }
}