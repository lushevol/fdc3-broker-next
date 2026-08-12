import { fireEvent, render } from "@testing-library/react";
import { RegExpInput, RegExpFlagSelector } from "./RegExpInput";

afterAll(() => {
  jest.clearAllMocks();
});

describe("RegExp Input component", () => {
  it("should be in the document", async () => {
    const onChangeCallback = Promise.resolve(["newconifg"]);
    const props = {
      className: "rule-value",
      onChange: jest.fn(() => onChangeCallback),
      value: "ABC",
      title: "Reg Exp",
      disabled: false,
      allowClear: false,
      placeholder: "",
    };
    const { getByTestId } = render(<RegExpInput {...props} />);
    const regexpInput = getByTestId("regexp-input");
    expect(regexpInput).toBeDefined();
    const regexpInputIcon = getByTestId("regexp-icon");
    fireEvent.click(regexpInputIcon);
  });
  it("RegExpFlagSelector", () => {
    const handleChange = jest.fn();
    const regexp = "TEST";
    const { getByTestId } = render(<RegExpFlagSelector regexp={regexp} value={{ ignoreCase: true }} onChange={handleChange} />);
    const regexpInputIcon = getByTestId("regexp-icon");
    fireEvent.click(regexpInputIcon);
    const regexpFlags = getByTestId("regexp-flags");
    expect(regexpFlags).toBeInTheDocument();
  });
});
