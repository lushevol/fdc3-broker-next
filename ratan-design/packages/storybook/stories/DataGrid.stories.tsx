import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { DataGrid, type DataGridColumn } from '@fm/ratan-design/data-grid';

interface Trade { id: string; symbol: string; quantity: number }
const data = Array.from({ length: 1000 }, (_, index): Trade => ({ id: String(index), symbol: `SYM${index}`, quantity: 1000 - index }));
const columns: DataGridColumn<Trade>[] = [{ id: 'symbol', header: 'Symbol', accessor: 'symbol', sortable: true }, { id: 'quantity', header: 'Quantity', accessor: 'quantity', sortable: true }];
const meta = { title: 'Proof/DataGrid', component: DataGrid<Trade>, tags: ['autodocs'], args: { 'aria-label': 'Trades', data, columns, selectionMode: 'multiple' } } satisfies Meta<typeof DataGrid<Trade>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Virtualized: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: /Sort by Symbol/ })); await expect(canvas.getByRole('grid')).toHaveAttribute('aria-rowcount', '1001'); } };
export const Refreshing: Story = { args: { refreshing: true } };
export const Loading: Story = { args: { data: [], loading: true, loadingState: 'Loading trades' } };
export const Empty: Story = { args: { data: [], emptyState: 'No trades' } };
export const ErrorState: Story = { args: { data: [], error: new Error('failed'), errorState: 'Unable to load trades' } };
