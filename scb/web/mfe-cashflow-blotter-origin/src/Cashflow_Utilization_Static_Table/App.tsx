import { useEffect } from "react";
import { CommonUtil } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";
import { TileProps } from "src/Root/routing/common/interface";

import json from "../../package.json";
import { UtilizationStaticAuditDialog } from "./components/Audit/Dialog";
import UtilizationStaticDataGrid from "./components/DataGrid";
import { UtilizationStaticDetailDialog } from "./components/Detail";
import GridFooter from "./components/GridFooter";
import { QuickSearch } from "./components/QuickSearch";

export const App = (props: TileProps) => {
  const { dispatchVersionState, dispatchApiStatusList } = useRatanDispatcher();
  useEffect(() => {
    dispatchVersionState({ version: json.version, env: CommonUtil.getEnv() });
    dispatchApiStatusList(["TDS3_Trade_Query", "DQSL_Counterparty_Query_V2"]);
  }, []);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <QuickSearch />
        <GridFooter />
        <UtilizationStaticDataGrid />
      </div>
      <UtilizationStaticDetailDialog />
      <UtilizationStaticAuditDialog />
    </>
  );
};
