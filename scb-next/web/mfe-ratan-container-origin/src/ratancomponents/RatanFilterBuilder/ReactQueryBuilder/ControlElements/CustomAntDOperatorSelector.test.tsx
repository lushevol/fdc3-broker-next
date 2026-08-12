import { render } from "@testing-library/react";
import { CustomAntDOperatorSelector } from "./CustomAntDOperatorSelector";

afterAll(() => {
  vi.clearAllMocks();
});

describe("CustomAntDOperatorSelector component", () => {
  it("should be in the document", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: "=",
      title: "title",
      disabled: false,
      multiple: false,
      listsAsArrays: true,
      path: [6],
      level: 3,
      rule: {
        field: "test",
        operator: "=",
        value: "",
        valueSource: "field",
      }
    };
    // @ts-ignore
    const { getByTestId } = render(<CustomAntDOperatorSelector {...props} />);
    const operatorSelecotr = getByTestId("custom-operator-selector");
    expect(operatorSelecotr).toBeInTheDocument();
  });
  it("valueSource is field and operator as isBefore", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: ">",
      title: "title",
      disabled: false,
      multiple: false,
      listsAsArrays: true,
      path: [6],
      level: 3,
      rule: {
        field: "test",
        operator: ">",
        value: "",
        valueSource: "field",
      }
    };
    // @ts-ignore
    const { getByTestId } = render(<CustomAntDOperatorSelector {...props} />);
    const operatorSelecotr = getByTestId("custom-operator-selector");
    expect(operatorSelecotr).toBeInTheDocument();
  });
  it("valueSource is field but not in default operator list", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: "isnull",
      title: "title",
      disabled: false,
      multiple: false,
      listsAsArrays: true,
      path: [6],
      level: 3,
      rule: {
        field: "test",
        operator: "isnull",
        value: "",
        valueSource: "field",
      }
    };
    // @ts-ignore
    const { getByTestId } = render(<CustomAntDOperatorSelector {...props} />);
    expect(props.handleOnChange).toBeCalled();
  });
  it("value field is value", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: ">",
      title: "title",
      disabled: false,
      multiple: false,
      listsAsArrays: true,
      path: [6],
      level: 3,
      rule: {
        field: "test",
        operator: ">",
        value: "",
        valueSource: "value",
      }
    };
    // @ts-ignore
    const { getByTestId } = render(<CustomAntDOperatorSelector {...props} />);
    const operatorSelecotr = getByTestId("custom-operator-selector");
    expect(operatorSelecotr).toBeInTheDocument();
  });
});
