import { cloneProperties } from '../../shared/utils.js';

export class LabelTemplate {
  label = 'Label';
  tooltip: string;
  labelSize = 'md';
  tooltipPlacement: string;
  required = false;
  populate = false;
  populateType: string;

  static from(obj?: object) {
    if (!obj) return new LabelTemplate();

    const newInstance = new LabelTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return LabelTemplate.from(obj);
  }

}
