import React, { ReactElement, Suspense } from "react";

import { ReactRouterDom, Splash } from "../import";
import { TileProps } from "./common/interface";
const { Routes, Route } = ReactRouterDom;
import { useNotificationCenter } from "../NotificationCenter";
import { useVersionGuard } from "../VersionGuard";
import useController from "./common/useController";
const CashflowCn = React.lazy(() => import("../../Cashflow_CN"));
const CashflowCnOpenSearch = React.lazy(
  () => import("../../Cashflow_CN/OpensearchHome")
);

const CashflowGroupManagement = React.lazy(
  () => import("../../Cashflow_Group_Management")
);
const CashflowDashboard = React.lazy(() => import("../../Cashflow_Dashboard"));
const CashflowBicNettingStaticTable = React.lazy(
  () => import("../../Cashflow_BIC_Netting_Static_Table")
);
const CashflowUtilizationStaticTable = React.lazy(
  () => import("../../Cashflow_Utilization_Static_Table")
);
const CashflowAuthorizationLimits = React.lazy(
  () => import("../../Cashflow_Authorization_Limits/Main")
);
const CashflowSplittingStatic = React.lazy(
  () => import("../../Cashflow_Splitting_Static")
);
const Routing: React.FC<TileProps> = (props: TileProps): ReactElement => {
  useController(props);
  useNotificationCenter();
  useVersionGuard();
  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route path="/cashflow_cn/*" element={<CashflowCn {...props} />} />
        <Route
          path="/cashflow_blotter_cn/cashflow_cn/*"
          element={<CashflowCn {...props} />}
        />
        <Route
          path="/cashflow_open_search/*"
          element={<CashflowCnOpenSearch {...props} />}
        />
        <Route
          path="/cashflow_group_management/*"
          element={<CashflowGroupManagement {...props} />}
        />
        <Route
          path="/cashflow_cn_dashboard/*"
          element={<CashflowDashboard {...props} />}
        />
        <Route
          path="/cashflow_bic_netting_static_table/*"
          element={<CashflowBicNettingStaticTable {...props} />}
        />
        <Route
          path="/cashflow_utilization_static_table/*"
          element={<CashflowUtilizationStaticTable {...props} />}
        />
        <Route
          path="/cashflow_authorization_limits/*"
          element={<CashflowAuthorizationLimits {...props} />}
        />
        <Route
          path="/cashflow_splitting_static/*"
          element={<CashflowSplittingStatic {...props} />}
        />
        <Route path="*" element={<></>} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
