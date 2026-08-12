import { screen, render } from "@testing-library/react";
import AdvancedSearch from "./export";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Export AdvancedSearch", () => {
  it("should be in the document", async () => {
    const props = {
      type: "",
      fields: [],
      appliedFilter: {
          rowKey: '',
          name: '',
          body: '',
          owner: '1639796',
          type: '',
          isPublic: false,
          creator: '1639796',
          assignee: '',
          assigneeList: '',
      },
      setAppliedFilter: jest.fn(),
      queryFilterList: jest.fn(),
      queryFilterDetails: jest.fn(),
      createFilter: jest.fn(),
      saveFilter: jest.fn(),
      deleteFilter: jest.fn(),
      getOperators: jest.fn(),
    };
    render(<AdvancedSearch {...props} />);
    expect(screen).toBeDefined();
  });
});
