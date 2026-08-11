import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';
import { handleCustomEvent } from '../src/shared/util.js';

export default {
  title: 'Business Components/Employee/Employee Card',
  component: 'sc-employee-card',
  parameters: {
    docs: {
      description: {
        component:
          `Employee card shows employee information.
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
    mode: {
      control: 'inline-radio',
      options: ['normal', 'compact', 'tag'],
      description: 'The card mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'normal' },
        category: 'Attributes',
      },
    },    
    vertical: {
      control: 'boolean',
      description: 'Set to show a vertical card.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', neq: 'tag' },
    }, 
    'center-aligned': {
      control: 'boolean',
      description: 'Set to show a center aligned card.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'vertical', eq: true },
    }, 
    width: {
      control: 'text',
      description: 'The preferred width for the card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'text',
      description: 'The preferred height for the card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'single-line-fields': {
      control: 'boolean',
      description: 'Set to show relevant fields as single lines.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'normal' },
    },
    'additional-info-link': {
      control: 'boolean',
      description: 'Set to show relevant fields as links.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'normal' },
    },
    link: {
      control: 'boolean',
      description: 'Set to show a link tag.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'tag' },
    },
    transparent: {
      control: 'boolean',
      description: 'Set to show a transparent tag.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'tag' },
    },
    'selected-on-click': {
      control: 'boolean',
      description: 'Sets to select the card on click.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    fields: {
      control: 'array',
      description: `Set to customize the fields. 
      All Supported values: id, location, avatar, businessTitle, department, email, phone`,
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: ['avatar', 'businessTitle', 'department', 'email', 'phone'] },
        category: 'Attributes',
      },
    },    
    'avatar-size': {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl', 'default'],
      description: 'Sets the size of the avatar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    }, 
    'no-actions': {
      control: 'boolean',
      description: 'Sets to hide the actions.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
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
      description: 'Emitted when get the employee information by API.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-card-click': {
      description:
        'Emitted when selecting the card. Get the selected value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
      if: { arg: 'selected-on-click', truthy: true },
    },
  },
  args: {
    id: '',
    mode: 'normal',
    'avatar-size': 'md',
    'no-actions': false,
    fields: ['avatar', 'businessTitle', 'department', 'email', 'phone'],
    vertical: false,
    'center-aligned': false,
    width: '100%',
    height: 'auto',
    'single-line-fields': false,
    'additional-info-link': false,
    link: false,
    transparent: false,
    'selected-on-click': false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  id: string;
  mode: string;
  fields: string[];
  'avatar-size': string;
  'no-actions': boolean;
  actions: any[];
  vertical: boolean;
  'center-aligned': boolean;
  width?: string;
  height?: string;
  'single-line-fields': boolean;
  'additional-info-link': boolean;
  link: boolean;
  transparent: boolean;
  'selected-on-click'?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => Provider(html`
  <sc-employee-card 
    id=${props.id} 
    mode=${props.mode}
    .fields=${props.fields}
    .actions=${props.actions} 
    .avatarSize=${props['avatar-size']}
    ?no-actions=${props['no-actions']}
    ?vertical=${props.vertical}
    ?center-aligned=${props['center-aligned']}
    width=${props['width']}
    height=${props['height']}
    ?single-line-fields=${props['single-line-fields']}
    ?additional-info-link=${props['additional-info-link']}
    ?link=${props.link}
    ?transparent=${props.transparent}
    ?selected-on-click=${props['selected-on-click']}
    @sc-card-click=${handleCustomEvent}
  > 
  </sc-employee-card>
`);

export const Default = Template.bind({});
Default.args = {
  id: '1574871',
};

export const CompactMode = Template.bind({});
CompactMode.args = {
  id: '1574871',
  mode: 'compact',
};

export const TagMode = Template.bind({});
TagMode.args = {
  id: '1574871',
  mode: 'tag',
};

export const TagModeSelectable = Template.bind({});
TagModeSelectable.args = {
  id: '1574871',
  mode: 'tag',
  'selected-on-click': true,
};

export const CustomFields = Template.bind({});
CustomFields.args = {
  id: '1574871',
  fields: ['location','avatar','businessTitle','department','email','phone'],
};

export const CustomActions = Template.bind({});
CustomActions.args = {
  id: '1574871',
  actions: [
    html`<div @click=${() => console.log('edit')}>Edit</div>`,
  ],
};