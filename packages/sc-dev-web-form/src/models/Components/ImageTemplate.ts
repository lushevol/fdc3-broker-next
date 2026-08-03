import { cloneProperties } from '../../shared/utils.js';

export class ImageTemplate {
  alt: string; 
  src: string; 
  width: string;
  height: string;
  link: string;
  target: string;
  imageType = 'url';

  static from(obj?: object) {
    if (!obj) return new ImageTemplate();

    const newInstance = new ImageTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ImageTemplate.from(obj);
  }
}
