import { render } from "@testing-library/react";
import { SimpleAmount } from "./Amount";

describe("SimpleAmount", () => {
  it("should render the component", () => {
    const value = "123456.789";
    const { getByText } = render(
      <SimpleAmount value={value} formatOptions={{ mantissa: 2 }} />,
    );
    expect(getByText("123,456.79")).toBeInTheDocument();
  });
});
describe("empty value handling", () => {
  it("should render empty span when value is empty string", () => {
    const { container } = render(
      <SimpleAmount value="" formatOptions={{ mantissa: 2 }} />
    );
    expect(container.querySelector("span")).toBeInTheDocument();
    expect(container.querySelector("span")?.textContent).toBe("");
  });

  it("should NOT render Tooltip when value is empty string", () => {
    const { container } = render(<SimpleAmount value="" />);
    expect(container.querySelectorAll("span").length).toBe(1);
  });
});
