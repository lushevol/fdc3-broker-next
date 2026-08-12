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
    queryFilterList: vi.fn(async () => ([])),
    queryFilterDetails: vi.fn(async () => (mockFilterRecord)),
    createFilter: vi.fn(async () => (mockFilterRecord)),
    saveFilter: vi.fn(async () => (mockFilterRecord)),
    deleteFilter: vi.fn(async () => (undefined)),
    getOperators: vi.fn(() => ([])),
  }}>
    <AdvancedSearchContext.Provider value={{
      appliedFilter: mockFilterRecord,
      setAppliedFilter: vi.fn(async () => (undefined)),
      filterList: [mockFilterRecord],
      setFilterList: vi.fn(async () => (undefined)),
      displayFilter: mockFilterRecord,
      setDisplayFilter: vi.fn(async () => (mockFilterRecord)),
    }}>
      {children}
    </AdvancedSearchContext.Provider>
  </AdvancedSearchStaticContext.Provider>
  const { result } = renderHook(() => useFilterBuilderContext(), { wrapper });

  result.current.onSelectFilterByKey("test_id");
  result.current.onApplyFilterByKey("test_id");
  result.current.onClearAppliedFilter();
});