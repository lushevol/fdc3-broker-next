import { Space } from "antd";
import { useEffect } from "react";
import { CommonUtil } from "src/Root/import";
import { useRatanDispatcher } from "src/Root/import/ratancomponents";
import { TileProps } from "src/Root/routing/common/interface";

import json from "../../package.json";
import { BicNettingStaticAuditDialog } from "./components/Audit/Dialog";
import { AuditEntry } from "./components/Audit/Entry";
import { CreateEntry } from "./components/Create";
import BicNettingStaticDataGrid from "./components/DataGrid";
import { BicNettingStaticDetailDialog } from "./components/Detail";
import { ExportFileEntry } from "./components/Export";
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
        <Space direction="horizontal" style={{ paddingLeft: "16px" }}>
          <CreateEntry />
          <AuditEntry />
          <ExportFileEntry />
        </Space>
        <BicNettingStaticDataGrid />
      </div>
      <BicNettingStaticDetailDialog />
      <BicNettingStaticAuditDialog />
    </>
  );
};
