import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class GridColumnUnitTemplate extends ContainerMixin() {
  type = 'grid-column-unit';
  
  static from(obj?: object) {
    if (!obj) return new GridColumnUnitTemplate();

    const newInstance = new GridColumnUnitTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return GridColumnUnitTemplate.from(obj);
  }

}
