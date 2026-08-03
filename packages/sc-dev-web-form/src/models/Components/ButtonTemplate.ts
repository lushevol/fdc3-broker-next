import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class ButtonTemplate extends FormMixin('Button') {

  type = 'primary';
  size = 'sm';

  static from(obj?: object) {
    if (!obj) return new ButtonTemplate();

    const newInstance = new ButtonTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ButtonTemplate.from(obj);
  }
}
