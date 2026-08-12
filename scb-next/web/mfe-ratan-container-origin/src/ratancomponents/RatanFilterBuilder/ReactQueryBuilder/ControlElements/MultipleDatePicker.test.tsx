import { render } from "@testing-library/react";
import { MultipleDatePicker } from "./MultipleDatePicker";

afterAll(() => {
  vi.clearAllMocks();
});

describe("MultipleDatePicker component", () => {
  it("time type", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: "['2024-01-02', '2024-01-04']",
      title: "Value",
      disabled: false,
      multiple: true,
      listsAsArrays: true,
      type: "time",
      path: [2],
      level: 1,
    };
    const { getByTestId } = render(<MultipleDatePicker {...props} />);
    const multipleDatePicker = getByTestId("multiple-date-picker-time");
    expect(multipleDatePicker).toBeDefined();
  });
  it("datetime type", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: "['2024-01-02', '2024-01-04']",
      title: "Value",
      disabled: false,
      multiple: true,
      listsAsArrays: true,
      type: "datetime",
      path: [2],
      level: 1,
    };
    const { getByTestId } = render(<MultipleDatePicker {...props} />);
    const multipleDatePicker = getByTestId("multiple-date-picker-datetime");
    expect(multipleDatePicker).toBeDefined();
  });
  it("date type", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: vi.fn(),
      options: [],
      value: "['2024-01-02', '2024-01-04']",
      title: "Value",
      disabled: false,
      multiple: true,
      listsAsArrays: true,
      type: "date",
      path: [2],
      level: 1,
    };
    const { getByTestId } = render(<MultipleDatePicker {...props} />);
    const multipleDatePicker = getByTestId("multiple-date-picker-date");
    expect(multipleDatePicker).toBeDefined();
  });
});
