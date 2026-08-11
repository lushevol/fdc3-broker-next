import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';

export default {
  title: 'Business Components/Employee/Employee Name',
  component: 'sc-employee-name',
  parameters: {
    docs: {
      description: {
        component:
          `Employee name shows the name of the employee, and can show more information by clicking the name.
          <br/>
          To use business components, , please import '@scdevkit/webkit-ext'.`,
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
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  id: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-employee-name 
    id=${props.id} 
  > 
  </sc-employee-name>
`);

export const Default = Template.bind({});
Default.args = {
  id: '1574871',
};