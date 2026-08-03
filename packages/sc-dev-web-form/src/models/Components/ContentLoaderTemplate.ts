import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class ContentLoaderTemplate extends FormMixin('ContentLoader') {
  type: string;
  height: string;
  radius = 'none';

  static from(obj?: object) {
    if (!obj) return new ContentLoaderTemplate();

    const newInstance = new ContentLoaderTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ContentLoaderTemplate.from(obj);
  }

}
