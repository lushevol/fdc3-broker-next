import { render, screen } from "@testing-library/react";
import React from "react";
import Provider from "../../Root/hooks/provider";
import useDispatcher from "../../Root/hooks/dispatcher";
import Root from ".";
import { PREFIX } from "./common/style";

const Comp = () => {
  return (<Root />);
};

describe("Status component", () => {
  it("should be in the document", () => {
    const {debug} = render(<Provider data={{apiStatus: {displayStatusIds: [
      "TDS3_Trade_Query",
      "TDS3_Cashflow_Query",
      "DQSL_Counterparty_Query_V2",
      "DQSL_Counterparty_Query",
      "Ratan_Exception_Query",
    ], data: {
      SSI_PLUS_QUERY: undefined,
      Ratan_Exception_Query: "AVAILABLE",
      TDS3_Cashflow_Query: "AVAILABLE",
      TDS3_Trade_Query: "AVAILABLE",
      DQSL_Counterparty_Query_V2: undefined,
    }}}}>
      <Comp />
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const iconButton = screen.getByTestId(`${PREFIX}_button`);
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
    expect(screen.getByText(/TDS3 Trade Query/i)).toBeInTheDocument();
    expect(screen.getByText(/TDS3 Cashflow Query/i)).toBeInTheDocument();
    expect(screen.getByText(/DQSL Counterparty Query V2/i)).toBeInTheDocument();
    expect(screen.getByText(/Ratan Exception Query/i)).toBeInTheDocument();   
  });
  it("should be not in the document", () => {
    const {debug} = render(<Provider>
      <Comp />
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    const iconButton = screen.getByTestId(`${PREFIX}_button`);
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
    expect(screen.getByText("No API monitor in current blotter.")).toBeInTheDocument()
  });
});
