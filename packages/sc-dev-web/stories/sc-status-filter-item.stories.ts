import { html, TemplateResult } from 'lit';

type StatusType =
  | 'locked'
  | 'on-hold'
  | 'archived'
  | 'draft'
  | 'missing'
  | 'information'
  | 'in-progress'
  | 'complete'
  | 'success'
  | 'warning'
  | 'pending'
  | 'minor-error'
  | 'error'
  | 'rejected'
  | 'critical';

interface ArgTypes {
  type: StatusType;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: string;
  count: number;
  selected: boolean;
  disabled: boolean;
}

export default {
  title: 'Components/Status Filter/Status Filter Item',
  component: 'sc-status-filter-item',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: [
        'locked',
        'on-hold',
        'archived',
        'draft',
        'missing',
        'information',
        'in-progress',
        'complete',
        'success',
        'warning',
        'pending',
        'minor-error',
        'error',
        'rejected',
        'critical',
      ],
      description: 'Status type determines icon and color palette.',
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant.',
    },
    label: {
      control: 'text',
      description: 'Display label.',
    },
    count: {
      control: 'number',
      description: 'Count to display.',
    },
    selected: {
      control: 'boolean',
      description: 'Selected state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state.',
    },
  },
  args: {
    type: 'complete',
    size: 'md',
    label: 'Status filter item label',
    count: 25,
    selected: false,
    disabled: false,
  },
};

const Template = (args: ArgTypes): TemplateResult => html`
  <sc-status-filter-item
    type="${args.type}"
    size="${args.size}"
    label="${args.label}"
    count="${args.count}"
    ?selected="${args.selected}"
    ?disabled="${args.disabled}"
  ></sc-status-filter-item>
`;

export const Overview = Template.bind({});

export const Default = Template.bind({}) as any;
Default.args = { selected: false };

export const Selected = Template.bind({}) as any;
Selected.args = { selected: true };

export const Disabled = Template.bind({}) as any;
Disabled.args = { disabled: true };
