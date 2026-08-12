import { render, fireEvent } from "@testing-library/react";
import ItemsComponent, { QuickSearchInput, QuickSearchPicker, QuickSearchSelect, QuickSearchManyInOne, QuickSearchAutoComplete, filterSort, autoCompletefilterOption } from "./ItemsComponent";
import Select from "../../LazyAntd/Select";

vi.mock("../../LazyAntd/Input", () => {
  const mockComponent = (c) => {
    const {onChange} = c;
    onChange({target: {value: "a,b"}});
    return <section data-testid="mock-input">{c.children}</section>;
  };
  return {
    __esModule: true,
    default: mockComponent,
  };
});

vi.mock("../../LazyAntd/RangePicker", () => {
  const mockComponent = (c) => {
    const {onChange} = c;

    return <section data-testid="mock-rangePicker">
      <div data-testid="mock-date" onClick={onChange("test",["2024-07-01","2024-07-02"])}>mock-single-date</div>
      <div data-testid="mock-empty" onClick={onChange("test",[])}>mock-empty</div>
      {c.children}
      </section>;
  };
  return {
    __esModule: true,
    default: mockComponent,
  };
});

vi.mock("../../LazyAntd/Select", () => {
  const mockComponent = vi.fn((c) => {
    const {onChange} = c;
    onChange({target: {value: "a,b"}});
    return <section data-testid="mock-select">{c.children}</section>;
  });
  const mockOption = vi.fn((props)=>{
    const {key, value} = props;
    return <div data-testId={key}>{value}</div>
  })
  return {
    __esModule: true,
    default: mockComponent,
    Option: mockOption
  };
});
vi.mock("lodash/debounce", () =>{
  const mockfn = (fn) =>{return fn}
  return {
    __esModule: true,
    default: mockfn,
  };
})
vi.mock("./itemsFun", () =>{
  const debounceFindConterparty = vi.fn((value,fieldName, callback)=>{
    callback([{
      label: "test",
      value: "test"
    }])
  });
  return {
    debounceFindConterparty: debounceFindConterparty
  }
})

