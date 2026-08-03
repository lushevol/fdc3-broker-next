import type { Context } from '../Context.js';
import { Command, THeading } from './Editor.command.js';

export class Editor extends Command {
  constructor(public context: Context) {
    super();
    this.context = context;
    for (let idx = 1; idx <= 6; idx++) {
      this[`formatH${idx}` as keyof THeading] = (idx => {
        return () => {
          this.formatBlock(`H${idx}`);
        };
      })(idx);
    }
  }
  tab() {
    this.insertHTML && this.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
  }
  backspace() {
    const count: number = this.context.invoke('viewer.getCount');
    if (count > 0) {
      this.delete && this.delete();
    }
  }
  formatPara() {
    this.formatBlock('p');
  }
  selectAll() {
    this.context.option.viewer.focusedElement = this.context.option.viewer.content;
    this.execCommand('selectAll');
  }

  formatBlockquote() {
    this.formatBlock('blockquote');
  }
  
  formatBlock(tagName?: string) {
    this.execCommand('formatBlock', tagName);
  }
  
  isValidAction(sCmd: string, value?: string) {
    return this.context.invoke('viewer.isValidContainer', sCmd, value);
  }

  /**
   * pre tasks when run command
   */
  preCommand() {
    this.context.invoke('viewer.focus');
  }
  /**
   * post tasks when run command
   */
  postCommand() {
    this.context.invoke('toolbar.attachStyleInfo');
  }
  /**
   * if browser does not support execCommand
   */
  notSupportLog(text: string) {
    this.context.invoke('toolbar.notSupportLog', text);
  }
}
