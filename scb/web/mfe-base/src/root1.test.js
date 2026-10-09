afterAll(() => {
  jest.clearAllMocks();
});
jest.mock("react-dom/client", () => {
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
jest.mock("single-spa-react", () => {
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
    newDiv.setAttribute("id", "single_spa_container_id")
    document.body.appendChild(newDiv);
    Object.defineProperty(window, "single_spa_container_id", {
      value: document.getElementById("single_spa_container_id"),
      writable: true
    });
    const { MountComponent } = require("./root");
    await MountComponent({ version: "1.0.0" });
  });
});
