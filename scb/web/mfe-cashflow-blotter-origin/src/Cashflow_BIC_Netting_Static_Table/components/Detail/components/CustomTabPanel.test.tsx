import { render } from "@Test/test-utils";

import { CustomTabPanel } from "./CustomTabPanel";

describe("CustomTabPanel", () => {
  it("should render in document", () => {
    const { queryByTestId } = render(
      <CustomTabPanel value={1} index={1}>
        <div data-testid="inner"></div>
      </CustomTabPanel>,
    );
    expect(queryByTestId("inner")).toBeInTheDocument();
  });
});