describe("ItemsComponet", () => {
  it("QuickSearchInput with commas", () => {
    const config = {
      label: "Trade ID",
      field: "Trade_Id",
      component: "QuickSearchInput",
      placeholder: "Multiple searches separated by commas",
      suffix: "Multiple searches separated by commas",
      commas: true,
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchInput
        config={config}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );
    expect(onChangeCallback).toBeCalledWith("Trade_Id", ["a","b"])
  });
  it("QuickSearchInput no commas", () => {
    const config = {
      label: "Trade ID",
      field: "Trade_Id",
      component: "QuickSearchInput",
      placeholder: "Multiple searches separated by commas",
      suffix: "Multiple searches separated by commas",
      commas: false,
    };
    const onChangeCallback = vi.fn();
    const { getAllByTestId } = render(
      <QuickSearchInput
        config={config}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );
    expect(onChangeCallback).toBeCalledWith("Trade_Id", "a,b")
  });
  it("QuickSearchPicker", async () => {
    const config = {
      label: "Trade Date",
      field: "Trade_Date",
      component: "QuickSearchPicker",
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchPicker
        config={config}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );
    const change1= getByTestId("mock-date");
    const change2= getByTestId("mock-empty");
    fireEvent.click(change1);
    expect(onChangeCallback).toBeCalledWith("Trade_Date", ["2024-07-01","2024-07-02"]);
    fireEvent.click(change2);
    expect(onChangeCallback).toBeCalledWith("Trade_Date", null);
  });

  it("QuickSearchSelect", async () => {
    const config: QuickSearchItemConfig = {
      label: "Source System",
      field: "Data_Flow.Data_Source_System",
      component: "QuickSearchSelect",
      selectMode: "multiple",
      valueList: [
        {
          label: "Blade",
          value: "Blade",
        },
        {
          label: "Murex",
          value: "Murex",
        }
      ],
    };
    vi.mocked(Select).mockImplementation((props) => {
      const {
        filterOption,
        children,
        onChange,
        filterSort,
        onDropdownVisibleChange,
      } = props;
      return (
        <section data-testid="mock-select">
          <div
            data-testid="mock-change"
            onClick={() => {
              onChange("test");
            }}
          >
            mock-change
          </div>
          <div
            data-testid="mock-filter"
            onClick={() => {
              filterOption("test", { children: "t", value: "test" });
            }}
          >
            mock-change
          </div>
          <div
            data-testid="mock-filterSort"
            onClick={() => {
              filterSort({
                key: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Spot",
                value: "Instrument_Common.ISDA_Taxonomy/_/ForeignExchange:Spot",
                children: "ForeignExchange:Spot",
              });
            }}
          >
            mock-filterSort
          </div>
          <div
            data-testid="mock-dropdownVisibleChange"
            onClick={() => {
              onDropdownVisibleChange(true);
            }}
          >
            mock-dropdownVisibleChange
          </div>
          <div>{children}</div>
        </section>
      );
    });
    const onChangeCallback = vi.fn();
    const { debug, getByTestId } = render(
      <QuickSearchSelect
        config={config}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );
    const changeMock = getByTestId("mock-change");
    const filterMock = getByTestId("mock-filter");
    const filterSortMock = getByTestId("mock-filterSort");
    const dropdownVisibleChangeMock = getByTestId("mock-dropdownVisibleChange");
    fireEvent.click(filterSortMock);
    fireEvent.click(dropdownVisibleChangeMock);
    fireEvent.click(changeMock);
    expect(onChangeCallback).toBeCalledWith("Data_Flow.Data_Source_System", "test");
    fireEvent.click(filterMock);

    const config2: QuickSearchItemConfig = {
      label: "Source System",
      field: "Data_Flow.Data_Source_System",
      component: "QuickSearchSelect",
      selectMode: "multiple",
      valueList: [
        "test"
      ],
    };
    render(
      <QuickSearchSelect
        config={config2}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );

    const config3: QuickSearchItemConfig = {
      label: "Source System",
      field: "Data_Flow.Data_Source_System",
      component: "QuickSearchSelect",
      selectMode: "tags",
      valueList: [
        "test"
      ],
    };
    render(
      <QuickSearchSelect
        config={config3}
        size={"small"}
        value="test"
        onChange={onChangeCallback}
      />
    );
  })

  it("QuickSearchManyInOne", async () => {
    const config = {
      "component": "QuickSearchManyInOne",
      "label": "test",
      "field": "test",
      "manyInOne": [
        {
          "label": "Trade ID",
          "field": "Trade_Id",
          "component": "QuickSearchInput",
          "placeholder": "Multiple searches separated by commas",
          "suffix": "Multiple searches separated by commas",
          "commas": true
        }
      ]
    }
    const changeCallback = vi.fn();
    const removeCallback = vi.fn();
    const filter = {};
    const messageApi = {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
      destroy: vi.fn(),
    };
    render(<QuickSearchManyInOne size="small" labelWidth={100} formWidth={100} filter={filter} config = {config} onChange={changeCallback} onRemove={removeCallback} messageApi={messageApi}/> )
  })
  it("ItemsComponent", async () => {
    const config = {
      "label": "Currency Pair",
      "field": "Instrument_Common.Currency_Pair",
      "component": "QuickSearchInput"
    };
    const changeCallback = vi.fn();
    const removeCallback = vi.fn();
    const filter = {}
    const messageApi = {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
      destroy: vi.fn(),
    };
    render(<ItemsComponent size="small" labelWidth={100} formWidth={100} filter={filter} config = {config} onChange={changeCallback} onRemove={removeCallback} messageApi={messageApi}/>)
  })
});

