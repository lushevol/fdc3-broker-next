import { Editor } from 'hugerte';

type NodeChangeEvent = Parameters<Parameters<typeof Editor.prototype.on<'NodeChange'>>[1]>[0];
type PastePostProcessEvent = Parameters<Parameters<typeof Editor.prototype.on<'PastePostProcess'>>[1]>[0];

/** This adds to handling of ul/ol lists */
export class ListHandler {
  editor: Editor;
  allowListReType = false;
  debug = false;

  constructor(editor: Editor) {
    this.editor = editor;
    this.editor.on('ListMutation', this.onListMutation);
    this.editor.on('NodeChange', this.onNodeChange);
    this.editor.on('PastePostProcess', this.onPastePostProcess);
  }

  destroy() {
    this.editor.off('ListMutation', this.onListMutation);
    this.editor.off('NodeChange', this.onNodeChange);
    this.editor.off('PastePostProcess', this.onPastePostProcess);
  }

  onListMutation = (event: any): void => {
    this.allowListReType = ['IndentList', 'OutdentList', 'ToggleOlList', 'ToggleUlList'].includes(event.action);
    this.debug && console.log('[ListHandler] ListMutation:', event.action, 'allow:', this.allowListReType);
  };

  onNodeChange = (event: NodeChangeEvent): void => {
    const listItem = event.parents.find(el => (el as Element).tagName === 'LI');
    if (!event.selectionChange && listItem) {
      if (!this.allowListReType) {
        this.debug && console.log('[ListHandler] NodeChange ignored due to allow=false');
        return;
      }
      // reset allow after handling one mutation
      this.allowListReType = false; 
      
      const parents = event.parents as HTMLElement[];
      const list = listItem?.parentElement;
      if (!['OL','UL'].includes(list?.tagName || '')) return;

      // TODO: handle advlist types if exposing toolbar list types in the future

      if (list?.tagName === 'OL') {
        let numStyles = this.editor.options.get<string[]>('advlist_number_styles');
        if (!Array.isArray(numStyles) || numStyles.length === 0) {
          numStyles = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman'];
        }
        numStyles = numStyles.map(s => s === 'default' ? 'decimal' : s);
        numStyles = [...new Set(numStyles)]; // remove duplicates

        const depth = this.depth(list, parents);
        const type = ({
          decimal: '1',
          'lower-alpha': 'a',
          'lower-roman': 'i',
          'upper-alpha': 'A',
          'upper-roman': 'I',
        })[numStyles[depth % numStyles.length]];
        type && list.setAttribute('type', type);
        this.debug && console.log('[ListHandler] Applied OL type:', type, 'for depth:', depth, 'list:', list);

      } else if (list?.tagName === 'UL') {
        let bullStyles = this.editor.options.get<string[]>('advlist_bullet_styles');
        if (!Array.isArray(bullStyles) || bullStyles.length === 0) {
          bullStyles = ['disc', 'circle', 'square'];
        }
        bullStyles = bullStyles.map(s => s === 'default' ? 'disc' : s);
        bullStyles = [...new Set(bullStyles)]; // remove duplicates
        
        const depth = this.depth(list, parents);
        const type = bullStyles[depth % bullStyles.length];
        type && list.setAttribute('type', type);
        this.debug && console.log('[ListHandler] Applied UL type:', type, 'for depth:', depth, 'list:', list);
      }
    }
  };

  depth(el: HTMLElement, parents: HTMLElement[]) {
    let value = 0;
    for (const p of parents) {
      if (p === el) continue;
      if (p.tagName === el.tagName) value++;
      else if (['UL', 'OL'].includes(p.tagName)) break;
    }
    return value;
  }

  onPastePostProcess = (event: PastePostProcessEvent): void => {
    event.node.querySelectorAll<HTMLElement>('ol:not([type]), ul:not([type])').forEach(list => {
      const li = Array.from(list.children).find(child => child.tagName === 'LI' && child.getAttribute('type'));
      const type = li?.getAttribute('type');
      if (li && type) {
        Array.from(list.children).forEach(li => li.tagName === 'LI' && li.removeAttribute('type'));
        if (['disc', 'square', 'circle'].includes(type)) {
          if (list.tagName === 'OL') {
            const ul = document.createElement('ul');
            ul.setAttribute('type', type);
            list.replaceWith(ul);
            ul.append(...list.children);
            this.debug && console.log('[ListHandler] Converted pasted OL to UL with type:', type);
            return;
          }
        } else if (['1', 'a', 'A', 'i', 'I'].includes(type)) {
          if (list.tagName === 'UL') {
            const ol = document.createElement('ol');
            ol.type = type;
            list.replaceWith(ol);
            ol.append(...list.children);
            this.debug && console.log('[ListHandler] Converted pasted UL to OL with type:', type);
            return;
          }
        }
        list.setAttribute('type', type);
      }
    });
    event.node.querySelectorAll<HTMLElement>('li').forEach(li => {
      if (li.style.color === 'windowText') {
        li.style.removeProperty('color');
      }
      [...li.classList.values()].forEach(cls => {
        if (cls.startsWith('Mso')) {
          li.classList.remove(cls);
        }
      });
    });
  };

}