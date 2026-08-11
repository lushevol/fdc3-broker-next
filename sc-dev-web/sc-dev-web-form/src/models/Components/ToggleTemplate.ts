import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class ToggleTemplate extends FormMixin('Toggle') {
  size: string;
  options = [
    {
      label: 'Toggle 1',
      value: 'Toggle1',
    }, {
      label: 'Toggle 2',
      value: 'Toggle2',
    },
  ];
  labelSize = 'md';

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new ToggleTemplate();

    const newInstance = new ToggleTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ToggleTemplate.from(obj);
  }
}
