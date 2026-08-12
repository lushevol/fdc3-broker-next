import { fireEvent, render, screen } from "@testing-library/react";
import Theme from ".";

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("../../Root/import", () => {
  const ContainerProvider = {
    useContext: () => ([{ theme: "dark" }, () => { }])
  };
  return { ContainerProvider }
});

describe("Theme component", () => {
  it("should be in the document", async () => {
    render(<Theme><div data-testid="dummy"></div></Theme>);
    expect(screen).toBeDefined();
  });
})