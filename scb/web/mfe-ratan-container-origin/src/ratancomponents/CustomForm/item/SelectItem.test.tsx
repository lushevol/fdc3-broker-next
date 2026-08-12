import {
  act,
  render,
  screen,
  fireEvent,
  getByTestId,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectItem } from "./SelectItem";
import { FC } from "react";

jest.mock("../../../LazyAntd/Select", () => {
  const mockComponent = ({
    onChange,
    onSearch,
    dropdownMatchSelectWidth,
    notFoundContent,
    ...rest
  }) => {
    const testid = rest["data-testid"];
    return (
      <>
        <div data-testid={testid}>
          {notFoundContent}
          <input
            type="text"
            {...rest}
            onChange={() => {
              onChange();
            }}
            data-testid="input"
          />
          <button
            onClick={() => {
              onSearch("unit test");
            }}
            data-testid="search"
          >
            search
          </button>
        </div>
      </>
    );
  };
  return {
    __esModule: true,
    default: mockComponent,
  };
});

describe("SelectItem component", () => {
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should render SelectItem correctly", async () => {
    const newConig = ["newConfig"];
    const onChangeCallback = Promise.resolve(newConig);
    const onChangeFn = jest.fn(() => onChangeCallback);
    const update = jest.fn();
    render(
      <SelectItem field="selectItem" onChange={onChangeFn} update={update} />
    );
    const comp = screen.getByTestId("selectItem");
    expect(comp).toBeDefined();
    const input = screen.getByTestId("input");
    userEvent.type(input, "1");
    expect(onChangeFn).toBeCalled();
    await onChangeCallback;
    expect(update).toBeCalledWith(newConig);
  });
  it("should render SelectItem with SearchFn correctly", async () => {
    jest.useFakeTimers();
    const onSearchCallback = Promise.resolve([]);
    const onSearchFn = jest.fn(() => onSearchCallback);
    const onChangeFn = jest.fn();
    const config = { field: "selectItem" };
    const messageApi = "messageApi";
    render(
      <SelectItem
        field="selectItem"
        onChange={onChangeFn}
        onSearch={onSearchFn}
        configs={[config]}
        messageApi={messageApi}
      />
    );
    const comp = screen.getByTestId("selectItem");
    expect(comp).toBeDefined();
    const search = screen.getByTestId("search");
    userEvent.click(search);
    jest.advanceTimersByTime(1000);
    expect(onSearchFn).toBeCalledWith("unit test", config, messageApi);
    await onSearchCallback;
  });
});
