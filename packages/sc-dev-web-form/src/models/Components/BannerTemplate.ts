import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class BannerTemplate extends ContainerMixin() {
  label: string;
  body: string;
  titleSize = 'xl';
  bodySize = 'sm';
  spaceSize = 'md';
  backgroundColor = 'gradient-blue';
  textAlignment = 'left';
  imageSrc: string;
  imagePosition = 'right';
  imageType = 'url';

  static from(obj?: object) {
    if (!obj) return new BannerTemplate();

    const newInstance = new BannerTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return BannerTemplate.from(obj);
  }

}
