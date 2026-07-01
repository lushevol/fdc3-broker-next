import {
  ColGroupDef,
  ColDef,
  GridOptions,
  GetContextMenuItems,
  GridColumnsChangedEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  GridReadyEvent,
} from "ag-grid-community";
import { AgGridReactProps } from "ag-grid-react";

export interface DataGridProps extends AgGridReactProps {
  className?: string;
  gridOptions?: GridOptions;
  columnDefs?: (ColGroupDef | ColDef)[];
  customActions?: any;
  autoSizeDisabled?: boolean;
  rowData?: any;
  onGridReady?: (event: GridReadyEvent) => void;
  onGridColumnsChanged?: (event: GridColumnsChangedEvent) => void;
  rowSelection?: any;
  onRowClicked?: (event: RowClickedEvent) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  getContextMenuItems?: GetContextMenuItems;
  agGridRef?: React.MutableRefObject<any>;
  featureControl?: any;
  height?: number;
}
