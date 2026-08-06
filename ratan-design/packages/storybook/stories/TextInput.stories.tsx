import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { TEXT_INPUT_BORDER_TYPES, TEXT_INPUT_SIZES, TextInput } from '@fm/ratan-design/text-input';

const meta = { title: 'Proof/TextInput', component: TextInput, tags: ['autodocs'], args: { label: 'Account name', defaultValue: 'Ratan' } } satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
Playground.play = async ({ canvasElement }) => { const input = within(canvasElement).getByRole('textbox', { name: 'Account name' }); await userEvent.clear(input); await userEvent.type(input, 'Prosper'); await expect(input).toHaveValue('Prosper'); };
export const SizesAndBorders: Story = { render: () => <div style={{ display: 'grid', gap: 16 }}>{TEXT_INPUT_BORDER_TYPES.flatMap((borderType) => TEXT_INPUT_SIZES.map((size) => <TextInput key={`${borderType}-${size}`} label={`${borderType} ${size}`} borderType={borderType} size={size} defaultValue="Value" />))}</div> };
export const States: Story = { render: () => <div style={{ display: 'grid', gap: 16 }}><TextInput label="Error" error errorMessage="Invalid value" defaultValue="Bad" /><TextInput label="Success" success defaultValue="Valid" /><TextInput label="Disabled" disabled defaultValue="Disabled" /><TextInput label="Multiline" multiline defaultValue="Line one" showCharacterCount /></div> };