describe("QuickSearchAutoComplete", () => {
  it("renders options from valueList (string and object) and calls onChange", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: [
        "Option1",
        { label: "Option2", value: "option2" }
      ]
    };
    const onChangeCallback = vi.fn();
    const { getByTestId, rerender } = render(
      <QuickSearchAutoComplete
        config={config as any}
        size="small"
        value=""
        onChange={onChangeCallback}
      />
    );
    // Should render with correct test id
    expect(getByTestId("autoCompleteFieldAutoComplete")).toBeInTheDocument();

    // Simulate selecting an option
    fireEvent.change(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!, { target: { value: "Option1" } });
    fireEvent.blur(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!);
    // onChange is called when value changes
    fireEvent.change(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!, { target: { value: "Option2" } });
    fireEvent.blur(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!);

    // Simulate clear
    fireEvent.change(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!, { target: { value: "" } });
    fireEvent.blur(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!);

    // onChange is called with correct field and value
    expect(onChangeCallback).toHaveBeenCalledWith("Auto_Field", "Option1");
    expect(onChangeCallback).toHaveBeenCalledWith("Auto_Field", "Option2");
  });

  it("filters options by input (string and object)", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: [
        "Alpha",
        { label: "Beta", value: "beta" },
        { label: "Gamma", value: "gamma" }
      ]
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchAutoComplete
        config={config as any}
        size="small"
        value=""
        onChange={onChangeCallback}
      />
    );
    // Simulate typing to filter
    const input = getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!;
    fireEvent.change(input, { target: { value: "be" } });
    fireEvent.blur(input);
    expect(onChangeCallback).toHaveBeenCalledWith("Auto_Field", "be");
  });

  it("handles empty valueList gracefully", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: []
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchAutoComplete
        config={config}
        size="small"
        value=""
        onChange={onChangeCallback}
      />
    );
    expect(getByTestId("autoCompleteFieldAutoComplete")).toBeInTheDocument();
    // No options to select, but should not crash
    fireEvent.change(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!, { target: { value: "test" } });
    fireEvent.blur(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!);
    expect(onChangeCallback).toHaveBeenCalledWith("Auto_Field", "test");
  });

  it("resets searchText on dropdown open", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: ["Alpha"]
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchAutoComplete
        config={config}
        size="small"
        value=""
        onChange={onChangeCallback}
      />
    );
    // Open dropdown
    fireEvent.focus(getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!);
    // Should not throw
  });

  it("disables input when config.disabled is true", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: ["Alpha"],
      disabled: true
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchAutoComplete
        config={config}
        size="small"
        value=""
        onChange={onChangeCallback}
      />
    );
    const input = getByTestId("autoCompleteFieldAutoComplete").querySelector("input")!;
    expect(input).toBeDisabled();
  });

  it("renders with inSearching prop", () => {
    const config = {
      label: "AutoComplete Field",
      field: "Auto_Field",
      component: "QuickSearchAutoComplete",
      valueList: ["Alpha"]
    };
    const onChangeCallback = vi.fn();
    const { getByTestId } = render(
      <QuickSearchAutoComplete
        config={config}
        size="small"
        value=""
        onChange={onChangeCallback}
        inSearching={true}
      />
    );
    expect(getByTestId("autoCompleteFieldAutoComplete")).toHaveClass("in-searching");
  });
});

describe("filterSort", () => {
  it("returns -1 when searchText matches optionA.label (case-insensitive)", () => {
    const searchText = "alpha";
    const optionA = { label: "Alpha", value: "value1" };
    expect(filterSort(searchText)(optionA)).toBe(-1);
  });

  it("returns -1 when searchText matches part of optionA.label", () => {
    const searchText = "ph";
    const optionA = { label: "Alpha", value: "value1" };
    expect(filterSort(searchText)(optionA)).toBe(-1);
  });

  it("returns 1 when searchText does not match optionA.label", () => {
    const searchText = "beta";
    const optionA = { label: "Alpha", value: "value1" };
    expect(filterSort(searchText)(optionA)).toBe(1);
  });

  it("returns 0 when searchText is empty", () => {
    const searchText = "";
    const optionA = { label: "Alpha", value: "value1" };
    expect(filterSort(searchText)(optionA)).toBe(0);
  });

  it("handles undefined label gracefully", () => {
    const searchText = "alpha";
    const optionA = { value: "value1" } as any;
    expect(filterSort(searchText)(optionA)).toBe(1);
  });
});

describe("autoCompletefilterOption", () => {
  it("returns true if item is undefined", () => {
    expect(autoCompletefilterOption("test", undefined)).toBe(true);
  });

  it("returns true if item is null", () => {
    expect(autoCompletefilterOption("test", null as any)).toBe(true);
  });

  it("returns true if item is an empty string", () => {
    expect(autoCompletefilterOption("test", "")).toBe(true);
  });

  it("returns true if input is found in item (case-insensitive)", () => {
    expect(autoCompletefilterOption("alpha", "Alpha Option")).toBe(true);
    expect(autoCompletefilterOption("ALPHA", "alpha option")).toBe(true);
  });

  it("returns false if input is not found in item", () => {
    expect(autoCompletefilterOption("beta", "Alpha Option")).toBe(false);
  });
});
