import { TextDecoder, TextEncoder } from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
const mockComponent = (c) => {
  return <section>{c.children}</section>;
};
// Mock SystemJS
async function mockImport(name) {
  return Promise.resolve({
    __esModule: true,
    default: mockComponent,
    [name]: mockComponent,
    getRoot: mockComponent,
  });
}
// @ts-expect-error
global.System = {
  import: jest.fn(mockImport),
};
jest.mock('@sctoolkit/webkit/elements/sc-button', () => {
  return {
    __esModule: true,
    default: (_props) => {},
  };
});
jest.mock('@sctoolkit/webkit/elements/sc-icon-card', () => {
  return {
    __esModule: true,
    default: (_props) => {},
  };
});

console.error = (...args) => {};
console.log = (...args) => {};
console.info = (...args) => {};
jest.setTimeout(60000);
