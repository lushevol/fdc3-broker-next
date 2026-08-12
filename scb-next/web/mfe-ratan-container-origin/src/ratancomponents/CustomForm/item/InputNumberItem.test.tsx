import {
  act,
  render,
  screen,
  fireEvent,
  getByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputNumberItem } from "./InputNumberItem";

vi.mock("../../../LazyAntd/InputNumber", () => ({
  default: ({ onChange, ...props }) => (
    <input {...props} onChange={(event) => onChange(Number(event.target.value))} />
  ),
}));

describe("InputNumberItem component", () => {
  it("should render InputNumberItem correctly", async () => {
    const newConfig = ["newconifg"];
    const configs = ["config"];
    const form = "form";
    const data = "data";
    const onChangeCallback = Promise.resolve(newConfig);
    const onChangeFun = vi.fn(() => onChangeCallback);
    const update = vi.fn();
    await act(() => {
      render(
        <InputNumberItem
          field="inputItem"
          disabled={false}
          onChange={onChangeFun}
          configs={configs}
          form={form}
          data={data}
          update={update}
        />
      );
    });
    const comp = screen.getByTestId("inputItem");
    expect(comp).toBeDefined();
    userEvent.type(comp, "1");
    expect(onChangeFun).toBeCalledWith(1, configs, form, data);
    await onChangeCallback;
    expect(update).toBeCalledWith(newConfig);
  });
});
