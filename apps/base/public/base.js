System.register(['react', 'react-dom', 'react-dom/client', 'single-spa'], function (_export, _context) {
  function loadBaseApp() {
    if (globalThis.__FM_BASE__) {
      return Promise.resolve(globalThis.__FM_BASE__);
    }

    if (globalThis.__FM_BASE_PROMISE__) {
      return globalThis.__FM_BASE_PROMISE__;
    }

    globalThis.__FM_BASE_PROMISE__ = new Promise((resolve, reject) => {
      function waitForBaseExports(startTime) {
        if (globalThis.__FM_BASE__) {
          resolve(globalThis.__FM_BASE__);
          return;
        }

        if (Date.now() - startTime > 10000) {
          reject(new Error('Timed out waiting for __FM_BASE__ exports'));
          return;
        }

        setTimeout(() => waitForBaseExports(startTime), 50);
      }

      const script = document.createElement('script');
      script.src = new URL('./base-app.js', _context.meta.url).toString();
      script.async = true;
      script.onload = () => waitForBaseExports(Date.now());
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.head.appendChild(script);
    });

    return globalThis.__FM_BASE_PROMISE__;
  }

  return {
    setters: [
      function (reactModule) {
        globalThis.React = reactModule.default || reactModule;
      },
      function (reactDomModule) {
        globalThis.ReactDOM = reactDomModule.default || reactDomModule;
      },
      function (reactDomClientModule) {
        globalThis.ReactDOMClient = reactDomClientModule.default || reactDomClientModule;
      },
      function (singleSpaModule) {
        globalThis.singleSpa = singleSpaModule.default || singleSpaModule;
      },
    ],
    execute: function () {
      return loadBaseApp().then((baseModule) => {
        Object.entries(baseModule).forEach(([key, value]) => {
          _export(key, value);
        });
      });
    },
  };
});
