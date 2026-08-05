import { defineElement } from "./define-element.js";
import { ScTable } from "../src/components/ScTable/ScTable.js";
import { ScTableFilter } from "../src/components/ScTable/ScTableFilter.js";
import { ScTableHeaderWithSort } from "../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js";
export * from "../src/components/ScTable/ScTable.js";
export * from "../src/components/ScTable/TableHeaders/ScTableHeaderWithSort.js";

defineElement("sc-table", ScTable);
defineElement("sc-table-header-with-sort", ScTableHeaderWithSort);
defineElement("sc-table-filter", ScTableFilter);

declare global {
  interface HTMLElementTagNameMap {
    "sc-table": ScTable;
    "sc-table-header-with-sort": ScTableHeaderWithSort;
    "sc-table-filter": ScTableFilter;
  }
}
