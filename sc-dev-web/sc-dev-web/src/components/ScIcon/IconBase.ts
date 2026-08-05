import { property } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';

export enum ICON_SIZE {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl'
}
export class IconBase extends ScElement {

  @property() size: `${ICON_SIZE}` = ICON_SIZE.sm;
  
  getIconSize() {
    let size;
    switch (this.size) {
      case 'xxl':
        size = '2.5rem';
        break;
      case 'xl':
        size = '1.75rem';
        break;
      case 'lg':
        size = '1.5rem';
        break;
      case 'md':
        size = '1.25rem';
        break;
      case 'xs':
        size = '0.875rem';
        break;
      case 'xxs':
        size = '0.75rem';
        break;
      case 'sm':
      default:
        size = '1rem';
        break;
    }
    return size;
  }
}
