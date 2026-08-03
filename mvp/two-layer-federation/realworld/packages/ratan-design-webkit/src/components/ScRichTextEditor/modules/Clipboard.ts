import type { Context } from '../Context.js';
import { Base } from './Base.js';

export class Clipboard extends Base {
  selectionLen = 0;
  constructor(public context: Context) {
    super();
    this.context = context;
  }
  attachEvents() {
    const editableContent = this.context.invoke('viewer.getEditableContent') as
      | Element
      | undefined;
    if (editableContent) {
      editableContent.addEventListener('paste', (event: Event) => {
        const clipboardEvent = event as ClipboardEvent;
        const parser = new DOMParser();
        const xml = clipboardEvent.clipboardData?.getData('text/html');
        if (xml) {
          const doc = parser.parseFromString(xml, 'text/html');
          this.removeStyle(doc.body.children);

          this.context.invoke('editor.insertHTML', doc.body.innerHTML);
          clipboardEvent.preventDefault();
        }

        this.context.invoke('viewer.updateCount');
      });

    }
  }
  removeStyle(
    els: HTMLCollection
  ) {
    const fn = (elements: HTMLCollection) => {
      Array.from(elements).forEach(el => {
        const element = el as HTMLElement;
        element.style.cssText = '';

        if (element.children) {
          fn(element.children);
        }
      });
    };
    fn(els);
  }
}
