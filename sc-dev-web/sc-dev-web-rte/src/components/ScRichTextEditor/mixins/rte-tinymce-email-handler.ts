import { Editor } from 'hugerte';

declare module 'hugerte' {
  interface EditorOptions {
    /** @deprecated use sc_process_object_align instead  */
    objAlign: 'inline' | 'parent';
    sc_process_object_align: 'inline' | 'parent';
  }
}
export enum EmailOptions {
  /** @deprecated use sc_process_object_align instead  */
  objAlign = 'objAlign',
  sc_process_object_align = 'sc_process_object_align',
}

type PreProcessEvent = Parameters<Parameters<typeof Editor.prototype.on<'PreProcess'>>[1]>[0];

type Align = 'left' | 'right' | 'center';

/** Email compatibility handler */
export class EmailHandler {
  editor: Editor;
  debug = false;

  constructor(editor: Editor) {
    this.editor = editor;
    this.editor.on('PreProcess', this.onPreProcess);

    editor.options.register(EmailOptions.objAlign, { processor: 'string' });
    editor.options.register(EmailOptions.sc_process_object_align, { processor: 'string' });
  }

  destroy() {
    this.editor.off('PreProcess', this.onPreProcess);
  }

  onPreProcess = (event: PreProcessEvent): void => {
    const objAlign =
    this.editor.options.get(EmailOptions.sc_process_object_align) ||
      this.editor.options.get(EmailOptions.objAlign);
    if (
      event.format !== 'html' ||
      objAlign !== 'parent'
    )
      return;

    const { node } = event;
    const doc = node.ownerDocument;

    node.querySelectorAll<HTMLElement>('table, img, audio, video').forEach(el => {
      const result = this.detectAlignDir(el);
      if (result) this.applyAlignWrapper(el, result, doc);
      this.debug && console.log(el.tagName, el.getAttribute('style'));
    });
    
    this.debug && console.log('preProcess', node.outerHTML);
  };

  
  isZeroValue = (v: string) => /^0(px|em|rem|%)?$/.test(v.trim());

  detectAlignDir(el: HTMLElement): Align | undefined {
    if (el.hasAttribute('align')) return el.getAttribute('align') as Align;
    const { float, marginLeft, marginRight } = el.style;
    if (float === 'left') return 'left';
    if (float === 'right') return 'right';
    if (marginLeft === 'auto' && marginRight === 'auto') return 'center';
    if (marginRight && this.isZeroValue(marginRight)) return 'right';
    if (marginLeft && this.isZeroValue(marginLeft)) return 'left';
  }

  applyAlignWrapper(el: HTMLElement, align: Align, doc: Document) {
    if (!align || !el.parentElement) return;

    // float is intentional — set align for Outlook Word renderer compatibility
    if (el.style.float || /^left|right$/i.test(el.getAttribute('align') || '')) {
      el.setAttribute('align', align);
    } else {
      // Will wrap with div[align]. Ensures block layout.
      let div: HTMLDivElement;
      // only div wrapper if parent is not already a single element with align, to avoid unnecessary nesting
      if (el.parentElement.tagName === 'DIV' && el.parentElement.children.length === 1) {
        div = el.parentElement as HTMLDivElement;
        div.setAttribute('align', align);
      } else {
        div = doc.createElement('div');
        div.setAttribute('align', align);
        el.parentElement.insertBefore(div, el);
        div.appendChild(el);
      }
      // not supported in email clients, but helps visually in editor
      el.style.removeProperty('margin-left');
      el.style.removeProperty('margin-right');
      el.style.removeProperty('display');
      // align="center" is safe (non-float semantic); align="left/right" on element causes float text-wrap
      if (align === 'center') {
        el.setAttribute('align', align);
      } else {
        el.removeAttribute('align');
      }
    }

    if (!el.style.cssText.trim()) el.removeAttribute('style');
  }


}