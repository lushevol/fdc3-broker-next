import { html, TemplateResult } from 'lit';
import '@scdevkit/webkit-ext';
import { handleCustomEvent } from '../src/shared/util.js';

export default {
  title: 'Business Components/Employee/Employee Input',
  component: 'sc-employee-input',
  parameters: {
    docs: {
      description: {
        component:
          'Employee input allow user to search by employee id and show the employee information by card.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Employee input default value.',
      table: {
        type: { summary: 'string' },
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
    value: '',
    readonly: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  value: string;
  readonly: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-employee-input 
    .value=${props.value} 
    ?readonly=${props.readonly}
    @sc-select=${handleCustomEvent}
    @sc-input=${handleCustomEvent}
    @sc-clear=${handleCustomEvent}
  > 
  </sc-employee-input>
`;

export const Default = Template.bind({});
Default.args = {};

export const Readonly = Template.bind({});
Readonly.args = {
  readonly: true,
};
