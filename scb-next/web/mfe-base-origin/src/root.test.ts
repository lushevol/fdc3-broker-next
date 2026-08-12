
import { MountComponent, render, check } from "./root";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("react-dom/client", () => {
  return {
    __esModule: true,
    default: {
      createRoot: () => {
        return {
          render: () => { },
        }
      }
    }
  };
});
vi.mock("single-spa-react", () => {
  return {
    __esModule: true,
    default: ({
      React,
      ReactDOMClient,
      rootComponent,
      errorBoundary,
    }) => {
      const a = errorBoundary({ message: "" });
      return {
        bootstrap: () => { },
        unmount: () => { },
        mount: () => { },
      };
    },
  };
});

describe("Root", () => {
  it("should be true", async () => {
    const newDiv = document.createElement("div");
    document.body.appendChild(newDiv as unknown as any);
    render(newDiv, { version: "1.0.0" });
    check(newDiv, { version: "1.0.0" });
    check(undefined, { version: "1.0.0" });
    await MountComponent({ version: "1.0.0" });
  });
});
