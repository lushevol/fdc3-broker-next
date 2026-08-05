import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class TextFieldTemplate extends FormMixin('Text Field') {
  maxLength: number;
  rows = 5;
  multiline: boolean;
  labelSize = 'md';
  maxRow = true;
  readonlyRows = 3;

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new TextFieldTemplate();

    const newInstance = new TextFieldTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TextFieldTemplate.from(obj);
  }
}
