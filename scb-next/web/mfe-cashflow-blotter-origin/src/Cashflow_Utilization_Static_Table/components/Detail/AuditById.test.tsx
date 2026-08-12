import { render } from "src/test/test-utils";

import { useAppSelector } from "../../store";
import { AuditById } from "./AuditById";

vi.mock("../../store", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("../Audit/AuditDataGrid", () => ({
  RulesAuditDataGrid: vi.fn(() => (
    <div data-testid="mock-rules-audit-data-grid" />
  )),
}));

it("renders RulesAuditDataGrid with correct id", () => {
  const mockDetailData = { id: 123 };
  (useAppSelector as vi.Mock).mockReturnValue({ detailData: mockDetailData });
  const { queryByTestId } = render(<AuditById />);
  expect(queryByTestId("mock-rules-audit-data-grid")).toBeInTheDocument();
});
