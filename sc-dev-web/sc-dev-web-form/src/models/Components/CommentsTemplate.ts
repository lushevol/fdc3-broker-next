import { cloneProperties } from '../../shared/utils.js';
import { ContainerMixin } from '../mixin/containerMixin.js';

export class CommentsTemplate extends ContainerMixin('Comments') {
  maxRepliesdepth = 3;
  maxVisibleReplies = 2;
  labelSize = 'md';

  static from(obj?: object) {
    if (!obj) return new CommentsTemplate();

    const newInstance = new CommentsTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return CommentsTemplate.from(obj);
  }
}
