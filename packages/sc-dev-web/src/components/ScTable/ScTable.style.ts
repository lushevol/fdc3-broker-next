import { css } from 'lit';

export default css`
:host {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  --sc-table-row-height: 56px;
  --sc-table-filter-max-height: 200px;
}

.compact {
  --sc-table-row-height: 32px;
}

table {
  width: 100%;
  border-spacing: 0px;
  border-collapse: seperate;
}

table .hide-header {
  display: none;
}

th {
  background: var(--sc-table-th-background, var(--sc-color-white));
  color: var(--sc-table-th-color, var(--sc-color-blue-900));
  text-align: left;
  white-space: nowrap;
  font-weight: var(--sc-table-header-font-weight, 600);
  font-size: var(--sc-table-header-font-size, 1rem);
  border-bottom: 2px solid;
  border-color: var(--sc-table-divider-color, var(--sc-color-grey-600));
  padding-left: 5px;
  padding-right: 0;
  box-sizing: border-box;
}
.normal-th {
  vertical-align: top;
}

th.sticky {
  position: sticky;
  background: var(--sc-table-th-background, var(--sc-color-white));
  top: 0;
  z-index: 1;
}

tbody tr {
  background-color: var(--sc-table-tr-background, var(--sc-color-white));
}

tbody .sticky-column {
  background-color: var(--sc-table-tr-background, var(--sc-color-white));
}
tbody .fixed-line-left {
  border-left: 1px solid var(--sc-table-td-border-top, var(--sc-color-grey-150));
}
tbody .fixed-line-right {
  border-right: 1px solid var(--sc-table-td-border-top, var(--sc-color-grey-150));
}

.expansive-slot-container {
  display: none;
}
.expansive-slot-container-show {
  display: table-row;
}

tbody tr, thead tr {
  height: var(--sc-table-row-height, 56px);
}

// tbody tr:nth-child(even) {
//   background-color: var(--sc-table-tr-even-background-color, none);
// }

// tbody tr:nth-child(odd) {
//   background-color: var(--sc-table-tr-odd-background-color, none);
// }

tbody tr[data-list-index]:hover td {
  background: var(--sc-table-tr-hover-background-color, var(--sc-color-blue-lightest));
}

tbody tr.is-currently-highlight {
  background: var(--sc-table-tr-highlight-background-color, none);
}

tbody tr.selected {
  background-color: var(--sc-table-tr-selected-background, var(--paper-grey-100));
}

td {
  font-size: var(--sc-table-td-font-size, 1rem);
  font-weight: normal;
  color: var(--sc-table-td-color, var(--sc-color-blue-900));
  background: var(--sc-table-td-background);
  cursor: var(--sc-table-td-cursor, inherit);
  padding-left: 5px;
  padding-right: 0;
  box-sizing: border-box;
  --sc-form-control-background-color: transparent;
}

tbody tr:not(:first-child) td {
  border-top: 1px solid;
  border-color: var(--sc-table-td-border-top, var(--sc-color-grey-150));
}

sc-checkbox {
  width: 40px;
  display: flex;
  justify-content: center;
  
}
.cell-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  width: 40px;
}
.cell-icon sc-icon {
  cursor: pointer;
  transform: rotate(-90deg);
  transition: transform 0.1s;
}
.cell-icon-expanded sc-icon {
  transform: rotate(0);
}

table[contenteditable] {
  border-collapse: collapse;
  table-layout: fixed;
}
table[contenteditable] tbody td {
  border: 1px solid;
  border-color: var(--sc-table-divider-color, var(--sc-color-grey-600));
  padding: 0 8px;
}
table[contenteditable] thead th {
  border: 1px solid;
  border-bottom: 2px solid;
  border-color: var(--sc-table-divider-color, var(--sc-color-grey-600));
  padding: 0 8px;
}
table[contenteditable] tbody td p,
table[contenteditable] thead th p {
  margin-top: 0;
  margin-bottom: 0;
}
.sc-table-pagination-part {
  position: sticky;
  left: 0;
  bottom: 0;
  z-index: 15;
  display: flex;
  justify-content: right;
  background-color: var(--sc-color-white);
}

td.popup-show {
  z-index: 16!important;
}
td.popup-show.tooltip {
  z-index: 14!important;
}
td.popup-show.overlap {
  z-index: 14!important;
}
th.popup-show {
  z-index: 16!important;
}

th.popup-show.overlap {
  z-index: 13!important;
}

th.popup-show.covered {
  z-index: 11!important;
}
`;