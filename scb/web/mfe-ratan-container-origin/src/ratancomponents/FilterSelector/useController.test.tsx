import { render, renderHook, act } from "@testing-library/react";
import useController, { FilterSelectorProps, handleNewFilter } from "./useController";
import { Service } from "../../Root/import";
import { useEffect } from "react";
import { message, Modal } from "antd";
import * as FilterBuilderNext from "./FilterBuilderNext";

jest.mock("react-querybuilder", () => {
  const actual = jest.requireActual("react-querybuilder");
  return {
    ...actual,
    formatQuery: jest.fn(),
  };
});

import { formatQuery } from "react-querybuilder";

jest.mock("antd", () => {
  const Modal = {
    confirm: jest.fn(),
  };
  const message = {
    useMessage: () => {
      const messageApi = jest.fn;
      return [messageApi, <></>];
    },
  };
  const Typography = {
    Text: ()=> <></>
  }
  return {
    __esModule: true,
    Modal,
    message,
    Typography
  };
});
describe("useController", () => {
  test("handleNewFilter should format and return transformed filter payload", () => {
    const localFilter = ["desk=LDN"];
    const filter = {
      combinator: "and",
      rules: [{ field: "tradeId", operator: "=", value: "T1" }],
    } as any;
    const rawFields = [{ name: "tradeId" }];
    const localFilterBody = [{ key: "desk", values: ["LDN"] }];
    const normalizedFilter = {
      combinator: "and",
      rules: [{ field: "tradeId", operator: "=", value: "T1" }],
    };

    const getSearchFilterSpy = jest
      .spyOn(FilterBuilderNext, "getSearchFilter")
      .mockReturnValue(localFilterBody as any);
    const handleNullValueSpy = jest
      .spyOn(FilterBuilderNext, "handleNullValue")
      .mockReturnValue(normalizedFilter as any);
    const formatQueryMock = jest.mocked(formatQuery);
    formatQueryMock.mockReturnValue("mock-sql");

    const result = handleNewFilter(
      { filter, localFilter },
      "cashflow",
      rawFields as any
    );

    expect(getSearchFilterSpy).toHaveBeenCalledWith("cashflow", localFilter);
    expect(handleNullValueSpy).toHaveBeenCalledWith(filter, rawFields);
    expect(formatQueryMock).toHaveBeenCalledWith(normalizedFilter, "sql");
    expect(result).toEqual({
      sql: "mock-sql",
      localFilterBody,
      json: normalizedFilter,
    });

    getSearchFilterSpy.mockRestore();
    handleNullValueSpy.mockRestore();
    formatQueryMock.mockReset();
  });

  test("test promise resolve", async () => {
    const { service } = Service;
    const { confirm } = Modal;
    const promise1 = Promise.resolve([{ name: "TEST" }]);
    const promise2 = Promise.resolve(true);
    const promise3 = Promise.resolve({body:JSON.stringify({field:"test"})});
    jest.spyOn(service, "get").mockImplementation((url, data) => {
      if (url == "/api/ratan/v3/customview/filters") {
        return promise1;
      }
      if (url == "/api/ratan/v3/customview/filters/test") {
        return promise3;
      }
    });
    jest.spyOn(service, "delete").mockImplementation((url, data) => {
      return promise2
    });
    jest.mocked(confirm).mockImplementation((props) => {
      const { onOk } = props;
      onOk && onOk();
      return { update: () => {}, destroy: () => {} };
    });
    const succFn = jest.fn()
    jest.spyOn(message, "useMessage").mockImplementation(() => {
      const messApiFn = {
        info: jest.fn(),
        success: succFn,
        error: jest.fn(),
        warning: jest.fn(),
        loading: jest.fn(),
        open: jest.fn(),
        destroy: jest.fn(),
      }
      return [messApiFn, <></>];
    });
    const onClosedFilterFn = jest.fn();
    const props: FilterSelectorProps = {
      filterFieldType: "filterType",
      variableConfig: {
        date: ["DATE_VAR"]
      },
      bodyDefaultValue: "",
      CASCADER_OPTIONS: {},
      FILTER_FIELDS: {},
      searchFunction: (filter, callback) => {
        callback && callback(true);
      },
      switchSearch: "test",
      onSavedFilter: (filter) => {},
      onClosedFilter: onClosedFilterFn,
    };
    let expectFields;
    const Comp = (props) => {
      const {
        filterList,
        currentFilter,
        setFilterFields,
        delFilter,
        search,
        clear,
        changeFilter,
        close,
      } = useController(props);
      useEffect(() => {
        search({
          filter: {
            combinator: "and",
            rules: [
              {
                field: "test",
                operator: "=",
                value: "1",
              },
            ],
          },
          localFilter: [],
        });
        expectFields = setFilterFields([
          {
            field: ["test1", "test2"],
            operator: "=",
            values: "1",
            name: "test",
          },
        ]);
        delFilter("test");
        clear(false);
        changeFilter("test");
        close("test");
      }, []);
      return <>Test</>;
    };
    render(<Comp {...props} />);
    expect(expectFields).toEqual([
      {
        field: "test1.test2",
        operator: "=",
        values: "1",
      },
    ]);
    await promise1;
    expect(succFn).toBeCalledWith("Search success!");
    await promise2;
    expect(succFn).toBeCalledWith("Filter removed successfully!");
    expect(onClosedFilterFn).toBeCalledWith("test", undefined);
  });

  test("test promise reject", async () => {
    const { service } = Service;
    const { confirm } = Modal;
    const promise1 = Promise.resolve([{ name: "TEST" }]);
    const promise2 = Promise.reject({reason: "test"});
    const promise3 = Promise.reject({message: "JSON"});
    jest.spyOn(service, "get").mockImplementation((url, data) => {
      if (url == "/api/ratan/v3/customview/filters/test") {
        return promise3;
      }
      return promise1
    });
    jest.spyOn(service, "delete").mockImplementation((url, data) => {
      return promise2
    });
    jest.mocked(confirm).mockImplementation((props) => {
      const { onOk } = props;
      onOk && onOk();
      return { update: () => {}, destroy: () => {} };
    });
    const errorFn = jest.fn()
    jest.spyOn(message, "useMessage").mockImplementation(() => {
      const messApiFn = {
        info: jest.fn(),
        success: jest.fn(),
        error: errorFn,
        warning: jest.fn(),
        loading: jest.fn(),
        open: jest.fn(),
        destroy: jest.fn(),
      }
      return [messApiFn, <></>];
    });

    const props: FilterSelectorProps = {
      filterFieldType: "filterType",
      variableConfig: {
        date: ["DATE_VAR"]
      },
      bodyDefaultValue: "",
      CASCADER_OPTIONS: {},
      FILTER_FIELDS: {},
      searchFunction: (filter, callback) => {},
      switchSearch: "test",
      onSavedFilter: (filter) => {},
      onClosedFilter: (filter) => {},
    };
    const Comp = (props) => {
      const {
        delFilter,
        clear,
        changeFilter,
        close,
      } = useController(props);
      useEffect(() => {
        delFilter("test");
        changeFilter("test");
      }, []);
      return <>Test</>;
    };
    render(<Comp {...props} />);
    try {
      await promise2;
      expect(errorFn).toBeCalledWith("Remove filter failed!");
    }catch(e) {
      
    }
    
  });

  test("close FN", ()=>{
    jest.useFakeTimers("modern");
    const searchFN1 = jest.fn((filter, callback) => {
      callback && callback(true)
    });
    const props: FilterSelectorProps = {
      filterFieldType: "filterType",
      variableConfig: {
        date: ["DATE_VAR"]
      },
      bodyDefaultValue: "",
      CASCADER_OPTIONS: {},
      FILTER_FIELDS: {},
      searchFunction: searchFN1,
      switchSearch: "test",
      onSavedFilter: (filter) => {},
      initState: {
        currentFilter: "test1",
        filterList : {
          "filterType" : [
            {rowKey: "test1"},
            {rowKey: "test"}
          ]
        }
      },
      onClosedFilter: jest.fn(),
    };
    const {result} = renderHook(()=> useController(props));
    act(() => {
      result.current.close("test", "close");
      jest.advanceTimersByTime(100);
      expect(props.onClosedFilter).toBeCalled();

      result.current.close(undefined, "close");
      jest.advanceTimersByTime(100);
      result.current.search([{field: ["test"], operator: "=", values: "test", name: "test"}]);
      expect(searchFN1).toBeCalled()
    })
    const searchFN2 = jest.fn((filter, callback) => {
      callback && callback(null)
    });
    props.searchFunction = searchFN2;

    const {result: result2} = renderHook(()=> useController(props));
    act(()=>{
      result2.current.search([{field: ["test"], operator: "=", values: "test", name: "test"}]);
      expect(searchFN2).toBeCalled()
    })

    const searchFN3 = jest.fn((filter, callback) => {
      callback && callback(false)
    });
    props.searchFunction = searchFN3;
    const {result: result3} = renderHook(()=> useController(props));
    act(()=>{
      result3.current.search([{field: ["test"], operator: "=", values: "test", name: "test"}]);
      expect(searchFN3).toBeCalled()
    })
  })
});
