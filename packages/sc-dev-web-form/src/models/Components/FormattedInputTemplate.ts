import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class FormattedInputTemplate extends FormMixin('Formatted Input') {
  format: string;
  blocks: string;
  delimiter: string;
  validationType: string;
  maxRow = true;
  readonlyRows = 3;

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new FormattedInputTemplate();

    const newInstance = new FormattedInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return FormattedInputTemplate.from(obj);
  }
}
