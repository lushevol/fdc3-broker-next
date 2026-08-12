import React, { FC, useMemo, useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import cn from "classnames";
import { DataGrid, classes } from "../../ratancomponents/DataGrid";
import { queryTradeAuditTrail } from "../../ratanutils/http/graphql";
import { RootStyle } from "./style";

const sortHistoryData = (data) => {
  data.sort((a, b) => {
    const aVersion = `${a.Tracking_Version || a.Trade_Version}${
      a.Trade_Lake_Trade_Major_Version
    }${a.Trade_Lake_Trade_Minor_Version}`;
    const bVersion = `${b.Tracking_Version || b.Trade_Version}${
      b.Trade_Lake_Trade_Major_Version
    }${b.Trade_Lake_Trade_Minor_Version}`;
    if (aVersion === bVersion) {
      return a.Aciton_Data_Time > b.Acition_Data_Time ? -1 : 1;
    }
    return aVersion > bVersion ? -1 : 1;
  });
  return data;
};

interface HistoryDetailsDialogProps {
  details: any;
  historyDataList?: any[];
  gridFields: any;
  historyPageName: any;
}

const HistoryDetailsDialog: FC<HistoryDetailsDialogProps> = ({
  details,
  historyDataList,
  gridFields,
  historyPageName,
}) => {
  const [historyGridEvent, setHistoryGridEvent] = useState<any>();
  const [historyList, setHistoryList] = useState<any>(null);
  const historyClass = cn("history-grid", classes.baseGrid);

  const restore = () => {
    historyGridEvent.api?.autoSizeAllColumns();
  };

  useEffect(() => {
    if (historyPageName === "Cashflow" && historyDataList) {
      setHistoryList(historyDataList);
    } else if (historyPageName === "Trade") {
      queryTradeAuditTrail(details["Trade_Id"])
        .then((result: any) => {
          setHistoryList(sortHistoryData(result.tradeAuditTrail));
        })
        .catch(() => {
          setHistoryList([]);
        });
    } else {
      setHistoryList([]);
    }
  }, [details, historyDataList]);

  useEffect(() => {
    if (historyGridEvent?.api && historyList) {
      setTimeout(() =>
        historyGridEvent?.api.setGridOption("rowData", historyList)
      );
    }
  }, [historyGridEvent, historyList]);

  const gridOptions = useMemo(() => {
    return {
      defaultColDef: {
        resizable: true,
        sortable: true,
        cellStyle: {
          "text-align": "left",
        },
      },
      suppressContextMenu: true,
    };
  }, []);
  const updateApi = useCallback(
    (params) => {
      setHistoryGridEvent(params);
    },
    [setHistoryGridEvent]
  );

  return (
    <RootStyle
      data-testid="trade-detail-history"
      className="trade-detail-history"
    >
      <DataGrid
        className={historyClass}
        columnDefs={gridFields}
        gridOptions={gridOptions}
        onGridReady={updateApi}
      />
      <div
        className="history-detail-footer"
        data-testid="cashflow-history-resize-btn"
      >
        <Button variant="outlined" onClick={restore}>
          Restore
        </Button>
      </div>
    </RootStyle>
  );
};

export default HistoryDetailsDialog;
