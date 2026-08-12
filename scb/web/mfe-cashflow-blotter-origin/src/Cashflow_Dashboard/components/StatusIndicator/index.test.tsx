import { fireEvent,render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "src/Cashflow_Dashboard/Main/store-redux";

import { StatusIndicator } from "./index";

describe("Status Indicator Component", () => {
  it("should be in the document", async () => {
    const { getByText } = render(<Provider store={store}><StatusIndicator/></Provider>);
    expect(getByText("Waiting VD Today")).toBeDefined();
    fireEvent.click(getByText("Group Pending"));
  });
});
