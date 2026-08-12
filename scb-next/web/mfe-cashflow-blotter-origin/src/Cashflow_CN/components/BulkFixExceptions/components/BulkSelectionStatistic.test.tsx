import { render } from "@Test/test-utils";

import { mockCashflowDisplay } from "../test/mockData/cashflows";
import { BulkSelectionStatistic } from "./BulkSelectionStatistic";

describe('BulkSelectionStatistic', () => {
  it("BulkSelectionStatistic should render in document", () => {
    const { queryByTestId } = render(<BulkSelectionStatistic selectedCashflows={[mockCashflowDisplay]} />);
    expect(queryByTestId("bulk-selection-statistic")).toBeInTheDocument();
  });
  it("BulkSelectionStatistic with 0 exceptions should not render in document", () => {
    const { queryByTestId } = render(<BulkSelectionStatistic selectedCashflows={[{ ...mockCashflowDisplay, exceptions: [] }]} />);
    expect(queryByTestId("bulk-selection-statistic")).not.toBeInTheDocument();
  });
});
