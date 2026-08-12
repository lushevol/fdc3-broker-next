import { renderHook } from "@testing-library/react";
import { useFilterBuilderContext, AdvancedSearchStaticContext, AdvancedSearchContext } from "./useContext";

it("useFilterBuilderContext", () => {
  const mockFilterRecord = {
    rowKey: "test_id",
    name: "",
    body: "test_body",
    owner: "test_user",
    creator: "test_user",
    type: "",
    isPublic: false,
    moduleOwner: "",
    assignee: "",
    assigneeList: "",
    updateFlag: "",
  };
  const wrapper = ({ children }) => <AdvancedSearchStaticContext.Provider value={{
    type: "",
    fields: [],
    queryFilterList: jest.fn(async () => ([])),
    queryFilterDetails: jest.fn(async () => (mockFilterRecord)),
    createFilter: jest.fn(async () => (mockFilterRecord)),
    saveFilter: jest.fn(async () => (mockFilterRecord)),
    deleteFilter: jest.fn(async () => (undefined)),
    getOperators: jest.fn(() => ([])),
  }}>
    <AdvancedSearchContext.Provider value={{
      appliedFilter: mockFilterRecord,
      setAppliedFilter: jest.fn(async () => (undefined)),
      filterList: [mockFilterRecord],
      setFilterList: jest.fn(async () => (undefined)),
      displayFilter: mockFilterRecord,
      setDisplayFilter: jest.fn(async () => (mockFilterRecord)),
    }}>
      {children}
    </AdvancedSearchContext.Provider>
  </AdvancedSearchStaticContext.Provider>
  const { result } = renderHook(() => useFilterBuilderContext(), { wrapper });

  result.current.onSelectFilterByKey("test_id");
  result.current.onApplyFilterByKey("test_id");
  result.current.onClearAppliedFilter();
});