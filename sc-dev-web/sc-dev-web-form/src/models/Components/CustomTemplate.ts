import { cloneProperties } from '../../shared/utils.js';

export class CustomTemplate {

  static from(obj?: object) {
    if (!obj) return new CustomTemplate();

    const newInstance = new CustomTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }
}
