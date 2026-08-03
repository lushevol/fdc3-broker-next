import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class ProgressBarTemplate extends FormMixin('ProgressBar') {
  type: string;
  size: string;
  value: string;
  indeterminate: boolean;
  showLabel: boolean;

  static from(obj?: object) {
    if (!obj) return new ProgressBarTemplate();

    const newInstance = new ProgressBarTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ProgressBarTemplate.from(obj);
  }

}
