import { EKEY_MAP, EMODIFIER, MAPPING_TOOLBAR_COMMAND } from '../constant.js';
import type { Context } from '../Context.js';
import env from '../core/env.js';
import key from '../core/key.js';
import list from '../core/list.js';
import { Base } from './Base.js';

export class ShortCut extends Base {
  constructor(public context: Context) {
    super();
    this.context = context;
  }
  attachEvents() {
    this.context.option.viewer.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (!env.isSupportExec) {
          this.preventShortCuts(<KeyboardEvent>event);
        } else if (this.context.option.shortcut) {
          const availableCommand = this.context.option.toolbarConf
            .map(action => {
              return MAPPING_TOOLBAR_COMMAND[action];
            })
            .filter(Boolean)
            .flat();

          const keyMap = this.context.option.keyMap[env.isMac ? 'mac' : 'pc'];
          const keys = [];

          event.metaKey && keys.push(EMODIFIER.CMD);
          event.ctrlKey && !event.altKey && keys.push(EMODIFIER.CTRL);
          event.shiftKey && keys.push(EMODIFIER.SHIFT);

          const keyName = key.nameFromCode[event.keyCode];
          if (keyName) {
            keys.push(keyName);
          }
          const eventName = (keyMap as Record<string, string>)[keys.join('+')];
          if (
            (eventName && availableCommand.includes(eventName)) ||
            eventName === keyMap[EKEY_MAP[EKEY_MAP.BACKSPACE]] ||
            eventName === keyMap[EKEY_MAP[EKEY_MAP.TAB]] ||
            eventName === keyMap[`${EMODIFIER[EMODIFIER.CTRL]}+${EKEY_MAP[EKEY_MAP.A]}`]
          ) {
            this.context.invoke(eventName);
            event.preventDefault();
          } else {
            this.preventShortCuts(<KeyboardEvent>event);
          }
        } else {
          this.preventShortCuts(<KeyboardEvent>event);
        }
      }
    );
  }
  private preventShortCuts(event: KeyboardEvent) {
    // B(Bold, 66) / I(Italic, 73) / U(Underline, 85)
    if (
      (event.ctrlKey || event.metaKey) &&
      list.contains([66, 73, 85], event.keyCode)
    ) {
      event.preventDefault();
    }
  }
}
