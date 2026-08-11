import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class DynamicDisplayTemplate extends ContainerMixin('DynamicDisplay') {
  staticHeader = true;
  type = 'default';
  collapsed: boolean;

  static from(obj?: object) {
    if (!obj) return new DynamicDisplayTemplate();

    const newInstance = new DynamicDisplayTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DynamicDisplayTemplate.from(obj);
  }
}
