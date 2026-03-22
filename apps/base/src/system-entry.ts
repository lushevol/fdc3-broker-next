declare let __webpack_public_path__: string;

import * as baseModule from './root';

declare global {
  interface Window {
    __FM_BASE__?: typeof baseModule;
    __FM_BASE_PROMISE__?: Promise<typeof baseModule>;
  }
}

if (document.currentScript instanceof HTMLScriptElement) {
  __webpack_public_path__ = new URL('./', document.currentScript.src).toString();
}
void __webpack_public_path__;

globalThis.__FM_BASE__ = baseModule;

export default baseModule;
