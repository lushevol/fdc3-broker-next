import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { DatePicker } from '@fm/ratan-design/date-picker';

const meta = { title: 'Proof/DatePicker', component: DatePicker, tags: ['autodocs'], args: { label: 'Settlement date', defaultValue: '2026-08-06' } } satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const BrowserLocale: Story = { play: async ({ canvasElement }) => { const page = within(canvasElement.ownerDocument.body); await userEvent.click(within(canvasElement).getByRole('button', { name: /calendar/i })); await expect(await page.findByRole('dialog')).toBeVisible(); } };
export const BritishLocale: Story = { args: { locale: 'en-GB', description: 'DD/MM/YYYY' } };
export const RTL: Story = { args: { locale: 'ar-AE', dir: 'rtl', defaultOpen: true } };
export const Invalid: Story = { args: { required: true, invalid: true, errorMessage: 'Choose a valid date' } };
