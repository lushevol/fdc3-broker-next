import { screen, render } from "@testing-library/react";
import AdvancedSearch from "./export";

afterAll(() => {
  vi.clearAllMocks();
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
      setAppliedFilter: vi.fn(),
      queryFilterList: vi.fn(),
      queryFilterDetails: vi.fn(),
      createFilter: vi.fn(),
      saveFilter: vi.fn(),
      deleteFilter: vi.fn(),
      getOperators: vi.fn(),
    };
    render(<AdvancedSearch {...props} />);
    expect(screen).toBeDefined();
  });
});
