import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class CarouselOption {
  id: string;
  name: string;
}

export class CarouselTemplate extends ContainerMixin('Carousel') {
  scrollHint = '0%';
  aspectRatio = 'auto';
  pagination = true;
  autoplay = false;
  loop = false;
  
  carousels: CarouselOption[] = [{
    id: 'Carousel1',
    name: 'Carousel 1',
  }];

  static from(obj?: object) {
    if (!obj) return new CarouselTemplate();

    const newInstance = new CarouselTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return CarouselTemplate.from(obj);
  }
}
