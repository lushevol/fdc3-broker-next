import { editorCommand } from '../core/utils.js';
import { Base } from './Base.js';
import { msg } from '@lit/localize';

const commands = [
  'undo',
  'redo',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'subscript',
  'superscript',
  'justifyLeft',
  'justifyCenter',
  'justifyRight',
  'insertOrderedList',
  'insertUnorderedList',
  'removeFormat',
  'backColor',
  'foreColor',
  'indent',
  'outdent',
  'insertHTML',
  'insertImage',
  'delete',
  'unlink',
  'createlink',
] as const;

type TClass<T> = new (...args: any[]) => T;

type TCommand = {
  [key in (typeof commands)[number]]?: (value?: string) => void;
};
type TMethod = {
  preCommand(): void;
  notSupportLog(text: string): void;
  postCommand(): void;
  execCommand(sCmd: string, value?: string): void;
};
export type THeading = {
  formatH1(): void;
  formatH2(): void;
  formatH3(): void;
  formatH4(): void;
  formatH5(): void;
  formatH6(): void;
};

export const Command: TClass<
  TCommand & TMethod & THeading
> = class extends Base {
  constructor() {
    super();
    for (let idx = 0, len = commands.length; idx < len; idx++) {
      const key = commands[idx];
      (this as unknown as TCommand)[key] = ((sCmd: string) => {
        return (value?: string) => {
          this.execCommand(sCmd, value);
        };
      })(commands[idx]);
    }
  }
  formatH1() {}
  formatH2() {}
  formatH3() {}
  formatH4() {}
  formatH5() {}
  formatH6() {}
  execCommand(sCmd: string, value?: string) {
    if (!this.isValidAction(sCmd, value)) {
      this.notSupportLog(msg('Not support inject table inside table', { id: 'sc-editor-cant-inject-into-table' }));
      return;
    }
    this.preCommand();
    requestIdleCallback(() => {
      if (editorCommand(sCmd, value)) {
        this.postCommand();
      } else {
        this.notSupportLog(
          msg(
            'Your browser does not support Text-Editor. Please use others like Chrome, Edge, Safari',
            { id: 'sc-editor-incompatible' }
          )
        );
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValidAction(sCmd: string, value?: string) {
    return true;
  }
  preCommand() {}
  postCommand() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  notSupportLog(text: string) {}
};
