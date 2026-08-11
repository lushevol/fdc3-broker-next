import { Button } from '@fm/ratan-design/button';
import { DataGrid, type DataGridColumn } from '@fm/ratan-design/data-grid';
import { DatePicker } from '@fm/ratan-design/date-picker';
import { Dialog } from '@fm/ratan-design/dialog';
import { Tab, TabList, TabPanel, Tabs } from '@fm/ratan-design/tabs';
import { TextInput } from '@fm/ratan-design/text-input';

export const buttonExample = <Button loadingLabel="Saving">Save</Button>;
export const textInputExample = <TextInput label="Account" name="account" required />;
export const dialogExample = <Dialog open label="Confirm">Review the order.</Dialog>;
export const datePickerExample = <DatePicker label="Trade date" name="tradeDate" locale="en-GB" />;
export const tabsExample = <Tabs defaultSelectedKey="orders" aria-label="Workspace"><TabList><Tab id="orders">Orders</Tab></TabList><TabPanel id="orders">Order list</TabPanel></Tabs>;

interface Trade { id: string; symbol: string }
const columns: DataGridColumn<Trade>[] = [{ id: 'symbol', header: 'Symbol', accessor: 'symbol', sortable: true }];
export const dataGridExample = <DataGrid aria-label="Trades" data={[{ id: '1', symbol: 'SCB' }]} columns={columns} />;
