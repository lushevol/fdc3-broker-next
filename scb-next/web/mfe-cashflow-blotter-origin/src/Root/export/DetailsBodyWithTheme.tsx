import { FC, useMemo } from "react";

import {
  DetailsBody as Details,
  DetailsBodyProps,
} from "../../Cashflow_CN/components/CashflowDetails/detailsBody";
import { CashflowDetailsContext } from "../../Cashflow_CN/Main/workflow/viewCashflowDetails/CashflowDetailsContext";
import MfeThemeProvider from "../common/component/MfeThemeProvider";

export const DetailsBody: FC<DetailsBodyProps> = (props) => {
  const contextValue = useMemo(() => ({ opensearch: false }), []);
  return (
    <MfeThemeProvider>
      <CashflowDetailsContext.Provider value={contextValue}>
        <Details {...props}></Details>
      </CashflowDetailsContext.Provider>
    </MfeThemeProvider>
  );
};

export default DetailsBody;
