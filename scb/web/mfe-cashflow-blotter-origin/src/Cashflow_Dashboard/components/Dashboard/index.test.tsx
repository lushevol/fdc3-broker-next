import { Provider } from "react-redux";
import { store } from "src/Cashflow_Dashboard/Main/store-redux";
import { render } from "src/test/test-utils";

import { Dashboard } from "./index";

describe("Dashboard", () => {
  it("should be in the document", () => {
    const { container } = render(<Provider store={store}><Dashboard /></Provider>)
    expect(container).toBeDefined();
  });
});
