import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';

export default {
  title: 'Business Components/Case/Case Card',
  component: 'sc-case-card',
  parameters: {
    docs: {
      description: {
        component:
          `Case card shows the case information.
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Case id.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    }, 
    'major-field': {
      control: 'inline-radio',
      description: 'Sets to decide which field can be shown as title.',
      options: ['id', 'name'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'name' },
        category: 'Attributes',
      },
    }, 
    fields: {
      control: 'array',
      description: `Set to customize the fields. 
      All Supported values: status, lastUpdate, requestedBy, requestedFor, prefix`,
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: ['status', 'lastUpdate', 'requestedBy', 'requestedFor', 'prefix'] },
        category: 'Attributes',
      },
    },    
    actions: {
      control: 'array',
      description: `Set to customize the actions.
      actions=[html\`<div>Edit</div>\`]`,
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },  
    'sc-loaded': {
      description: 'Emitted when get the case information by API.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    id: '',
    'major-field': 'name',
    fields: ['status', 'lastUpdate', 'requestedBy', 'requestedFor', 'prefix'],
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  id: string;
  'major-field': string;
  fields: string[];
  actions: any[];
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-case-card 
    id=${props.id}
    major-field=${props['major-field']}
    .fields=${props.fields}
    .actions=${props.actions}
  > 
  </sc-case-card>
`);

export const Default = Template.bind({});
Default.args = {
  id: '1234',
};

export const MajorField = Template.bind({});
MajorField.args = {
  id: '1234',
  'major-field': 'id',
};

export const CustomFields = Template.bind({});
CustomFields.args = {
  id: '1234',
  fields: ['requestedFor'],
};

export const CustomActions = Template.bind({});
CustomActions.args = {
  id: '1234',
  actions: [
    html`<div @click=${() => console.log('edit')}>Edit</div>`,
  ],
};