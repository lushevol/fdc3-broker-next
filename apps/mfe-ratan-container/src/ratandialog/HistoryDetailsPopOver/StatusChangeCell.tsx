import React, { FC, useMemo, useCallback, useState } from "react";
import cn from "classnames";
import { DataGrid, classes } from "../../ratancomponents/DataGrid";
import Button from "@mui/material/Button";
import { MuiPortalDialog } from "../../ratancomponents/Dialog/indexMuiV2";

interface CellProps {
  data: any;
  title: string;
  field: any;
}

const StatusChangeCell: FC<CellProps> = ({ data, title, field }) => {
  const [open, setOpen] = useState(false);
  const columnDefs = [
    {
      headerName: "Status_Name",
      field: "Status_Name",
      flex: 1,
    },
    {
      headerName: "Old_Status",
      field: "Old_Status",
      flex: 1,
    },
    {
      headerName: "New_Status",
      field: "New_Status",
      flex: 1,
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

  return data[field] !== "" &&
    data[field] !== null &&
    data[field] !== undefined ? (
    <>
      {open && (
        <MuiPortalDialog
          open={open}
          title={title}
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
            onGridReady={gridReady}
            rowData={data[field]}
            autoSizeDisabled={true}
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

export default StatusChangeCell;
