import { render, fireEvent } from "@testing-library/react";
import { debounceFindConterparty } from "./itemsFun";
import { QuickSearchDynamickSelect } from "./QuickSearchDynamickSelect";
import Select, { Option } from "../../LazyAntd/Select";

jest.mock("../../LazyAntd/Select", () => {
  const mockComponent = jest.fn((c) => {
    const { onChange } = c;
    onChange({ target: { value: "a,b" } });
    return <section data-testid="mock-select">{c.children}</section>;
  });
  const mockOption = jest.fn((props) => {
    const { key, value } = props;
    return <div data-testId={key}>{value}</div>;
  });
  return {
    __esModule: true,
    default: mockComponent,
    Option: mockOption,
  };
});

jest.mock("lodash/debounce", () => {
  const mockfn = (fn) => {
    return fn;
  };
  return {
    __esModule: true,
    default: mockfn,
  };
});
jest.mock("./itemsFun", () => {
  const debounceFindConterparty = jest.fn((value, fieldName, callback) => {
    callback([
      {
        label: "test",
        value: "test",
      },
    ]);
  });
  return {
    debounceFindConterparty: debounceFindConterparty,
  };
});

Object.defineProperty(navigator, "clipboard", {
  value: { writeText: jest.fn() },
  writable: true,
});

describe("QuickSearchDynamickSelect Component", () => {
  it("QuickSearchDynamickSelect", async () => {
    jest.mocked(Select).mockImplementation((props) => {
      const {
        onSearch,
        children,
        value,
        tagRender,
        onSelect,
        onDeselect,
        onClear,
        onBlur,
        onChange,
      } = props;
      return (
        <section data-testid="mock-select">
          <div
            data-testid="mock-search"
            onClick={() => {
              onSearch("test");
            }}
          >
            mock-search
          </div>
          <div
            data-testid="mock-selected"
            onClick={() => {
              onSelect("test");
            }}
          >
            mock-selected
          </div>
          <div
            data-testid="mock-tagRender"
            onClick={() => {
              tagRender({ value: "test", closeable: true, onClose: jest.fn() });
            }}
          >
            mock-tagRender
          </div>
          <div
            data-testid="mock-blur"
            onClick={() => {
              onBlur();
            }}
          >
            mock-blur
          </div>
          <div
            data-testid="mock-deselected"
            onClick={() => {
              onDeselect("test");
            }}
          >
            mock-deselected
          </div>
          <div
            data-testid="mock-clear"
            onClick={() => {
              onClear();
            }}
          >
            mock-clear
          </div>
          <div
            data-testid="mock-change"
            onClick={() => {
              onChange("test");
            }}
          >
            mock-change
          </div>
          <div>{children}</div>
        </section>
      );
    });
    jest.mocked(Option).mockImplementation((props) => {
      const { key, children } = props;
      return <div data-testId={key}>{children}</div>;
    });

    jest
      .mocked(debounceFindConterparty)
      .mockImplementation((value, fieldName, callback) => {
        callback([
          {
            label: "test",
            value: "test",
          },
          {
            label: "not match",
            value: "anyvalue",
          },
        ]);
      });
    const config = {
      label: "Counterparty",
      field: "Entity.Counterparty_SCI_FMID",
      component: "QuickSearchDynamickSelect",
      selectMode: "multiple",
      searchFun: "debounceFindConterparty",
      searchField: "fmId",
      copyOption: true,
    };
    const onChangeCallback = jest.fn();
    const messageApi = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    };
    const { getByTestId, getAllByTestId } = render(
      <QuickSearchDynamickSelect
        config={config}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
        messageApi={messageApi}
      />
    );

    const searchBtn = getByTestId("mock-search");
    fireEvent.click(searchBtn);

    const ContentCopyIcons = getAllByTestId("ContentCopyIcon");
    fireEvent.click(ContentCopyIcons[0]);
    expect(navigator.clipboard.writeText).toBeCalledWith("test");
    expect(messageApi.success).toBeCalledWith("test copy succeeded");

    const selected = getByTestId("mock-selected");
    fireEvent.click(selected);
    const tagRender = getByTestId("mock-tagRender");
    fireEvent.click(tagRender);
    const blurBtn = getByTestId("mock-blur");
    fireEvent.click(blurBtn);
    const deSelected = getByTestId("mock-deselected");
    fireEvent.click(deSelected);
    const clearBtn = getByTestId("mock-clear");
    fireEvent.click(clearBtn);
    const change = getByTestId("mock-change");
    fireEvent.click(change);
    expect(onChangeCallback).toBeCalledWith(
      "Entity.Counterparty_SCI_FMID",
      "test"
    );
  });
});
