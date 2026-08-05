import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class RichTextEditorTemplate extends FormMixin('Rich Text Editor') {
  toolbar: [];
  shortcut = true;
  tooltip: string;
  helpText: string;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new RichTextEditorTemplate();

    const newInstance = new RichTextEditorTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return RichTextEditorTemplate.from(obj);
  }
}
