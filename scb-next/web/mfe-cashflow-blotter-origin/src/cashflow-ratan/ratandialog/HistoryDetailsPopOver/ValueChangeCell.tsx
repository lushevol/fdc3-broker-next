import React, { FC, useMemo, useCallback, useState } from "react";
import cn from "classnames";
import { DataGrid, classes } from "../../ratancomponents/DataGrid";
import { Time } from "../../Root/import/index";
import { isEmpty } from "../../ratanutils/utils";
import Button from "@mui/material/Button";
import { MuiPortalDialog } from "../../ratancomponents/Dialog/indexMuiV2";

interface CellProps {
  data: any;
}

const ValueChangeCell: FC<CellProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const columnDefs = [
    {
      headerName: "Field_Name",
      field: "Field_Name",
      flex: 1,
    },
    {
      headerName: "Old_Value",
      field: "Old_Value",
      flex: 1,
      cellRenderer: Time,
    },
    {
      headerName: "New_Value",
      field: "New_Value",
      flex: 1,
      cellRenderer: Time,
    },
  ];

  const gridOptions = useMemo(() => {
    return {
      defaultColDef: {
        sortable: true,
        autoHeight: true,
        cellStyle: {
          "text-align": "left",
          "white-space": "normal",
          "word-wrap": "break-word",
        },
      },
      suppressContextMenu: true,
    };
  }, []);

  let api: any;

  const gridReady = useCallback((params: any) => {
    api = params.api;
  }, []);

  return !isEmpty(data.Value_Change) ? (
    <>
      {open && (
        <MuiPortalDialog
          open={open}
          title="Value Change"
          width="800px"
          height="450px"
          enableResize={true}
          enableMaximize
          onClose={() => setOpen(false)}
          inside={true}
        >
          <DataGrid
            className={cn(
              classes.baseGrid,
              classes.baseGridHeight,
              classes.removeMinHeight
            )}
            columnDefs={columnDefs}
            gridOptions={gridOptions}
            autoSizeDisabled={true}
            onGridReady={gridReady}
            rowData={data.Value_Change}
          />
        </MuiPortalDialog>
      )}
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show Detail
      </Button>
    </>
  ) : (
    <div>N/A</div>
  );
};

export default ValueChangeCell;
