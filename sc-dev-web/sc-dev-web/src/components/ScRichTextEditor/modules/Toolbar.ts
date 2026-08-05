import type { Context } from '../Context.js';
import { Base } from './Base.js';

export class Toolbar extends Base {
  constructor(public context: Context) {
    super();
    this.context = context;
  }
  attachStyleInfo() {
    if (this.context.option.toolbar) {
      this.context.option.toolbar.attachStyleInfo();
    }
  }
  notSupportLog(text: string) {
    this.context.option.toolbar.notSupportLog(text);
  }
}
