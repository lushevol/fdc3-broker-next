import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';

export default {
  title: 'Business Components/Employee/Employee Grouped Avatar',
  component: 'sc-employee-grouped-avatar',
  parameters: {
    docs: {
      description: {
        component:
          'Employee grouped avatar shows multiple avatar of the employees, and can show more information by clicking the avatar. <br/> To use business components, please import \'@scdevkit/webkit-ext\'.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ids: {
      control: 'array',
      description: 'Employee bank ids.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Sets the size of the avatar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Attributes',
      },
    },
    'prevent-default-action': {
      control: 'boolean',
      description: 'When set to true default action that will open view all avatar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'modal-header': {
      control: 'text',
      description: 'Modal header for view all.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'sc-action': {
      description: 'Emitted when click triggered on overflow count. Get the interacted element by event.detail.target.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    ids: '',
    size: 'lg',
    'prevent-default-action': false,
    'modal-header': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  ids: string[];
  size: string;
  'prevent-default-action'?: boolean;
  'modal-header'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-employee-grouped-avatar 
    .ids=${props.ids}
    size=${props['size']} 
    ?prevent-default-action=${props['prevent-default-action']} 
    ?modal-header=${props['modal-header']} 
  > 
  </sc-employee-grouped-avatar>
`);

export const Default = Template.bind({});
Default.args = {
  ids: [
    '1574871',
    '1574872',
    '1574873',
    '1574874',
    '1574875',
    '1574876',
    '1574877',
    '1574878',
    '1574879',
    '1574880',
  ],
};