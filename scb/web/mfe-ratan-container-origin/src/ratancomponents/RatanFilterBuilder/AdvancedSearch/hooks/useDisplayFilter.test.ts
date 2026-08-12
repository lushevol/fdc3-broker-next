import { renderHook } from "@testing-library/react";
import { useDisplayFilter } from "./useDisplayFilter";

it("handleDisplayFilterSave", () => {
  const mockFilter = {
    rowKey: "test_id",
    name: "",
    body: JSON.stringify({
      rules: [
        {
          field: "test_field",
          operator: "test_operator",
          value: "test_value",
        }
      ]
    }),
    owner: "test_user",
    creator: "test_user",
    type: "",
    isPublic: false,
    moduleOwner: "",
    assignee: "",
    assigneeList: "",
    updateFlag: "",
  }
  const mockSetFilterList = jest.fn();
  const mockDeleteFilter = jest.fn(async () => undefined);
  const mockSaveFilter = jest.fn(async () => mockFilter);
  const mockCreateFilter = jest.fn(async () => mockFilter);
  const { result } = renderHook(() => useDisplayFilter({
    appliedFilter: null,
    setFilterList: mockSetFilterList,
    deleteFilter: mockDeleteFilter,
    saveFilter: mockSaveFilter,
    createFilter: mockCreateFilter,
  }));

  result.current.handleDisplayFilterSave();
  result.current.handleDisplayFilterDelete();
  result.current.handleDisplayFilterClearBody();
  result.current.handleDisplayFilterReset();
  result.current.handleDuplicateFilter();
  result.current.handleDisplayFilterCreateNew();
});