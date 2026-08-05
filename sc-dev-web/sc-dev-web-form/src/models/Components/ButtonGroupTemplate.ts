import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class ButtonGroupTemplate extends FormMixin('Button Group') {
  options = [
    {
      label: 'Option 1',
      value: 'Option1',
    }, {
      label: 'Option 2',
      value: 'Option2',
    },
  ];
  singleSelect = false;

  get isValid() {
    return !!this.value;
  }

  static from(obj?: object) {
    if (!obj) return new ButtonGroupTemplate();

    const newInstance = new ButtonGroupTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ButtonGroupTemplate.from(obj);
  }
}
