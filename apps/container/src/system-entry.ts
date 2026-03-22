declare let __webpack_public_path__: string;

import * as containerModule from './root';

declare global {
  interface Window {
    __FM_TEMPLATE_CONTAINER__?: typeof containerModule;
    __FM_TEMPLATE_CONTAINER_PROMISE__?: Promise<typeof containerModule>;
    ContainerBase?: unknown;
  }
}

if (document.currentScript instanceof HTMLScriptElement) {
  __webpack_public_path__ = new URL('./', document.currentScript.src).toString();
}
void __webpack_public_path__;

globalThis.__FM_TEMPLATE_CONTAINER__ = containerModule;

export default containerModule;
