import React, { FC, useMemo, useEffect, useState } from "react";
import { ColDef } from "ag-grid-community";

import { MuiDialog } from "../../../ratancomponents/Dialog/indexMuiV1";
import { DataGrid, classes } from "../../../ratancomponents/DataGrid";
import { Loading } from "../../../ratancomponents/Loading";
import { Time } from "../../../Root/import/index";
import { getQueryMultiSSI, getLookupSSI } from "../../../ratanutils/http/api";
import { changeKeyToLabel } from "../../../ratanutils/utils";
import { css, styled } from "@mui/material";
import cn from "classnames";

const StyledMuiDialog = styled(MuiDialog)(
  ({ theme }) => css`
    .MuiDialog-paper {
      z-index: ${theme.zIndex.tooltip + 1};
      .ssi-list {
        padding: 10px;
      }
    }
  `
);

const gridOptions = {
  defaultColDef: {
    menuTabs: [],
    resizable: true,
  },
  suppressMovableColumns: true,
  getRowId: (data: any) => data.ssiId,
};

interface SsiListsProp {
  open: boolean;
  onClose: Function;
  exception: any;
  isMultiSSI: boolean;
  onOpenForm: Function;
}

export const SsiLists: FC<SsiListsProp> = ({
  open,
  onClose,
  exception,
  isMultiSSI,
  onOpenForm,
}) => {
  const [options, setOptions] = useState<any[]>();
  const {
    eventRowKey,
    counterpartyFmLeid,
    disableRightClick,
    settlementCurrency,
  } = exception.data || {};
  const ssiListClass = cn(classes.baseGrid, "repair-options-grid");

  useEffect(() => {
    if (open) {
      if (isMultiSSI) {
        getQueryMultiSSI(eventRowKey)
          .then((res: any) => {
            setOptions(res || []);
          })
          .catch(() => {
            setOptions([]);
          });
      } else {
        getLookupSSI({
          fmid: counterpartyFmLeid,
          tradingCurrency: settlementCurrency,
        })
          .then((res: any) => {
            setOptions(res || []);
          })
          .catch(() => {
            setOptions([]);
          });
      }
    }
  }, [open]);

  const columnDefs = useMemo(() => {
    const newColumnDefs: ColDef[] = [
      {
        headerName: "FM ID",
        field: "fmid",
      },
      {
        headerName: "Currency",
        field: "tradingCurrency",
      },
      {
        headerName: "SCB Legal entity",
        field: "entity",
      },
      {
        headerName: "SSI ID",
        field: "ssiId",
      },
      {
        headerName: "CFI Code",
        field: "cfiCode",
      },
    ];

    if (Array.isArray(options) && options[0]) {
      for (const key in options[0]) {
        if (
          newColumnDefs.filter((item: ColDef) => key === item.field).length ===
          0
        ) {
          newColumnDefs.push({
            headerName: changeKeyToLabel(key, [{ from: "ssi", to: "SSI" }]),
            field: key,
            cellRenderer: Time,
            valueGetter: (params: any) => {
              const value = params.data;
              return value[key] === "Upstream" ? "SS+" : value[key];
            },
          });
        }
      }
    }

    return newColumnDefs;
  }, [options]);

  const close = (data?: any) => {
    onClose();
    setOptions(undefined);
  };

  return (
    <StyledMuiDialog
      className="repair-options-dialog"
      title="Available SSI"
      testId="repairCloseBtn"
      enableResize
      open={open}
      onClose={close}
      width={700}
      height={470}
    >
      {options ? (
        <div className="ssi-list" data-testid="ssi-list">
          <DataGrid
            className={ssiListClass}
            gridOptions={gridOptions}
            columnDefs={columnDefs}
            rowData={options}
            onRowDoubleClicked={(params: any) => {
              onOpenForm(params.data);
            }}
            getContextMenuItems={(params: any) => {
              if (disableRightClick) {
                return [];
              }
              return [
                {
                  name: "Apply SSI",
                  action: () => {
                    onOpenForm(params.data);
                  },
                },
              ];
            }}
          />
        </div>
      ) : (
        <Loading loading={true} size={70} text="loading..." />
      )}
    </StyledMuiDialog>
  );
};
