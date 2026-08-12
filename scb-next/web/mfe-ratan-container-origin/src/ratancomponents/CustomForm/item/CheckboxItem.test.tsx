import {
  act,
  render,
  screen,
  fireEvent,
  getByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxItem } from "./CheckboxItem";

vi.mock("../../../LazyAntd/Checkbox", () => ({
  default: ({ onChange, ...props }) => (
    <input type="checkbox" {...props} onChange={(event) => onChange(event)} />
  ),
}));

describe("CheckboxItem component", () => {
  it("should render CheckboxItem correctly", async () => {
    const onChange = vi.fn();
    await act(() => {
      render(
        <CheckboxItem
          field="checkboxItem"
          disabled={false}
          onChange={onChange}
        />
      );
    });
    const comp = screen.getByTestId("checkboxItem");
    expect(comp).toBeDefined();
    expect(onChange).toBeCalledWith("N");
    userEvent.click(comp);
    expect(onChange).toBeCalledWith("Y");
  });
});
