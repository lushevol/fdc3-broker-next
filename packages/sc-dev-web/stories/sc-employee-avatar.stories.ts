import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';

export default {
  title: 'Business Components/Employee/Employee Avatar',
  component: 'sc-employee-avatar',
  parameters: {
    docs: {
      description: {
        component:
          `Employee avatar shows the avatar of the employee, and can show more information by clicking the avatar.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Employee bank id.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'avatar-size': {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl', 'default'],
      description: 'Sets the size of the avatar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Attributes',
      },
    },   
    'sc-loaded': {
      description: 'Emitted when get the employee information by API.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    id: '',
    'avatar-size': 'lg',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  id: string;
  'avatar-size': string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-employee-avatar 
    id=${props.id}
    avatar-size=${props['avatar-size']} 
  > 
  </sc-employee-avatar>
`);

export const Default = Template.bind({});
Default.args = {
  id: '1574871',
};