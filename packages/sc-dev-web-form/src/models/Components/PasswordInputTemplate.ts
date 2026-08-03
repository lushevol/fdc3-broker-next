import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class PasswordInputTemplate extends FormMixin('Password Input') {

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new PasswordInputTemplate();

    const newInstance = new PasswordInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return PasswordInputTemplate.from(obj);
  }
}
