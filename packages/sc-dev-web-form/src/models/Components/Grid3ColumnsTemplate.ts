import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';
import { GridColumnUnitTemplate } from './GridColumnUnitTemplate.js';

export class Grid3ColumnsTemplate extends ContainerMixin() {
  label: string;
  noSpacing = false;
  columnsLayout = '33-33-33';
  
  initComponents() {
    return [new GridColumnUnitTemplate(), new GridColumnUnitTemplate(), new GridColumnUnitTemplate()];
  }

  static from(obj?: object) {
    if (!obj) return new Grid3ColumnsTemplate();

    const newInstance = new Grid3ColumnsTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return Grid3ColumnsTemplate.from(obj);
  }
}
