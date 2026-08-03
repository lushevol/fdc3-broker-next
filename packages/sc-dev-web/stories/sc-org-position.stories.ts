import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';

import '@scdevkit/webkit-ext';

export default {
  title: 'Business Components/Organisation/OrganisationPosition',
  component: 'sc-organisation-role',
  parameters: {
    docs: {
      description: {
        component:
          `Organisation role is an unit component to build the organisation chart.
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
    name: {
      control: 'text',
      description: 'Employee name.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    title: {
      control: 'text',
      description: 'Position title.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    location: {
      control: 'text',
      description: 'Employee location.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    department: {
      control: 'text',
      description: 'Employee department.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    email: {
      control: 'text',
      description: 'Employee email.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },  
    phone: {
      control: 'text',
      description: 'Employee phone.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    connection: {
      control: 'object',
      description: 'Connection info.',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    }, 
    customFields: {
      control: 'array',
      description: 'Set to render the custom fields, user can also use the customFields property.',
      table: {
        type: { summary: 'array' },
        category: 'Properties',
      },
    }, 
    customCard: {
      control: 'string',
      description: 'Set to render the custom card, user can also use the customCard property.',
      table: {
        type: { summary: 'string' },
        category: 'Properties',
      },
    },
  },
  args: {},
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  id?: string;
  name?: string;
  title?: string;
  location?: string;
  connection?: any;
  department?: string;
  customCard?: any;
  customFields?: any;
  email?: string;
  phone?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-organisation-role
    .id=${props.id}
    .name=${props.name}
    .title=${props.title}
    .location=${props.location}
    .department=${props.department}
    .email=${props.email}
    .phone=${props.phone}
    .connection=${props.connection}
    .customCard=${props.customCard}
    .customFields=${props.customFields}
  ></sc-organisation-role>
  <script type="module">
    import { html } from '/node_modules/lit-html/lit-html.js';
    window.html = html;
    const customFields = [
      {
        text: 'Custom text'
      },
      {
        icon: 'home--line',
        text: html\`<sc-link>View more</sc-link>\`
      }
    ]

    const setCustomCard = (department, id, name) => {
      return html\`
        <div style='text-align: left; width: 250px'>
          <div style='font-size: 12px'>Business Function</div>
          <div style='font-weight: 700; margin: 10px 0'>\${department}</div>
          <div style='display: flex'>
            <sc-employee-avatar avatar-size=md id=\${id}></sc-employee-avatar>
            <sc-link style='margin-left: 8px'>\${name}</sc-link>  
          </div>
          <div style='display: flex; font-size: 12px'>
            <sc-icon name='people--line' size=xs></sc-icon>
            <span style='margin-left: 8px'>1,230</span>  
          </div>
        </div>
      \`
    }
    /**
     * Use as property
     * <sc-organisation-role
     *    .customFields=$\{customFields\}
     *    .customCard=$\{setCustomCard('IT-TPS-TSA Arch & Gov', '1574871', 'Masked, Kendall')\}
     * >
     * </sc-organisation-role>
     *
     */
  </script>
`);

export const Default = Template.bind({});
Default.args = {
  id: '1574871',
  name: 'Masked, Kendall',
  title: 'Senior Manager',
  department: 'TSA PRJ SG DevOps',
  connection: { open: true,label: '21' },
};

export const CustomFields = Template.bind({});
CustomFields.args = {
  id: '1574871',
  name: 'Masked, Kendall',
  title: 'Senior Manager',
  department: 'TSA PRJ SG DevOps',
  customFields: [{
    text: 'Custom text',
    raw: 'custom-text',
  },
  {
    icon: 'home--line',
    text: html`<sc-link>View more</sc-link>`,
  }],
};

const setCustomCard = (department: string, id: string, name: string) => {
  return html`
    <div style='text-align: left; width: 250px'>
      <div style='font-size: 12px'>Business Function</div>
      <div style='font-weight: 700; margin: 10px 0'>${department}</div>
      <div style='display: flex'>
        <sc-employee-avatar avatar-size=md id=${id}></sc-employee-avatar>
        <sc-link style='margin-left: 8px'>${name}</sc-link>  
      </div>
      <div style='display: flex; font-size: 12px'>
        <sc-icon name='people--line' size=xs></sc-icon>
        <span style='margin-left: 8px'>1,230</span>  
      </div>
    </div>
  `;
};
export const CustomCard = Template.bind({});
CustomCard.args = {
  customCard: setCustomCard('IT-TPS-TSA Arch & Gov', '1574871', 'Masked, Kendall'),
};