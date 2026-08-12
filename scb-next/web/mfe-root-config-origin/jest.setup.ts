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
// @ts-ignore
global.System = {
  // @ts-ignore
  import: jest.fn(mockImport),
};

console.error = (...args) => {};
console.log = (...args) => {};
console.info = (...args) => {};
// @ts-ignore
jest.setTimeout(60000);
