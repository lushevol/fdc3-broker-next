import { act, fireEvent, render, screen } from "@testing-library/react";
import CommentsChangeCell from "./CommentsChangeCell";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock('ag-grid-react', () => {
  const mockComponent = (c) => {
    return <section>{c.children}</section>;
  }
  return {
    AgGridReact: mockComponent,
  };
});

describe("Comment Change Cell component", () => {
  it("should render Comment Change Cellcorrectly", () => {
    const data = {
        FMO_Comments: null
    };
    render(<div>
      <CommentsChangeCell data={data} />
    </div>);
    expect(screen).toBeDefined();
    expect(screen.getByText("N/A")).toBeInTheDocument();

  });
  it("should render Comment Change Cell correctly", async () => {
    const data = {
       
        FMO_Comments: [{
            "FMO_Comment": "test",
            "FMO_Comment_Timestamp": new Date().getTime(),
            "FMO_Comment_Updater": "test"
          }],
          Comments_Change: {
            "Field_Name": "FMO_Comments",
            "Old_Value": [],
            "New_Value": [
                {
                    "FMO_Comment": "SR-ZZ-20240531-M04279",
                    "FMO_Comment_Updater": "1290811",
                    "FMO_Comment_Timestamp": "2024-06-03T09:43:39Z"
                }
            ]
        },
    }
    render(<div>
      <CommentsChangeCell data={data} />
    </div>);
    expect(screen).toBeDefined();
    const btn = screen.getByTestId("comments-change-cell-btn");
    fireEvent.click(btn);
  });
});
