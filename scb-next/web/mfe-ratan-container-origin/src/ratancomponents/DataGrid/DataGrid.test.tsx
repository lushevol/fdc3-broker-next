import { render } from "@testing-library/react";
import DataGrid, {checkVisibleInDocument} from "./DataGrid";

vi.mock("ag-grid-react", () => {
  return {
    AgGridReact: () => {
      return <div>ag-grid</div>;
    }
  }
})

test("DataGrid", () => {
  render(<DataGrid />)
})

test("checkVisibleInDocument", () => {
  const result0 = checkVisibleInDocument(null);
  expect(result0).toEqual(false);

  const node = {
    getClientRects: () => [],
  }
  const result = checkVisibleInDocument(node);
  expect(result).toEqual(false);

  const node2 = {
    offsetHeight: 222,
    offsetWidth: 222,
    getClientRects: () => [{}],
    getBoundingClientRect: () => ({
      bottom: 20,
      height: 10,
      left: 30,
      right: 40,
      top: 50,
      width: 60,
    })
  }
  const result2 = checkVisibleInDocument(node2);
  expect(result2).toEqual(true);
})
