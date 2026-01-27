const mockComponent = (c) => {
  return c;
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
  // @ts-expect-error
  import: jest.fn(mockImport),
};

console.error = (...args) => {};
console.log = (...args) => {};
console.info = (...args) => {};
// @ts-expect-error
jest.setTimeout(60000);
