import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';
import type { Size } from '../../shared/typing.js';

export class FileInputTemplate extends FormMixin('File Input') {
  accept: string;
  direction: string;
  maxSize: number;
  width: string;
  iconSize: Size;
  noIcon: boolean;
  noBorder: boolean;
  multiple: boolean;
  selectable = true;
  deletable = true;
  link: string;
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new FileInputTemplate();

    const newInstance = new FileInputTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return FileInputTemplate.from(obj);
  }
}
