import '@testing-library/jest-dom';
import '@atlaskit/pragmatic-drag-and-drop-unit-testing/drag-event-polyfill'
import { trustedTypes } from 'trusted-types';
import { enableDefaultTrustTypesPolicy } from './dist/src/shared/trusted-types-policy.js';
const { TextEncoder, TextDecoder } = require('util');

global.DOMRect = class {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = height < 0 ? y + height : y;
    this.right = width < 0 ? x : x + width;
    this.bottom = height < 0 ? y : y + height;
    this.left = width < 0 ? x + width : x;
  }
};

global.ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};
global.requestIdleCallback = function (fn) {
  if (fn) {
    setTimeout(function () {
      fn();
    }, 0);
  }
};
global.requestAnimationFrame = function (fn) {
  if (fn) {
    setTimeout(function () {
      fn();
    }, 0);
  }
};
global.queueMicrotask = function (fn) {
  if (fn) {
    setTimeout(function () {
      fn();
    }, 0);
  }
};

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

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


// CSP: require-trust-type sink enforcement simulation
(() => {
  // window.debug = `${window.debug ??= ''};trusted-types`;
  Object.defineProperty(window, 'trustedTypes', {
    configurable: true,
    writable: true,
    value: trustedTypes,
  });
  enableDefaultTrustTypesPolicy(window);

  // trusted-types enforcer is currently not working. If it is, can remove below.
  
  // Setting window.trustedTypes to null/undefined will disable TrustedTypes enforcement

  function enforce(value) {
    let result = value;
    // Simulate CSP trustedTypes default policy, if available
    if (typeof value === 'string' && window.trustedTypes) {
      if (!window.trustedTypes?.defaultPolicy)
        throw new Error('Trusted Types violation: innerHTML assignment with non-trusted value');
      result = window.trustedTypes.defaultPolicy.createHTML(value);
    }
    return result;
  }

  function wrapEnforce(proto, method, fn) {
    const og = Object.getOwnPropertyDescriptor(proto, method);
    if (!og) return () => {}; // noop
    Object.defineProperty(proto, method, {
      ... typeof og.value === 'function' ? {
        value(...args) {
          return og.value.apply(this, fn.apply(this, args));
        },
      } : {},
      ... typeof og.set === 'function' ? {
        set(value) {
          og.set.call(this, fn.call(this, value));
        },
      } : {},
      ... typeof og.get === 'function' ? { get: og.get } : {},
      configurable: og.configurable,
      enumerable: og.enumerable,
      ...('writable' in og ? { writable: og.writable } : {}),
    });
    return () => Object.defineProperty(proto, method, og);
  }

  let resetWrappers = [];

  beforeAll(() => {
    resetWrappers = [
      wrapEnforce(Document.prototype, 'parseHTMLUnsafe', function(value, options) {
        return [enforce.call(this, value), options];
      }),
      wrapEnforce(Document.prototype, 'write', function(...args) {
        console.warn('Deprecated Document.write called with', ...args);
        return args.map(arg => enforce.call(this, arg));
      }),
      wrapEnforce(Document.prototype, 'writeln', function(...args) {
        console.warn('Deprecated Document.writeln called with', ...args);
        return args.map(arg => enforce.call(this, arg));
      }),
      // wrapEnforce(DOMParser.prototype, 'parseFromString', function(value, mimeType) {
      //   return [enforce.call(this, value), mimeType];
      // }),
      wrapEnforce(Element.prototype, 'innerHTML', function(value) {
        return enforce.call(this, value);
      }),
      wrapEnforce(Element.prototype, 'outerHTML', function(value) {
        return enforce.call(this, value);
      }),
      wrapEnforce(Element.prototype, 'insertAdjacentHTML', function(position, text) {
        return [position, enforce.call(this, text)];
      }),
      wrapEnforce(Element.prototype, 'setHTMLUnsafe', function(html) {
        return [enforce.call(this, html)];
      }),
      wrapEnforce(HTMLIFrameElement.prototype, 'srcdoc', function(value) {
        return enforce.call(this, value);
      }),
      wrapEnforce(Range.prototype, 'createContextualFragment', function(fragment) {
        return [enforce.call(this, fragment)];
      }),
      wrapEnforce(ShadowRoot.prototype, 'innerHTML', function(value) {
        return enforce.call(this, value);
      }),
      wrapEnforce(ShadowRoot.prototype, 'setHTMLUnsafe', function(html) {
        return [enforce.call(this, html)];
      }),
    ];
  });
  afterAll(() => {
    resetWrappers.forEach(reset => reset());
  });
})();