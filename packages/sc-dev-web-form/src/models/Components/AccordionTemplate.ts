import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class AccordionTemplate extends ContainerMixin('Accordion') {
  label: string;
  labelSize = 'lg';
  open = true;

  static from(obj?: object) {
    if (!obj) return new AccordionTemplate();

    const newInstance = new AccordionTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return AccordionTemplate.from(obj);
  }
}
