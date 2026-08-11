import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class IconTemplate extends FormMixin('Icon') {
  name: string;
  size: string;

  static from(obj?: object) {
    if (!obj) return new IconTemplate();

    const newInstance = new IconTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return IconTemplate.from(obj);
  }

}
