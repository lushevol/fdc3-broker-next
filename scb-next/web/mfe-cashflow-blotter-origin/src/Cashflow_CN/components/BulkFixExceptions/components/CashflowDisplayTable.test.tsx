import { render } from "@Test/test-utils";

import { BulkUserType } from "../type";
import CashflowDisplayTable from "./CashflowDisplayTable";

afterAll(() => {
  vi.clearAllMocks();
});

describe('CashflowDisplayTable', () => {
  it("CashflowDisplayTable should render in document", () => {
    const { queryByTestId } = render(<CashflowDisplayTable data={[]} selectedRowKeys={[]} userType={BulkUserType.Maker} isEligibleTable />);
    expect(queryByTestId("cashflow-display-table")).toBeInTheDocument();
  });
  it("CashflowDisplayTable should render in document when checker", () => {
    const { queryByTestId } = render(<CashflowDisplayTable data={[]} selectedRowKeys={[]} userType={BulkUserType.Checker} isEligibleTable />);
    expect(queryByTestId("cashflow-display-table")).toBeInTheDocument();
  });
  it("CashflowDisplayTable rowSelection should be undefined when isEligibleTable is false", () => {
    const onSelectedRowKeysChange = vi.fn();
    const onSelectAllSelectableRows = vi.fn();

    render(
      <CashflowDisplayTable
        data={[]}
        selectedRowKeys={[]}
        userType={BulkUserType.Checker}
        isEligibleTable={false}
        onSelectedRowKeysChange={onSelectedRowKeysChange}
      />
    );
    expect(onSelectedRowKeysChange).not.toHaveBeenCalled();
    expect(onSelectAllSelectableRows).not.toHaveBeenCalled();
  });
});
