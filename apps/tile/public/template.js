System.register(['react', '@fm/base'], function (_export, _context) {
  function loadTileApp() {
    if (globalThis.__FM_TEMPLATE__) {
      return Promise.resolve(globalThis.__FM_TEMPLATE__);
    }

    if (globalThis.__FM_TEMPLATE_PROMISE__) {
      return globalThis.__FM_TEMPLATE_PROMISE__;
    }

    globalThis.__FM_TEMPLATE_PROMISE__ = new Promise((resolve, reject) => {
      function waitForTileExports(startTime) {
        if (globalThis.__FM_TEMPLATE__) {
          resolve(globalThis.__FM_TEMPLATE__);
          return;
        }

        if (Date.now() - startTime > 10000) {
          reject(new Error('Timed out waiting for __FM_TEMPLATE__ exports'));
          return;
        }

        setTimeout(() => waitForTileExports(startTime), 50);
      }

      const script = document.createElement('script');
      script.src = new URL('./template-app.js', _context.meta.url).toString();
      script.async = true;
      script.onload = () => waitForTileExports(Date.now());
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.head.appendChild(script);
    });

    return globalThis.__FM_TEMPLATE_PROMISE__;
  }

  return {
    setters: [
      function (reactModule) {
        globalThis.React = reactModule.default || reactModule;
      },
      function (baseModule) {
        globalThis.TileBase = baseModule;
      },
    ],
    execute: function () {
      return loadTileApp().then((tileModule) => {
        Object.entries(tileModule).forEach(([key, value]) => {
          _export(key, value);
        });
      });
    },
  };
});
