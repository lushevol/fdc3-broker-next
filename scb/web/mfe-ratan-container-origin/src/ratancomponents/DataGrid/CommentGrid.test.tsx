import { act, render, screen } from "@testing-library/react";
import CommentGrid from "./CommentGrid";

afterAll(() => {
  jest.clearAllMocks();
});
jest.mock('ag-grid-react', () => {
  const mockComponent = (c) => {
    return <section>{c.children}</section>;
  }
  return {
    AgGridReact: mockComponent,
  };
});
describe("CommentGrid component", () => {
  it("should render CommentGrid correctly", () => {
    render(<div>
      <CommentGrid data={[{ FMO_Comments: 'testValue' }]} />
    </div>);
    expect(screen).toBeDefined();
  });
});
