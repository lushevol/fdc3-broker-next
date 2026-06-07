import { createContext, useContext } from "react";

import { GraphCashFlowDashBoard } from "../common/interface";
import { generateEmptyDashboardData } from "../common/utils";

export const DashboardContext = createContext<GraphCashFlowDashBoard | null>(
  generateEmptyDashboardData()
);

export const useDashboardContext = () => {
  const c = useContext(DashboardContext);
  return c;
};
