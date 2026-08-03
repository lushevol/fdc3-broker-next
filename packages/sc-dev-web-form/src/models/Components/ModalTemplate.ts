import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

type TRIGGER_ELEMENT = {
  buttonType?: string;
  triggerText?: string;
};

export class ModalTemplate extends ContainerMixin('Modal') {
  label: string;
  size = 'md';
  triggerElement = 'button';
  primaryButton = '';
  secondaryButton = '';
  config: TRIGGER_ELEMENT;

  static from(obj?: object) {
    if (!obj) return new ModalTemplate();

    const newInstance = new ModalTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ModalTemplate.from(obj);
  }
}
