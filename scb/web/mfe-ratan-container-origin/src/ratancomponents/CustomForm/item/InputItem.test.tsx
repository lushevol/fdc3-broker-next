import {
  act,
  render,
  screen,
  fireEvent,
  getByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputItem } from "./InputItem";

describe("InputItem component", () => {
  it("should render InputItem correctly", async () => {
    const newConfig = ["newconifg"];
    const configs = ["config"];
    const form = "form";
    const data = "data";
    const onChangeCallback = Promise.resolve(newConfig);
    const onChangeFun = jest.fn(() => onChangeCallback);
    const update = jest.fn();
    await act(() => {
      render(
        <InputItem
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
    expect(onChangeFun).toBeCalledWith("1", configs, form, data);
    await onChangeCallback;
    expect(update).toBeCalledWith(newConfig);
  });
});
