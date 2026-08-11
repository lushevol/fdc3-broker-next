import { cloneProperties } from '../../shared/utils.js';

export class TitleTemplate {
  label = 'Title';
  level = '2';
  ellipsis = false;
  hero = false;
  rows = 1;

  static from(obj?: object) {
    if (!obj) return new TitleTemplate();

    const newInstance = new TitleTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return TitleTemplate.from(obj);
  }

}
