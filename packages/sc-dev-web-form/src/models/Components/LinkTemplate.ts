import { cloneProperties } from '../../shared/utils.js';

export class LinkTemplate {
  label = 'link'; 
  href: string; 
  block: boolean;
  disabled: boolean;
  target = '_self';

  static from(obj?: object) {
    if (!obj) return new LinkTemplate();

    const newInstance = new LinkTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return LinkTemplate.from(obj);
  }
}
