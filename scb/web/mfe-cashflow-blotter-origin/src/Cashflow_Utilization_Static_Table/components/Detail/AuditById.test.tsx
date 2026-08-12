import { render } from "src/test/test-utils";

import { useAppSelector } from "../../store";
import { AuditById } from "./AuditById";

jest.mock("../../store", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("../Audit/AuditDataGrid", () => ({
  RulesAuditDataGrid: jest.fn(() => (
    <div data-testid="mock-rules-audit-data-grid" />
  )),
}));

it("renders RulesAuditDataGrid with correct id", () => {
  const mockDetailData = { id: 123 };
  (useAppSelector as jest.Mock).mockReturnValue({ detailData: mockDetailData });
  const { queryByTestId } = render(<AuditById />);
  expect(queryByTestId("mock-rules-audit-data-grid")).toBeInTheDocument();
});
