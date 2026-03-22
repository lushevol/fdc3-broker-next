declare let __webpack_public_path__: string;

import * as tileModule from './root';

declare global {
  interface Window {
    __FM_TEMPLATE__?: typeof tileModule;
    __FM_TEMPLATE_PROMISE__?: Promise<typeof tileModule>;
    TileBase?: unknown;
  }
}

if (document.currentScript instanceof HTMLScriptElement) {
  __webpack_public_path__ = new URL('./', document.currentScript.src).toString();
}
void __webpack_public_path__;

globalThis.__FM_TEMPLATE__ = tileModule;

export default tileModule;
