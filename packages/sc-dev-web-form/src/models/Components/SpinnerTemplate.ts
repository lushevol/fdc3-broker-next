import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class SpinnerTemplate extends ContainerMixin() {
  color: string;
  size: string;

  static from(obj?: object) {
    if (!obj) return new SpinnerTemplate();

    const newInstance = new SpinnerTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return SpinnerTemplate.from(obj);
  }

}
