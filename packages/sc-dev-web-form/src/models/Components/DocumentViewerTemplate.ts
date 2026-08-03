import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DocumentViewerTemplate extends FormMixin('Document Viewer') {
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new DocumentViewerTemplate();

    const newInstance = new DocumentViewerTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DocumentViewerTemplate.from(obj);
  }
}
