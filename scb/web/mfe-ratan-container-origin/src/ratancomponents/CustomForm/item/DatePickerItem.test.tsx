import {
  act,
  render,
  screen,
} from "@testing-library/react";
import { DatePickerItem } from "./DatePickerItem";

describe("DatePickerItem component", () => {
  it("should render DatePickerItem correctly with value", async () => {
    const onChangeFun = jest.fn();
    const update = jest.fn();
    await act(() => {
      render(<DatePickerItem field="datePickerItem" onChange={onChangeFun} value={"2024-09-10"}disabled={false} />);
    });
    const comp = screen.getByTestId("datePickerItem");
    expect(comp).toBeDefined();
  });
  it("should render DatePickerItem correctly without value", async () => {
    const onChangeFun = jest.fn();
    const update = jest.fn();
    await act(() => {
      render(<DatePickerItem field="datePickerItem" onChange={onChangeFun} disabled={false} defaultValue={"2024-09-10"}/>);
    });
    const comp = screen.getByTestId("datePickerItem");
    expect(comp).toBeDefined();
  });
});
