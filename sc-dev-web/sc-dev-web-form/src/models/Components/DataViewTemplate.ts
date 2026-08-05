import { cloneProperties } from '../../shared/utils.js';
import { FormMixin } from '../mixin/formMixin.js';

export class DataViewTemplate extends FormMixin('DataView') {
  columns = 2;
  mode = 'table';
  compact = false;
  horizontalAlign = 'left';
  verticalAlign = 'middle';
  options = [{
    value: 'Value1',
    label: 'Label 1',
  }, {
    value: 'Value2',
    label: 'Label 2',
  }];
  labelSize = 'md';

  static from(obj?: object) {
    if (!obj) return new DataViewTemplate();

    const newInstance = new DataViewTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DataViewTemplate.from(obj);
  }
}
