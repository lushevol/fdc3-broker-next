import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Button, Stack, TextField, Typography } from '../src/primitives';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  type GridColDef,
} from '../src/data-grid';
import { Delete, Edit } from '../src/icons';
import { Spinner } from '../src';

const initialRows = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `Example item ${String(index + 1).padStart(2, '0')}`,
  category: ['Alpha', 'Beta', 'Gamma'][index % 3],
  quantity: (index + 1) * 3,
}));
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 65 },
  { field: 'name', headerName: 'Name', minWidth: 170, flex: 1, editable: true },
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    type: 'singleSelect',
    valueOptions: ['Alpha', 'Beta', 'Gamma'],
    editable: true,
  },
  { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100, editable: true },
];
function NamedLoadingOverlay() {
  return (
    <Box
      role="row"
      sx={{ height: '100%', bgcolor: 'background.paper', display: 'grid', placeItems: 'center' }}
    >
      <Box role="gridcell" aria-colspan={4}>
        <Stack alignItems="center" spacing={1}>
          <Spinner aria-label="Loading example rows" />
          <Typography>Loading example rows…</Typography>
        </Stack>
      </Box>
    </Box>
  );
}
function ExportToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{ fileName: 'storybook-example-items' }}
        printOptions={{ disableToolbarButton: true }}
      />
    </GridToolbarContainer>
  );
}
function GridDemo({
  loading = false,
  empty = false,
  density = 'standard',
  editable = false,
  selection = false,
  toolbar = false,
}: {
  loading?: boolean;
  empty?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
  editable?: boolean;
  selection?: boolean;
  toolbar?: boolean;
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [selected, setSelected] = React.useState<(number | string)[]>([]);
  const [query, setQuery] = React.useState('');
  return (
    <Stack spacing={2} sx={{ p: 2, maxWidth: 920 }}>
      <Typography>
        {editable
          ? 'Double-click a cell to edit. Enter commits, Escape cancels.'
          : 'Column headers support sorting; their menus expose filters and visibility.'}
      </Typography>
      <TextField
        size="small"
        label="Search example rows"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Box sx={{ height: density === 'comfortable' ? 520 : 420, width: '100%', minWidth: 0 }}>
        <DataGrid
          aria-label="Example items"
          experimentalFeatures={{ ariaV7: true }}
          rows={
            empty
              ? []
              : rows.filter((row) =>
                  `${row.name} ${row.category}`.toLowerCase().includes(query.toLowerCase()),
                )
          }
          columns={columns.map((column) => ({ ...column, editable: editable && column.editable }))}
          density={density}
          loading={loading}
          checkboxSelection={selection}
          disableRowSelectionOnClick
          rowSelectionModel={selected}
          onRowSelectionModelChange={setSelected}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
            sorting: { sortModel: [{ field: 'id', sort: 'asc' }] },
          }}
          processRowUpdate={(updatedRow) => {
            setRows((current) =>
              current.map((row) => (row.id === updatedRow.id ? (updatedRow as typeof row) : row)),
            );
            return updatedRow;
          }}
          slots={{
            loadingOverlay: NamedLoadingOverlay,
            ...(toolbar ? { toolbar: ExportToolbar } : {}),
          }}
        />
      </Box>
      {selection && (
        <Typography role="status">Selected IDs: {selected.join(', ') || 'none'}</Typography>
      )}
      {editable && <Button onClick={() => setRows(initialRows)}>Reset edited rows</Button>}
    </Stack>
  );
}
const meta = {
  title: 'Integration/Data grid',
  component: GridDemo,
  tags: ['autodocs'],
  args: {
    loading: false,
    empty: false,
    density: 'standard',
    editable: false,
    selection: false,
    toolbar: false,
  },
  argTypes: { density: { control: 'select', options: ['compact', 'standard', 'comfortable'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Optional Community MUI X v6 entry. The host owns rows, persistence and action policy. These local examples cover sorting, filter menus, column visibility, pagination, editing, selection, and CSV export. Narrow viewports scroll the grid horizontally.',
      },
    },
  },
} satisfies Meta<typeof GridDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SortingFilteringPagination: Story = {};
export const SelectionAndExport: Story = { args: { selection: true, toolbar: true } };
export const EditableCells: Story = { args: { editable: true } };
export const Compact: Story = { args: { density: 'compact' } };
export const Comfortable: Story = { args: { density: 'comfortable' } };
export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          'The optional MUI X v6 loadingOverlay slot supplies a named progress indicator in grid row/cell structure. Applications own this overlay content; the package entry remains the original Community grid.',
      },
    },
  },
};
export const Empty: Story = { args: { empty: true } };
function RowActionsDemo() {
  const [rows, setRows] = React.useState(initialRows.slice(0, 5));
  const [message, setMessage] = React.useState('Choose a row action.');
  const actions: GridColDef = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    getActions: ({ id }) => [
      <GridActionsCellItem
        key="edit"
        icon={<Edit />}
        label={`Edit item ${id}`}
        onClick={() => setMessage(`Edit requested for item ${id}`)}
      />,
      <GridActionsCellItem
        key="delete"
        icon={<Delete />}
        label={`Remove item ${id}`}
        onClick={() => {
          setRows((current) => current.filter((row) => row.id !== id));
          setMessage(`Removed item ${id}`);
        }}
        showInMenu
      />,
    ],
  };
  return (
    <Stack spacing={2} sx={{ p: 2, maxWidth: 920 }}>
      <Box sx={{ height: 380, minWidth: 0 }}>
        <DataGrid
          aria-label="Items with row actions"
          experimentalFeatures={{ ariaV7: true }}
          rows={rows}
          columns={[...columns.map((column) => ({ ...column, editable: false })), actions]}
          disableRowSelectionOnClick
          pageSizeOptions={[5]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
        />
      </Box>
      <Typography role="status">{message}</Typography>
      <Button
        onClick={() => {
          setRows(initialRows.slice(0, 5));
          setMessage('Rows restored.');
        }}
      >
        Restore rows
      </Button>
    </Stack>
  );
}
export const RowActions: Story = { render: () => <RowActionsDemo /> };
