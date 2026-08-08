import React, { FC, useCallback, useMemo } from "react";
import { DataGrid, classes } from ".";
import { Time } from "../../Root/import/index";
import cn from "classnames";

interface Props {
  data: any;
}

const CommentGrid: FC<Props> = ({ data }) => {
  const rowData = Array.isArray(data) ? data : [];
  const columnDefs = [
    {
      headerName: "Comments",
      field: "FMO_Comment",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Updater",
      field: "FMO_Comment_Updater",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Timestamp",
      field: "FMO_Comment_Timestamp",
      minWidth: 300,
      flex: 1,
      cellRenderer: Time,
    },
  ];

  const gridOptions = useMemo(() => {
    return {
      defaultColDef: {
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
  const setSize = () => {
    api?.sizeColumnsToFit();
    api?.resetRowHeights();
  };

  const gridReady = useCallback((params: any) => {
    api = params.api;
    setSize();
  }, []);

  return (
    <DataGrid
      columnDefs={columnDefs}
      gridOptions={gridOptions}
      onGridReady={gridReady}
      rowData={rowData}
      className={cn(classes.baseGrid, classes.commentGrid)}
    />
  );
};

export default CommentGrid;
