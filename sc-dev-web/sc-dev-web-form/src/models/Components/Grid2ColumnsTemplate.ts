import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';
import { GridColumnUnitTemplate } from './GridColumnUnitTemplate.js';

export class Grid2ColumnsTemplate extends ContainerMixin() {
  label: string;
  noSpacing = false;
  columnsLayout = '50-50';
  
  initComponents() {
    return [new GridColumnUnitTemplate(), new GridColumnUnitTemplate()];
  }
  
  static from(obj?: object) {
    if (!obj) return new Grid2ColumnsTemplate();

    const newInstance = new Grid2ColumnsTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return Grid2ColumnsTemplate.from(obj);
  }

}
