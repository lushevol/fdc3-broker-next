import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class DividerTemplate extends ContainerMixin() {
  title = 'Divider';
  textAlign = 'left';
  vertical = true;
  size = 'sm';
  labelSize = 'sm';

  static from(obj?: object) {
    if (!obj) return new DividerTemplate();

    const newInstance = new DividerTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return DividerTemplate.from(obj);
  }

}
