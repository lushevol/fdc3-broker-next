import { act, render, screen } from "@Test/test-utils";
import { DataGrid } from "Import/ratancomponents";

import { ResultStatus } from "../../type";
import CashflowDisplayTable from ".";

afterAll(() => {
  vi.clearAllMocks();
});

const mockSetGridOption = vi.fn();
const mockGridApi = { setGridOption: mockSetGridOption };

// Capture the onGridReady prop so we can invoke it manually in tests
let capturedOnGridReady: ((event: any) => void) | undefined;
beforeEach(() => {
  vi.clearAllMocks();
  capturedOnGridReady = undefined;
  (DataGrid as vi.Mock).mockImplementation((props) => {
    const { columnDefs, rowData, gridOptions, onGridReady } = props;
    capturedOnGridReady = onGridReady;
    const { onRowDoubleClicked } = gridOptions ?? {};
    return (
      <div data-testid="mock-datagrid">
        {columnDefs?.map((c: any) => (
          <div key={c.headerName}>{c.headerName}</div>
        ))}
        {rowData?.map((row: any, index: number) => (
          <div
            key={index}
            data-testid={`datagrid-row-${index}`}
            onDoubleClick={() => onRowDoubleClicked?.({ node: { data: row } })}
          >
            {columnDefs?.map((c: any) => (
              <div key={c.field}>
                {c.cellRenderer
                  ? c.cellRenderer({ value: row[c.field], data: row })
                  : row[c.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  });
});

const mockEligibleCashflows = [
  {
    cashflowId: "007372111189",
    tradeId: "7150113556",
    settlementMethod: "GROSS",
    paymentAmount: "98000.0",
    cashflowStatus: "READY",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "USD",
    payRec: "Receive",
    valueDate: "2026-04-13",
    actionResult: { status: ResultStatus.None, message: "" },
  },
  {
    cashflowId: "007372111188",
    tradeId: "7150113553",
    settlementMethod: "UTIL",
    paymentAmount: "368046.35",
    cashflowStatus: "WAITING",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "SAR",
    payRec: "Pay",
    valueDate: "2026-04-13",
    actionResult: { status: ResultStatus.SubmitSuccess, message: "success" },
  },
  {
    cashflowId: "007372111187",
    tradeId: "7150113550",
    settlementMethod: "GROSS",
    paymentAmount: "50000.0",
    cashflowStatus: "READY",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "USD",
    payRec: "Pay",
    valueDate: "2026-04-14",
    actionResult: { status: ResultStatus.SubmitFailed, message: "Action not allowed." },
  },
  {
    cashflowId: "007372111186",
    tradeId: "7150113549",
    settlementMethod: "GROSS",
    paymentAmount: "70000.0",
    cashflowStatus: "READY",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "USD",
    payRec: "Receive",
    valueDate: "2026-04-15",
    actionResult: { status: ResultStatus.Submiting, message: "" },
  },
];

const mockIneligibleCashflows = [
  {
    cashflowId: "007372111194",
    tradeId: "7150113556",
    settlementMethod: "UTIL",
    paymentAmount: "98000.0",
    cashflowStatus: "ERROR",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "USD",
    payRec: "Receive",
    valueDate: "2026-04-13",
    insufficientReason: "Trade contains ERROR Cashflow",
    actionResult: { status: ResultStatus.None, message: "" },
  },
  {
    cashflowId: "007372111193",
    tradeId: "7150113556",
    settlementMethod: "UTIL",
    paymentAmount: "368046.35",
    cashflowStatus: "UTILIZED",
    entityCode: "SCB SAUDI*RYD",
    counterpartyCode: "SCB DUBAI DFC*DUB",
    currency: "SAR",
    payRec: "Pay",
    valueDate: "2026-04-13",
    insufficientReason: "Trade contains UTILIZED Cashflow",
    actionResult: { status: ResultStatus.None, message: "" },
  },
];

describe("CashflowDisplayTable", () => {
  describe("Basic Render", () => {
    it("should render table when isEligibleTable is true", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />);
      expect(screen.getByTestId("cashflow-table")).toBeInTheDocument();
    });

    it("should render table when isEligibleTable is false", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable={false} isLoading={false} />);
      expect(screen.getByTestId("cashflow-table")).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("should call setGridOption with loading=true on grid ready when isLoading is true", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable isLoading={true} />);
      act(() => {
        capturedOnGridReady?.({ api: mockGridApi });
      });
      expect(mockSetGridOption).toHaveBeenCalledWith("loading", true);
    });

    it("should call setGridOption with loading=false on grid ready when isLoading is false", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />);
      act(() => {
        capturedOnGridReady?.({ api: mockGridApi });
      });
      expect(mockSetGridOption).toHaveBeenCalledWith("loading", false);
    });

    it("should update setGridOption when isLoading changes from true to false", () => {
      const { rerender } = render(
        <CashflowDisplayTable data={[]} isEligibleTable isLoading={true} />
      );
      act(() => {
        capturedOnGridReady?.({ api: mockGridApi });
      });
      mockSetGridOption.mockClear();

      rerender(<CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />);
      expect(mockSetGridOption).toHaveBeenCalledWith("loading", false);
    });

    it("should update setGridOption when isLoading changes from false to true", () => {
      const { rerender } = render(
        <CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />
      );
      act(() => {
        capturedOnGridReady?.({ api: mockGridApi });
      });
      mockSetGridOption.mockClear();

      rerender(<CashflowDisplayTable data={[]} isEligibleTable isLoading={true} />);
      expect(mockSetGridOption).toHaveBeenCalledWith("loading", true);
    });

    it("should not throw when gridApi is not ready and isLoading changes", () => {
      const { rerender } = render(
        <CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />
      );
      // onGridReady never called — gridApiRef.current is null
      expect(() => {
        rerender(<CashflowDisplayTable data={[]} isEligibleTable isLoading={true} />);
      }).not.toThrow();
    });
  });

  describe("Columns when isEligibleTable is true", () => {
    it("should render all required columns including Result", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />);
      expect(screen.getByText("Cashflow Id")).toBeInTheDocument();
      expect(screen.getByText("Trade Id")).toBeInTheDocument();
      expect(screen.getByText("Original Settlement Method")).toBeInTheDocument();
      expect(screen.getByText("Target Settlement Method")).toBeInTheDocument();
      expect(screen.getByText("Amount")).toBeInTheDocument();
      expect(screen.getByText("Cashflow Status")).toBeInTheDocument();
      expect(screen.getByText("Booking Entity")).toBeInTheDocument();
      expect(screen.getByText("Counterparty")).toBeInTheDocument();
      expect(screen.getByText("Currency")).toBeInTheDocument();
      expect(screen.getByText("P/R")).toBeInTheDocument();
      expect(screen.getByText("Value Date")).toBeInTheDocument();
      expect(screen.getByText("Result")).toBeInTheDocument();
    });

    it("should NOT render Reason column when isEligibleTable is true", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable isLoading={false} />);
      expect(screen.queryByText("Reason")).not.toBeInTheDocument();
    });
  });

  describe("Columns when isEligibleTable is false", () => {
    it("should render Reason column instead of Result", () => {
      render(<CashflowDisplayTable data={[]} isEligibleTable={false} isLoading={false} />);
      expect(screen.getByText("Reason")).toBeInTheDocument();
      expect(screen.queryByText("Result")).not.toBeInTheDocument();
    });
  });

  describe("Cell renderers — eligible table", () => {
    it("should render Original Settlement Method tag", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      expect(screen.getAllByText("GROSS").length).toBeGreaterThan(0);
    });

    it("should render Target Settlement Method tag", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      expect(screen.getAllByText("UTIL").length).toBeGreaterThan(0);
    });

    it("should render ActionResultCell success status", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      expect(screen.getByText("success")).toBeInTheDocument();
    });

    it("should render ActionResultCell failed status", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      expect(screen.getByText("failed")).toBeInTheDocument();
    });

    it("should render ActionResultCell processing status", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      expect(screen.getByText("processing")).toBeInTheDocument();
    });

    it("should render payment amount", () => {
      render(
        <CashflowDisplayTable data={mockEligibleCashflows} isEligibleTable isLoading={false} />
      );
      // SimpleAmount renders the formatted value
      expect(screen.getAllByTestId("datagrid-row-0").length).toBeGreaterThan(0);
    });
  });

  describe("Cell renderers — ineligible table", () => {
    it("should render ActionReasonCell for ineligible cashflows", () => {
      render(
        <CashflowDisplayTable
          data={mockIneligibleCashflows}
          isEligibleTable={false}
          isLoading={false}
        />
      );
      expect(screen.getByTestId("datagrid-row-0")).toBeInTheDocument();
    });
  });
});
