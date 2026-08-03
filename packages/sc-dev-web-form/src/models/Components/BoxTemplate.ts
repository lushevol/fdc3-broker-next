import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class BoxTemplate extends ContainerMixin('Box') {
  label: string;
  type = 'default';
  labelSize = 'md';

  static from(obj?: object) {
    if (!obj) return new BoxTemplate();

    const newInstance = new BoxTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return BoxTemplate.from(obj);
  }
}
