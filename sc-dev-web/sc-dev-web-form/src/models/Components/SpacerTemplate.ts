import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class SpacerTemplate extends ContainerMixin() {
  vertical = true;
  size = '20';

  static from(obj?: object) {
    if (!obj) return new SpacerTemplate();

    const newInstance = new SpacerTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return SpacerTemplate.from(obj);
  }

}
