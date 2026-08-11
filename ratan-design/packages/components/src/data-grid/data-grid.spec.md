# DataGrid representative slice specification

## Purpose

The proof slice validates the permanent DataGrid architecture before the full
feature matrix scales. It is not the stable-release completeness boundary.

## Public contract

- Generic Ratan-owned row, column, sorting, selection, and change-detail types
  expose no TanStack types.
- Typed accessors and cell renderers support client sorting, manual/server
  sorting, controlled/uncontrolled sorting, multiple selection, and stable row
  identifiers.
- `loading` replaces unavailable primary data. `refreshing` preserves rows and
  marks the grid busy. `loadingState`, `errorState`, and `emptyState` customize
  those distinct surfaces.
- The heavy implementation is available only from `/data-grid` and is absent
  from the root barrel.

## Foundations

TanStack Table owns row/column models and sorting. TanStack Virtual owns bounded
row rendering. React Aria Button owns sortable-header and row-selection press
and keyboard behavior. TanStack and React Aria types remain private.

## Proof gates

The slice proves generic typing, client and manual sorting, stable change
details, keyboard-operable sorting/selection, bounded rendering for 1,000 rows,
loading/refreshing/empty/error semantics, Axe, manifest mapping, and package
isolation. Full grid navigation, editing, columns, grouping, export, and the
remaining frozen feature matrix are delivered by OpenSpec section 11.

