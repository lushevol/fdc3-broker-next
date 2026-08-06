import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { BUTTON_SIZES, BUTTON_TONES, BUTTON_VARIANTS, Button } from '@fm/ratan-design/button';

const meta = { title: 'Proof/Button', component: Button, tags: ['autodocs'], args: { children: 'Action' } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { play: async ({ canvasElement }) => { const button = within(canvasElement).getByRole('button', { name: 'Action' }); button.focus(); await userEvent.keyboard('{Enter}'); await expect(button).toHaveFocus(); } };
export const Variants: Story = { render: () => <div style={{ display: 'grid', gap: 12 }}>{BUTTON_VARIANTS.flatMap((variant) => BUTTON_TONES.map((tone) => <Button key={`${variant}-${tone}`} variant={variant} tone={tone}>{variant} {tone}</Button>))}</div> };
export const Sizes: Story = { render: () => <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{BUTTON_SIZES.map((size) => <Button key={size} size={size}>{size}</Button>)}</div> };
export const States: Story = { render: () => <div style={{ display: 'flex', gap: 8 }}><Button disabled>Disabled</Button><Button loading loadingLabel="Saving">Saving</Button><Button selectable="toggle" defaultSelected>Selected</Button><Button readOnly>Read only</Button></div> };
