import { cloneProperties } from '../../shared/utils.js';

export class OptionBase {
  value: string;
  label: string;
  isOtherOptionItem: boolean;

  constructor(value?: string) {
    this.value = value ? value : value || this.value;
  }

  get isValid() {
    if (this.isOtherOptionItem) return true;

    return this.value !== undefined && this.value !== '';
  }

  static from(obj: any) {
    return OptionBase.instanceFactory(OptionBase, obj);
  }

  static instanceFactory(OptionItemClass: any, obj?: any, shouldIgnoreProperties?: boolean) {
    if (!obj || typeof obj !== 'object') return new OptionItemClass();

    const { value, isOtherOptionItem, id, metadata, ...rest } = obj;
    const instance = new OptionItemClass(value);
    instance.id = id;
    instance.isOtherOptionItem = isOtherOptionItem;
    instance.metadata = metadata;

    if (!shouldIgnoreProperties) {
      cloneProperties(instance, rest);
    }

    return instance;
  }

  duplicate(OptionItemClass: OptionBase, obj?: any, shouldIgnoreProperties?: boolean) {
    const instance = OptionBase.instanceFactory(
      OptionItemClass,
      obj,
      shouldIgnoreProperties
    );

    // instance.id = v4();

    return instance;
  }
}
