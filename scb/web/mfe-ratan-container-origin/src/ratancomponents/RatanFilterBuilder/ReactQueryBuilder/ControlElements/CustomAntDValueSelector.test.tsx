import { render } from "@testing-library/react";
import { CustomAntDValueSelector } from "./CustomAntDValueSelector";

afterAll(() => {
  jest.clearAllMocks();
});

describe("CustomAntDValueSelector component", () => {
  it("should be in the document", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: jest.fn(),
      options: [],
      value: "200",
      title: "Value",
      disabled: false,
      multiple: true,
      listsAsArrays: true,
      path: [3],
      level: 2,
    };
    const { getByTestId } = render(<CustomAntDValueSelector {...props} />);
    const multipleInputNumber = getByTestId("custom-value-selector");
    expect(multipleInputNumber).toBeDefined();
  });
});
