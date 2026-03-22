System.register(['react', '@fm/base'], function (_export, _context) {
  function loadContainerApp() {
    if (globalThis.__FM_TEMPLATE_CONTAINER__) {
      return Promise.resolve(globalThis.__FM_TEMPLATE_CONTAINER__);
    }

    if (globalThis.__FM_TEMPLATE_CONTAINER_PROMISE__) {
      return globalThis.__FM_TEMPLATE_CONTAINER_PROMISE__;
    }

    globalThis.__FM_TEMPLATE_CONTAINER_PROMISE__ = new Promise((resolve, reject) => {
      function waitForContainerExports(startTime) {
        if (globalThis.__FM_TEMPLATE_CONTAINER__) {
          resolve(globalThis.__FM_TEMPLATE_CONTAINER__);
          return;
        }

        if (Date.now() - startTime > 10000) {
          reject(new Error('Timed out waiting for __FM_TEMPLATE_CONTAINER__ exports'));
          return;
        }

        setTimeout(() => waitForContainerExports(startTime), 50);
      }

      const script = document.createElement('script');
      script.src = new URL('./template_container-app.js', _context.meta.url).toString();
      script.async = true;
      script.onload = () => waitForContainerExports(Date.now());
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.head.appendChild(script);
    });

    return globalThis.__FM_TEMPLATE_CONTAINER_PROMISE__;
  }

  return {
    setters: [
      function (reactModule) {
        globalThis.React = reactModule.default || reactModule;
      },
      function (baseModule) {
        globalThis.ContainerBase = baseModule;
      },
    ],
    execute: function () {
      return loadContainerApp().then((containerModule) => {
        Object.entries(containerModule).forEach(([key, value]) => {
          _export(key, value);
        });
      });
    },
  };
});
