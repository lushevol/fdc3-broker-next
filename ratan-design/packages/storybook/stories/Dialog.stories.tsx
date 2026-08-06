import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { Dialog } from '@fm/ratan-design/dialog';

const meta = { title: 'Proof/Dialog', component: Dialog, tags: ['autodocs'], args: { defaultOpen: true, label: 'Confirm action', children: 'This overlay portals to document.body.' } } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Dismissable: Story = { play: async ({ canvasElement }) => { const page = within(canvasElement.ownerDocument.body); const dialog = await page.findByRole('dialog'); await expect(dialog).toBeVisible(); await userEvent.click(page.getByRole('button', { name: 'Close' })); await expect(page.queryByRole('dialog')).not.toBeInTheDocument(); } };
export const AlertDialog: Story = { args: { role: 'alertdialog', isDismissable: false, footer: 'Required decision' } };
export const WithoutCloseButton: Story = { args: { showCloseButton: false, isKeyboardDismissDisabled: true } };
