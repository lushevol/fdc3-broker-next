import "./styles/ag-grid-ratan.css";
import "./styles/ag-theme-alpine-ratan.css";

import { BodyScrollEvent } from "ag-grid-community";
import { ColumnMenuTab } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import cn from "classnames";
import React, { FC, useRef } from "react";

import { ContainerProvider } from "../../Root/import";
import { DataGridProps } from "./interface";
import Root from "./style";

// The Ag-grid must be visible to change the column width. It is used to judge whether it is visible or not
export const checkVisibleInDocument = (node: any) => {
  if (node) {
    if (
      !(node.offsetHeight || node.offsetWidth || node.getClientRects().length)
    ) {
      return false;
    }

    const { height, top } = node.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return top < windowHeight && top + height > 0;
  }
  return false;
};

const DataGrid: FC<DataGridProps> = ({
  className = "",
  gridOptions,
  autoSizeDisabled = false,
  agGridRef,
  columnMenu = "legacy",
  ...rest
}) => {
  const [ContainerStore] = ContainerProvider.useContext();
  const thisClassName = cn(
    { "ag-theme-alpine": ContainerStore.theme === "light" },
    { "ag-theme-alpine-dark": ContainerStore.theme === "dark" },
    className
  );
  const agGrid: any = useRef();

  const autoSize = (params: any) => {
    !autoSizeDisabled &&
      checkVisibleInDocument(agGrid.current) &&
      setTimeout(() => params.api.autoSizeAllColumns(), 0);

    if (agGrid.current) {
      agGrid.current.dataset.testid = "dataGrid";
    }
  };

  const originalGridOptions = {
    onRowDataUpdated: autoSize,
    ...gridOptions,
    onBodyScroll: (event: BodyScrollEvent<any, any>) => {
      const { api } = event;
      api.hidePopupMenu();
      gridOptions?.onBodyScroll && gridOptions?.onBodyScroll(event);
    },
    defaultColDef: {
      sortable: true,
      menuTabs: [
        "filterMenuTab",
        "generalMenuTab",
        "columnsMenuTab",
      ] as ColumnMenuTab[],
      filter: true,
      ...gridOptions?.defaultColDef,
    },
  };

  return (
    <Root className="ag-grid-flowzero">
      <div ref={agGrid} className={thisClassName} data-testid="gridInit">
        <AgGridReact
          ref={agGridRef}
          gridOptions={originalGridOptions}
          columnMenu={columnMenu}
          {...rest}
        />
      </div>
    </Root>
  );
};
export default DataGrid;
