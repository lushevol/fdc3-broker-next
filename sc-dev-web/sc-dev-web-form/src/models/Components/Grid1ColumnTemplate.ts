import { cloneProperties } from '../../shared/utils.js';
import { GridColumnUnitTemplate } from './GridColumnUnitTemplate.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class Grid1ColumnTemplate extends ContainerMixin() {
  label: string;
  fluidLayout = 'full';

  initComponents() {
    return [new GridColumnUnitTemplate()];
  }

  static from(obj?: object) {
    if (!obj) return new Grid1ColumnTemplate();

    const newInstance = new Grid1ColumnTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return Grid1ColumnTemplate.from(obj);
  }

}
