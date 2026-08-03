import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class SwitchTemplate extends FormMixin('Switch') {
  size = 'sm';
  labelSize = 'lg';
  checked: boolean;

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new SwitchTemplate();

    const newInstance = new SwitchTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return SwitchTemplate.from(obj);
  }
}
