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

if (!window.customElements.get('sc-data-grid')) window.customElements.define('sc-data-grid', ScDataGrid);
if (!window.customElements.get('sc-data-grid-cell')) window.customElements.define('sc-data-grid-cell', ScDataGridCell);
if (!window.customElements.get('sc-data-grid-column-filter')) window.customElements.define('sc-data-grid-column-filter', ScDataGridColumnFilter);
if (!window.customElements.get('sc-data-grid-dragging-shadow')) window.customElements.define('sc-data-grid-dragging-shadow', ScDataGridDraggingShadow);
if (!window.customElements.get('sc-data-grid-column-set-filter')) window.customElements.define('sc-data-grid-column-set-filter', ScDataGridColumnSetFilter);
if (!window.customElements.get('sc-data-grid-master-cell')) window.customElements.define('sc-data-grid-master-cell', ScDataGridMasterCell);
if (!window.customElements.get('sc-data-grid-selection-cell')) window.customElements.define('sc-data-grid-selection-cell', ScDataGridSelectionCell);
if (!window.customElements.get('sc-data-grid-composite-filter')) window.customElements.define('sc-data-grid-composite-filter', ScDataGridCompositeFilter);
if (!window.customElements.get('sc-data-grid-column-manager')) window.customElements.define('sc-data-grid-column-manager', ScDataGridColumnManager);

if (!window.customElements.get('sc-data-grid-editing')) window.customElements.define('sc-data-grid-editing', ScDataGridEditing);

if (!window.customElements.get('sc-data-grid-overlapping')) window.customElements.define('sc-data-grid-overlapping', ScDataGridOverlapping);

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
