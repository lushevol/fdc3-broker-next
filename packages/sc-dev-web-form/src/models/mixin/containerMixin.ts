import { Component } from '../Component.js';
import { GridColumnUnitTemplate } from '../Components/GridColumnUnitTemplate.js';

export const ContainerMixin = (label?: string) => {
  return class {
    label = label;
    container = true;
    components: Component[] | GridColumnUnitTemplate[];
  };
};