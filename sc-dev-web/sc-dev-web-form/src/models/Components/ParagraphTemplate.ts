import { cloneProperties } from '../../shared/utils.js';

export class ParagraphTemplate {
  label = 'Paragraph';
  size = 'md';
  ellipsis = false;
  rows = 1;

  static from(obj?: object) {
    if (!obj) return new ParagraphTemplate();

    const newInstance = new ParagraphTemplate();
    cloneProperties(newInstance, obj);

    return newInstance;
  }

  static duplicate(obj: object) {
    return ParagraphTemplate.from(obj);
  }

}
