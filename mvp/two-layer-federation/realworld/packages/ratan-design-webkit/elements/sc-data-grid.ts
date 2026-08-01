import { ScDataGrid } from '../src/components/ScDataGrid/ScDataGrid.js';

import { ScDataGridCell } from '../src/components/ScDataGrid/ScDataGridCell.js';

import { ScDataGridColumnFilter } from '../src/components/ScDataGrid/ScDataGridColumnFilter.js';

import { ScDataGridDraggingShadow } from '../src/components/ScDataGrid/ScDataGridDraggingShadow.js';

import { ScDataGridColumnSetFilter } from '../src/components/ScDataGrid/ScDataGridColumnSetFilter.js';

import { ScDataGridMasterCell } from '../src/components/ScDataGrid/ScDataGridMasterCell.js';

import { ScDataGridSelectionCell } from '../src/components/ScDataGrid/widgets/selection.js';

import { ScDataGridCompositeFilter } from '../src/components/ScDataGrid/ScDataGridCompositeFilter.js';

import { ScDataGridColumnManager } from '../src/components/ScDataGrid/ScDataGridColumnManager.js';

import { ScDataGridEditing } from '../src/components/ScDataGrid/ScDataGridEditing.js';

import { ScDataGridOverlapping } from '../src/components/ScDataGrid/ScDataGridOverlapping.js';

export * from '../src/components/ScDataGrid/ScDataGrid.js';
export * from '../src/components/ScDataGrid/ScDataGridCell.js';
export * from '../src/components/ScDataGrid/ScDataGridColumnFilter.js';
export * from '../src/components/ScDataGrid/ScDataGridDraggingShadow.js';
export * from '../src/components/ScDataGrid/ScDataGridColumnSetFilter.js';
export * from '../src/components/ScDataGrid/ScDataGridMasterCell.js';
export * from '../src/components/ScDataGrid/widgets/selection.js';
export * from '../src/components/ScDataGrid/ScDataGridCompositeFilter.js';
export * from '../src/components/ScDataGrid/ScDataGridColumnManager.js';
export * from '../src/components/ScDataGrid/ScDataGridEditing.js';
export * from '../src/components/ScDataGrid/ScDataGridOverlapping.js';

window.customElements.define('sc-data-grid', ScDataGrid);
window.customElements.define('sc-data-grid-cell', ScDataGridCell);
window.customElements.define('sc-data-grid-column-filter', ScDataGridColumnFilter);
window.customElements.define('sc-data-grid-dragging-shadow', ScDataGridDraggingShadow);
window.customElements.define('sc-data-grid-column-set-filter', ScDataGridColumnSetFilter);
window.customElements.define('sc-data-grid-master-cell', ScDataGridMasterCell);
window.customElements.define('sc-data-grid-selection-cell', ScDataGridSelectionCell);
window.customElements.define('sc-data-grid-composite-filter', ScDataGridCompositeFilter);
window.customElements.define('sc-data-grid-column-manager', ScDataGridColumnManager);

window.customElements.define('sc-data-grid-editing', ScDataGridEditing);

window.customElements.define('sc-data-grid-overlapping', ScDataGridOverlapping);

declare global {
  interface HTMLElementTagNameMap {
    'sc-data-grid': ScDataGrid;
    'sc-data-grid-cell': ScDataGridCell;
    'sc-data-grid-column-filter': ScDataGridColumnFilter;
    'sc-data-grid-dragging-shadow': ScDataGridDraggingShadow;
    'sc-data-grid-column-set-filter': ScDataGridColumnSetFilter;
    'sc-data-grid-master-cell': ScDataGridMasterCell;
    'sc-data-grid-selection-cell': ScDataGridSelectionCell;
    'sc-data-grid-composite-filter': ScDataGridCompositeFilter;
    'sc-data-grid-column-manager': ScDataGridColumnManager;
    'sc-data-grid-editing': ScDataGridEditing;
    'sc-data-grid-overlapping': ScDataGridOverlapping;
  }
}
