import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class TabOption {
  id: string;
  name: string;
}

export class TabsTemplate extends ContainerMixin('Tabs') {
  tabs: TabOption[] = [{
    id: 'Tab1',
    name: 'Tab 1',
  }];

  static from(obj?: object) {
    if (!obj) return new TabsTemplate();

    const newInstance = new TabsTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TabsTemplate.from(obj);
  }
}
