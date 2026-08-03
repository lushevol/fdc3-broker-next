import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';

import '@scdevkit/webkit-ext';

const Fields: any = [
  {
    category: 'Key Information',
    fields: [
      {
        label: 'Full Name',
        key: 'customer.fullName',
      }, {
        label: 'Middle Name',
        key: 'customer.midName',
      }, {
        label: 'Last Name',
        key: 'customer.lName',
      }, {
        label: 'Customer Type',
        key: 'customer.profileType',
      }, {
        label: 'Customer Segment',
        key: 'customer.segmentCode',
      }, {
        label: 'Status',
        key: 'customer.relationshipStatus',
      },
    ],
  }, {
    category: 'Personal Information',
    fields: [
      {
        label: 'Date Of Birth',
        key: 'customer.dob',
        type: 'date',
      },
      {
        label: 'Country Of Residence',
        key: 'customer.residentCountry',
      },
    ],
  }, {
    category: 'Relationship Information',
    fields: [
      {
        label: 'ARM Code',
        key: 'customer.armCode',
      },
      {
        label: 'Relationship Status',
        key: 'customer.relationshipStatus',
      }, {
        label: 'Activation Date',
        key: 'customer.profileActivationDate',
        type: 'date',
      },
    ],
  },
];
export default {
  title: 'Business Components/Customer/Customer Detail',
  component: 'sc-customer-detail',
  parameters: {
    docs: {
      description: {
        component:
          `Customer detail shows the customer detail information.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'reference-id': {
      control: 'text',
      description: 'Customer reference id.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'country-code': {
      control: 'text',
      description: 'Customer country code.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },  
    columns: {
      control: 'number',
      description: 'Set to customize the column layout. ',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
    },   
    fields: {
      control: 'array',
      description: `Set to customize the fields. 
      To get the default fields, listen the sc-loaded event, get from event.detail.fields`,
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },    
    queries: {
      control: 'object',
      description: `Sets to customize the graphql fields.
      To get the default queries, listen the sc-loaded event, get from event.detail.queries`,
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    }, 
    'sc-loaded': {
      description: 'Emitted when the component loaded.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    'reference-id': '',
    'country-code': '',
    fields: Fields,
    columns: 1,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'reference-id': string,
  'country-code': string,
  fields: any[],
  columns: number
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-customer-detail 
    reference-id=${props['reference-id']} 
    country-code=${props['country-code']}
    .fields=${props.fields || Fields}
    .columns=${props.columns}
  > 
  </sc-customer-detail>
`);

const CustomTemplate: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-customer-detail
    class=custom-field
    reference-id=${props['reference-id']} 
    country-code=${props['country-code']}
    .fields=${props.fields || Fields}
    .columns=${props.columns}
  > 
  </sc-customer-detail>
  <script type="module">
    const ele = document.querySelector('.custom-field');
    const customizeFields = event => {
      const fields = event.detail.fields;
      fields.push({
        category: 'Risk Information',
        fields: [
          {
            label: 'ReferenceId',
            key: 'risk.referenceId'
          },
          {
            label: 'Created At',
            key: 'risk.riskDetails[0].createdAt',
            type: 'date'
          }, {
            label: 'Expiry Date',
            key: 'risk.riskDetails[0].riskExpiryDate',
            type: 'date'
          }
        ]
      })
      ele.fields = fields;
    }
    ele.addEventListener('sc-loaded', customizeFields)
  </script>
`);

export const Default = Template.bind({});
Default.args = {
  'reference-id': '3560000000600908',
  'country-code': 'IN',
};

export const MultipleColumns = Template.bind({});
MultipleColumns.args = {
  'reference-id': '3560000000600908',
  'country-code': 'IN',
  columns: 2,
};

export const CustomFields = CustomTemplate.bind({});
CustomFields.args = {
  'reference-id': '3560000000600908',
  'country-code': 'IN',
  columns: 2,
  fields: [...Fields, {
    category: 'Risk Information',
    fields: [
      {
        label: 'ReferenceId',
        key: 'risk.referenceId',
      },
      {
        label: 'Created At',
        key: 'risk.riskDetails[0].createdAt',
        type: 'date',
      }, {
        label: 'Expiry Date',
        key: 'risk.riskDetails[0].riskExpiryDate',
        type: 'date',
      },
    ],
  }],
};
