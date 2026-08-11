import { html, TemplateResult } from 'lit';

interface ArgTypes {
  multiple: boolean;
  disabled: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  'row-max-columns': 1 | 2 | 3 | 4 | 5 | 6;
  value: string;
}

const ALL_ITEMS = [
  { type: 'in-progress', label: 'In progress', count: 24 },
  { type: 'pending', label: 'Pending', count: 8 },
  { type: 'success', label: 'Success', count: 156 },
  { type: 'rejected', label: 'Rejected', count: 3 },
  { type: 'draft', label: 'Draft', count: 12 },
  { type: 'complete', label: 'Complete', count: 89 },
  { type: 'minor-error', label: 'Minor error', count: 5 },
  { type: 'information', label: 'Information', count: 42 },
  { type: 'locked', label: 'Locked', count: 7 },
  { type: 'archived', label: 'Archived', count: 31 },
  { type: 'warning', label: 'Warning', count: 15 },
  { type: 'error', label: 'Error', count: 2 },
] as const;

export default {
  title: 'Components/Status Filter/Status Filter',
  component: 'sc-status-filter',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected value (single mode) or values (multiple mode).',
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multiple selected status filters.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state for entire filter group.',
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant for all items in the group.',
    },
    'row-max-columns': {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Maximum columns per row (max: 6).',
    },
  },
  args: {
    value: '',
    multiple: false,
    disabled: false,
    size: 'md',
    'row-max-columns': 6,
  },
};

const Template = (args: ArgTypes, itemCount = 6): TemplateResult => {
  const items = ALL_ITEMS.slice(0, itemCount);

  return html`
    <sc-status-filter
      ?multiple="${args.multiple}"
      ?disabled="${args.disabled}"
      size="${args.size}"
      row-max-columns="${args['row-max-columns']}"
      .value=${args.value}
      @sc-select="${(e: CustomEvent) => console.log('sc-select', e.detail)}"
    >
      ${items.map(
        item => html`
          <sc-status-filter-item
            type="${item.type}"
            label="${item.label}"
            count="${item.count}"
          ></sc-status-filter-item>
        `
      )}
    </sc-status-filter>
  `;
};

export const SingleSelect = (args: ArgTypes) => Template(args, 6);
SingleSelect.args = { multiple: false };

export const MultipleSelect = (args: ArgTypes) => Template(args, 6);
MultipleSelect.args = { multiple: true };

export const RowMaxColumns = (args: ArgTypes) => Template(args, 12);
RowMaxColumns.args = { 'row-max-columns': 3 };

export const Disabled = (args: ArgTypes) => Template(args, 6);
Disabled.args = { disabled: true };
