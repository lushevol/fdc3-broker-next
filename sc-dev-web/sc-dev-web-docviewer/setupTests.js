import 'geometry-interfaces';

if (!global.File.prototype.arrayBuffer) {
  global.File.prototype.arrayBuffer = function () {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(this);
    });
  };
}

if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = jest.fn(() => 'mock-object-url');
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  window.URL.revokeObjectURL = jest.fn(() => {});
}

if (typeof window.PointerEvent === 'undefined') {
  window.PointerEvent = jest.fn(() => ({
    clientX: 1,
    clientY: 1,
    offsetX: 1,
    offsetY: 1,
    pointerId: 1,
    preventDefault() {},
    stopPropagation() {},
  }));
}

if (typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
}

if (typeof window.requestIdleCallback === 'undefined') {
  window.requestIdleCallback = callback =>
    window.setTimeout(
      () =>
        callback({
          didTimeout: false,
          timeRemaining: () => 0,
        }),
      0
    );
}

if (typeof window.cancelIdleCallback === 'undefined') {
  window.cancelIdleCallback = id => window.clearTimeout(id);
}
