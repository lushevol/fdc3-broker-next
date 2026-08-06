import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { TAB_VARIANTS, Tab, TabDivider, TabList, TabPanel, Tabs } from '@fm/ratan-design/tabs';

const meta = { title: 'Proof/Tabs', component: Tabs, tags: ['autodocs'], args: { children: null } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
const Example = ({ variant = 'outline', activation = 'auto' }: { variant?: (typeof TAB_VARIANTS)[number]; activation?: 'auto' | 'manual' }) => <Tabs defaultSelectedKey="positions" variant={variant} activation={activation} aria-label={`${variant} tabs`}><TabList><Tab id="positions" counter={3}>Positions</Tab><TabDivider /><Tab id="orders" closable>Orders</Tab><Tab id="errors" error>Errors</Tab><Tab id="disabled" disabled>Disabled</Tab></TabList><TabPanel id="positions">Positions</TabPanel><TabPanel id="orders">Orders</TabPanel><TabPanel id="errors">Errors</TabPanel><TabPanel id="disabled">Disabled</TabPanel></Tabs>;
export const Playground: Story = { render: () => <Example />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('tab', { name: /Orders/ })); await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Orders'); } };
export const Variants: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>{TAB_VARIANTS.map((variant) => <Example key={variant} variant={variant} />)}</div> };
export const ManualActivation: Story = { render: () => <Example activation="manual" /> };
