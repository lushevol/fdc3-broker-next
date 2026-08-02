import '@webcomponents/scoped-custom-element-registry';
import '@testing-library/jest-dom';

class TestResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class TestIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
  root = null;
  rootMargin = '0px';
  thresholds = [0];
}

Object.assign(globalThis, {
  ResizeObserver: TestResizeObserver,
  IntersectionObserver: TestIntersectionObserver,
});
