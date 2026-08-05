import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class RepeaterTemplate extends ContainerMixin('Repeater') {
  repeatTimes = 1;
  buttonText = 'Add field';

  static from(obj?: object) {
    if (!obj) return new RepeaterTemplate();

    const newInstance = new RepeaterTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return RepeaterTemplate.from(obj);
  }

}
