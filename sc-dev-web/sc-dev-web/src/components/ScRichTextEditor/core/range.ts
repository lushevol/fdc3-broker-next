import { node } from './utils.js';

export default {
  nativeRange() {
    return document.createRange();
  },
  create() {
    return this.nativeRange();
  },
  createCursorAfter(target: Node) {
    const range = this.create();
    if (node.isComment(target) || node.isText(target)) {
      range.setStart(target, (target as Text).length);
      range.setEnd(target, (target as Text).length);
    } else {
      range.setStart(target, target.childNodes.length);
      range.setEnd(target, target.childNodes.length);
    }
    return range;
  },
};
