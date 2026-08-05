import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';

export default {
  title: 'Business Components/Organisation/OrganisationHierarchy',
  component: 'sc-organisation-hierarchy',
  parameters: {
    docs: {
      description: {
        component:
          `Organisation hierarchy shows organisation hierarchy chart.
          <br/>
          To use business components, , please import '@scdevkit/webkit-ext'.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    roles: {
      control: 'array',
      description: 'Set to render the organisation roles.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
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
  roles: any[];
}

const roles = [{
  id: '1389585',
  name: 'Johnson, Kingston',
  title: 'Head, Application Platform',
  department: 'IT-Projs-ET Integration Svcs',
  location: 'Singapore',
}, {
  id: '1574871',
  name: 'Masked, Kendall',
  title: 'Senior Manager',
  department: 'TSA PRJ SG DevOps',
  connection: { open: true,label: '21' },
  location: 'Singapore',
}, [
  {
    id: '1577986',
    name: 'Sulistyo',
    title: 'Product Engineer',
    department: 'TSA PRJ SG DevOps',
    location: 'Singapore',
  }, {
    id: '1547358',
    name: 'Li Wen',
    title: 'Testing Lead',
    department: 'TSA PRJ SG DevOps',
    location: 'Singapore',
  }, {
    id: '1399899',
    name: 'Wang Yufang',
    title: 'Product Engineer Manager',
    department: 'China - Tianjin (GBS)',
    location: 'Tianjin',
  },
]];

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-organisation-hierarchy
    .roles=${props.roles}
  ></sc-organisation-hierarchy>
  <script type="module">
    const roles = ${roles}
  </script>
`);

export const Default = Template.bind({});
Default.args = {
  roles,
};