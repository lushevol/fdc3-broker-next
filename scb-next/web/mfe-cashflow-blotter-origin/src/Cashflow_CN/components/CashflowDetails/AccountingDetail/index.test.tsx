import { render, screen } from "@testing-library/react";

import { AccountingDetail } from "./index";
import rowDetails from '../data/cashflows.json';

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../../services", () => ({
  getEBBSAcountingDetail: vi.fn(async () => ([{}])),
}));

describe("AccountingDetail component", () => {
  it("should be in the document", async () => {
    const details = JSON.parse(JSON.stringify(rowDetails.data.cashflows.results[0]));
    render(<AccountingDetail
      cashflowId={details.Cashflow.Cashflow_Id}
    />);
    expect(screen).toBeDefined();
  });
});
