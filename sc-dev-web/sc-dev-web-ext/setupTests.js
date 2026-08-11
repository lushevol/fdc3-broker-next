import '@testing-library/jest-dom';

// Mock DOMPurify module for all tests
jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: (html) => html,
  },
}));

// Mock browser APIs
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  takeRecords() {
    return null;
  }
  unobserve() {
    return null;
  }
};
document.execCommand = () => {};
document.createRange = () => {
  const range = new Range();
  range.getBoundingClientRect = jest.fn();
  range.getClientRects = () => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    };
  };
  return range;
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock DOMPurify for tests
global.DOMPurify = {
  sanitize: (html) => html,
};
