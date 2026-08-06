# DataGrid

## Purpose
Render typed data with an isolated, virtualized grid foundation. The proof slice validates architecture; stable release remains gated on the full frozen feature matrix.

## Guidance
Use `manualSorting` when the server owns transformations. `loading` replaces unavailable data; `refreshing` keeps stale rows visible and exposes busy status.

## API
Ratan-owned generic columns, client/manual sorting, controlled state, selection, custom terminal surfaces, sizing, and bounded rendering are available from `/data-grid`. See `dataGridExample`.

## Tokens
Consumes frozen `--sc-table-*`, grid, spacing, typography, color, and focus tokens.

## WebKit mapping
`sc-data-grid` maps to `DataGrid`; supporting cell/filter/manager/editing/master/overlap parts remain internal feature surfaces completed by the DataGrid roadmap.

## Deviations
TanStack Table/Virtual and React Aria types are private. Spreadsheet formulas, pivots, arbitrary merges, full personalization, and complex cross-row validation remain excluded absent frozen evidence.
