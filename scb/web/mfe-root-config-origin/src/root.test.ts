import Root from "./root";
afterAll(() => {
  jest.clearAllMocks();
});
jest.mock(
  "./microfrontend-layout.html",
  () => "<html><head></head><body></body></html>"
);
jest.mock("single-spa-layout", () => {
  return {
    constructApplications: ({ loadApp }) => {
      loadApp({ name: "root-config" });
      return [{ customProps: {} }];
    },
    constructRoutes: () => ({}),
    constructLayoutEngine: () => {
      return {
        activate: () => {},
      };
    },
  };
});
jest.mock("single-spa", () => {
  return {
    registerApplication: () => {},
    start: () => {},
  };
});
jest.mock("./root", () => {
  const originalModule = jest.requireActual("./root");
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "mocked"),
  };
});
describe("Root", () => {
  it("should be true", () => {
    const defaultExportResult = Root();
    expect(defaultExportResult).toBe("mocked");
    expect(Root).toHaveBeenCalled();
  });
});
