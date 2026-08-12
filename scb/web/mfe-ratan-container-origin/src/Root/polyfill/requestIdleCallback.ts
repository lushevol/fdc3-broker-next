export const requestIdleCallbackPolyfill = function (cb) {
  var start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      },
    });
  }, 1);
};

export const cancelIdleCallbackPolyfill = function (id) {
  clearTimeout(id);
};

window.requestIdleCallback =
  window.requestIdleCallback || requestIdleCallbackPolyfill;

window.cancelIdleCallback =
  window.cancelIdleCallback || cancelIdleCallbackPolyfill;
