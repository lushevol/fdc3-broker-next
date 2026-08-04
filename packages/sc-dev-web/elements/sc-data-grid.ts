import { defineElement } from "./define-element.js";
import { ScDataGrid } from "../src/components/ScDataGrid/ScDataGrid.js";

import { ScDataGridCell } from "../src/components/ScDataGrid/ScDataGridCell.js";

import { ScDataGridColumnFilter } from "../src/components/ScDataGrid/ScDataGridColumnFilter.js";

import { ScDataGridDraggingShadow } from "../src/components/ScDataGrid/ScDataGridDraggingShadow.js";

import { ScDataGridColumnSetFilter } from "../src/components/ScDataGrid/ScDataGridColumnSetFilter.js";

import { ScDataGridMasterCell } from "../src/components/ScDataGrid/ScDataGridMasterCell.js";

import { ScDataGridSelectionCell } from "../src/components/ScDataGrid/widgets/selection.js";

import { ScDataGridCompositeFilter } from "../src/components/ScDataGrid/ScDataGridCompositeFilter.js";

import { ScDataGridColumnManager } from "../src/components/ScDataGrid/ScDataGridColumnManager.js";

import { ScDataGridEditing } from "../src/components/ScDataGrid/ScDataGridEditing.js";

import { ScDataGridOverlapping } from "../src/components/ScDataGrid/ScDataGridOverlapping.js";

export * from "../src/components/ScDataGrid/ScDataGrid.js";
export * from "../src/components/ScDataGrid/ScDataGridCell.js";
export * from "../src/components/ScDataGrid/ScDataGridColumnFilter.js";
export * from "../src/components/ScDataGrid/ScDataGridDraggingShadow.js";
export * from "../src/components/ScDataGrid/ScDataGridColumnSetFilter.js";
export * from "../src/components/ScDataGrid/ScDataGridMasterCell.js";
export * from "../src/components/ScDataGrid/widgets/selection.js";
export * from "../src/components/ScDataGrid/ScDataGridCompositeFilter.js";
export * from "../src/components/ScDataGrid/ScDataGridColumnManager.js";
export * from "../src/components/ScDataGrid/ScDataGridEditing.js";
export * from "../src/components/ScDataGrid/ScDataGridOverlapping.js";

defineElement("sc-data-grid", ScDataGrid);
defineElement("sc-data-grid-cell", ScDataGridCell);
defineElement("sc-data-grid-column-filter", ScDataGridColumnFilter);
defineElement("sc-data-grid-dragging-shadow", ScDataGridDraggingShadow);
defineElement("sc-data-grid-column-set-filter", ScDataGridColumnSetFilter);
defineElement("sc-data-grid-master-cell", ScDataGridMasterCell);
defineElement("sc-data-grid-selection-cell", ScDataGridSelectionCell);
defineElement("sc-data-grid-composite-filter", ScDataGridCompositeFilter);
defineElement("sc-data-grid-column-manager", ScDataGridColumnManager);

defineElement("sc-data-grid-editing", ScDataGridEditing);

defineElement("sc-data-grid-overlapping", ScDataGridOverlapping);

declare global {
  interface HTMLElementTagNameMap {
    "sc-data-grid": ScDataGrid;
    "sc-data-grid-cell": ScDataGridCell;
    "sc-data-grid-column-filter": ScDataGridColumnFilter;
    "sc-data-grid-dragging-shadow": ScDataGridDraggingShadow;
    "sc-data-grid-column-set-filter": ScDataGridColumnSetFilter;
    "sc-data-grid-master-cell": ScDataGridMasterCell;
    "sc-data-grid-selection-cell": ScDataGridSelectionCell;
    "sc-data-grid-composite-filter": ScDataGridCompositeFilter;
    "sc-data-grid-column-manager": ScDataGridColumnManager;
    "sc-data-grid-editing": ScDataGridEditing;
    "sc-data-grid-overlapping": ScDataGridOverlapping;
  }
}
