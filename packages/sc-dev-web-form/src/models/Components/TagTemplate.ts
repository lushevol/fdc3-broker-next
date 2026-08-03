import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class TagTemplate extends FormMixin('Tag') {
  type = 'primary';
  mode = 'default';
  disabled: boolean;
  maxWidth: string;
  iconName: string;

  static from(obj?: object) {
    if (!obj) return new TagTemplate();

    const newInstance = new TagTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TagTemplate.from(obj);
  }

}
