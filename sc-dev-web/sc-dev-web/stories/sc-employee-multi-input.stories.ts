import { html, TemplateResult } from 'lit';
import '@scdevkit/webkit-ext';
import { handleCustomEvent } from '../src/shared/util.js';

export default {
  title: 'Business Components/Employee/Employee Multi Input',
  component: 'sc-employee-multi-input',
  parameters: {
    docs: {
      description: {
        component:
          'Employee multi input allow user to search by multiple employee id and show the employee information by card.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'array',
      description: 'Employee multi input default value.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },   
    readonly: {
      control: 'boolean',
      description: 'Sets to disable editing of the form.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'min-count': {
      control: 'number',
      description: 'Sets the minimum selected employees users must keep selected.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'max-count': {
      control: 'number',
      description: 'Sets the maximum employees users can select.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'sc-select': {
      description: 'Emitted when select the employee from dropdown list.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-input': {
      description: 'Emitted when the control receives input. Get the input content by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-clear': {
      description: 'Emitted when clear content.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    value: [],
    readonly: false,
    'min-count': 0,
    'max-count': 0,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  value: [];
  readonly: boolean;
  'min-count': number;
  'max-count': number;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-employee-multi-input 
    .value=${props.value} 
    ?readonly=${props.readonly}
    .minCount=${props['min-count']}
    .maxCount=${props['max-count']}
    @sc-select=${handleCustomEvent}
    @sc-input=${handleCustomEvent}
    @sc-clear=${handleCustomEvent}
  > 
  </sc-employee-multi-input>
`;

export const Default = Template.bind({});
Default.args = {};

export const Readonly = Template.bind({});
Readonly.args = {
  readonly: true,
};

export const MinMax = Template.bind({});
MinMax.args = {
  'min-count': 1,
  'max-count': 3,
};