import { render } from "@testing-library/react";
import { MultipleInputNumber } from "./MultipleInputNumber";

afterAll(() => {
  vi.clearAllMocks();
});

describe("MultipleInputNumber component", () => {
  it("should be in the document", async () => {
    const onChangeCallback = Promise.resolve(["newconifg"]);
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(() => onChangeCallback),
      options: [],
      value: "200",
      title: "Value",
      disabled: false,
      multiple: true,
      listsAsArrays: true,
      path: [2],
      level: 1,
    };
    const { getByTestId } = render(<MultipleInputNumber {...props} />);
    const multipleInputNumber = getByTestId("multiple-input-number");
    expect(multipleInputNumber).toBeDefined();
  });
});
