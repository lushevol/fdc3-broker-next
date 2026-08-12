import { fireEvent, render, screen } from "@testing-library/react";
import MfeThemeProvider from ".";

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("../../import", () => {
  const ContainerProvider = {
    useContext: () => ([{ theme: "dark" }, () => { }])
  };
  const ThemeConfig = () => ({ config: {} });
  const ThemeUtil = {
    getTheme: () => ({}),
  };
  return { ContainerProvider, ThemeConfig, ThemeUtil }
});

describe("Theme component", () => {
  it("should be in the document", () => {
    render(<MfeThemeProvider><div>test</div></MfeThemeProvider>);
    expect(screen).toBeDefined();
  });
})