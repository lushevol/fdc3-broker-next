import { act, render, screen } from "@testing-library/react";
import { TimePickerItem } from "./TimePickerItem";

describe("TimePickerItem component", () => {
  it.skip("should render TimePickerItem correctly", async () => {
    const onChangeFun = jest.fn();
    await act(() => {
      render(<TimePickerItem field="timePickerItem" onChange={onChangeFun} />);
    });
    const comp = screen.getByTestId("timePickerItem");
    expect(comp).toBeDefined();
  });
});
