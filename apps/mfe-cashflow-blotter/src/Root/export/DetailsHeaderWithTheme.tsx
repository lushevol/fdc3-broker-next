import { FC } from "react";

import {
  HeaderTabs,
  HeaderTabsProps,
} from "../../Cashflow_CN/components/CashflowDetails/detailsBody";
import MfeThemeProvider from "../common/component/MfeThemeProvider";

export const DetailsHeader: FC<HeaderTabsProps> = (props) => {
  return (
    <MfeThemeProvider>
      <HeaderTabs {...props}></HeaderTabs>
    </MfeThemeProvider>
  );
};

export default DetailsHeader;
