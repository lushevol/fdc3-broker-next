import { html, TemplateResult } from 'lit';
import { useArgs } from '@storybook/preview-api';

const defaultConfig = {
   'left-back': {
        back: {
            mode: 'href',
            to: '#',
            label: 'Back',
            disabled: false,
        },
    },
    'left-actions': [
        {
            text: 'title-1',
        },
        {
            buttonDropdown: {
                value: '',
                name: 'My view',
                iconName: 'file-text--line',
                disabled: false,
                width: '90px',
                'option-width': '120px',
                data: [
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                ],
                'sc-select': (e:CustomEvent)=>{
                    console.log('My view sc-select test ', e.detail);
                },
            },
        },
        {
            button: {
                type: 'link',
                leftIcon: 'download',
                disabled: false,
                buttonText: 'Export',
                width: '120px',
                click: (e:CustomEvent)=>{
                    console.log('Export click ', e.detail);
                },
            },
        },
    ],
    'right-helper': {
        label: 'Last saved: 3 hours ago',
        tooltip: 'Tooltip content here',
        required: false,
    },
    'right-groups': [
        {
            button: {
                type: 'link',
                disabled: false,
                width: '80px',
                buttonText: 'Save draft',
                click: (e:CustomEvent)=>{
                    console.log('Save Draft click ', e.detail);
                },
            },
        },
        {
            button: {
                type: 'secondary',
                disabled: false,
                width: '80px',
                buttonText: 'Cancel',
                click: (e:CustomEvent)=>{
                    console.log('Cancel click ', e.detail);
                },
            },
        },
        {
            button: {
                type: 'primary',
                disabled: false,
                // width: '80px',
                buttonText: 'Submit',
                click: (e:CustomEvent)=>{
                    console.log('Submit click ', e.detail);
                },
            },
        },
        
    ],
} as any;

export default {
  title: 'Components/Action Bar',
  component: 'sc-action-bar',
  parameters: {
    docs: {
      description: {
        component:
          'Action bar provides access to important actions across the page. It is usually placed at the top and remain sticky while user scrolls for them to perfrom certain actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    config: { control: 'object', description: 'config:<br\> Sets to configure the action bar.<br\> <span style="font-weight: bold;">left-back:</span><br\> Sets to configure the left back section for the action bar. <br\>Supports two types: back and breadcrumb. User should choose one of them.<br\> <span style="font-weight: bold;">left-actions:</span><br\> Sets to configure the action section for the action bar. <br\>Supports button, button dropdown and plain text.<br\> <span style="font-weight: bold;">right-helper:</span> <br\> Sets to configure the helper section for the action bar.<br\>Supports label.<br\> <span style="font-weight: bold;">right-groups:</span> <br\> Sets to configure the right action group section for the action bar.<br\>Supports button.<br\> User also can set the corresponding slot (check the slots table) to override the default sections.',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      } },
    'hide-back': { control: 'boolean', description: 'Sets to hide the back button.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' } },
    'hide-left-actions': { control: 'boolean', description: 'Sets to hide the left actions.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' } },
    'hide-right-helper': { control: 'boolean', description: 'Sets to hide the right helper.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' } },
    'hide-right-groups': { control: 'boolean', description: 'Sets to hide the right groups.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' } },
    'hide-bottom-border': { control: 'boolean', description: 'Sets to hide the bottom border.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' } },
    'hide-shadow': { control: 'boolean', description: 'Sets to hide the bottom shadow.', table: { type: { summary: 'boolean' },defaultValue: { summary: true },category: 'Attributes' } },
    'z-index': { control: 'number', description: 'Set the z-index of the action bar.', table: { type: { summary: 'number' },defaultValue: { summary: 400 },category: 'Attributes' } },
    'no-sticky': { control: 'boolean', description: 'Disable sticky behavior of the action bar.', table: { type: { summary: 'boolean' },defaultValue: { summary: false },category: 'Attributes' }  },
    'slot[name=\'left-back\']': { control: 'text', description: 'Custom content for the left back slot.', table: { category: 'Slots' } },
    'slot[name=\'left-actions\']': { control: 'text', description: 'Custom content for the left actions slot.', table: { category: 'Slots' } },
    'slot[name=\'right-helper\']': { control: 'text', description: 'Custom content for the right helper slot.', table: { category: 'Slots' } },
    'slot[name=\'right-groups\']': { control: 'text', description: 'Custom content for the right groups slot.', table: { category: 'Slots' } },
  },
  args: {
    config: defaultConfig,
    'hide-back': false,
    'hide-left-actions': false,
    'hide-right-helper': false,
    'hide-right-groups': false,
    'hide-bottom-border': false,
    'hide-shadow': true,
    'z-index': 400,
    'no-sticky': false,
    'slot[name=\'left-back\']': 'Custom Back',  
    'slot[name=\'left-actions\']': 'Custom Left Actions',
    'slot[name=\'right-helper\']': 'Custom Right Helper',
    'slot[name=\'right-groups\']': 'Custom Right Groups',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'config': any;
  'hide-back': boolean;
  'hide-left-actions': boolean;
  'hide-right-helper': boolean;
  'hide-right-groups': boolean;
  'hide-bottom-border': boolean;
  'hide-shadow': boolean;
  'z-index': number;
  'no-sticky': boolean;
  'slot[name=\'left-back\']'?: string | TemplateResult;
  'slot[name=\'left-actions\']'?: string | TemplateResult;
  'slot[name=\'right-helper\']'?: string | TemplateResult;
  'slot[name=\'right-groups\']'?: string | TemplateResult;
}

const tempHideShadow = true;
const tempHideBottomBorder = false;
const tempObjForSwitch = {
  template: {
    hideShadow: tempHideShadow,
    hideBottomBorder: tempHideBottomBorder,
  },
  breadcrumbtemplate: {
    hideShadow: tempHideShadow,
    hideBottomBorder: tempHideBottomBorder,
  },
} as any;

function switchBorderAndShadow(props: any, key:string) {
  const [, updateArgs] = useArgs();
  if (tempObjForSwitch[key].hideShadow !== props['hide-shadow']) {
    updateArgs({ 'hide-bottom-border': !props['hide-shadow'] });
    tempObjForSwitch[key].hideShadow = props['hide-shadow'];
  }
  if (tempObjForSwitch[key].hideBottomBorder !== props['hide-bottom-border']) {
    updateArgs({ 'hide-shadow': !props['hide-bottom-border'] });
    tempObjForSwitch[key].hideBottomBorder = props['hide-bottom-border'];
  }
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  switchBorderAndShadow(props, 'template');
  return html`
    <sc-action-bar
      ?hide-back=${props['hide-back']}
      ?hide-left-actions=${props['hide-left-actions']}
      ?hide-right-helper=${props['hide-right-helper']}
      ?hide-right-groups=${props['hide-right-groups']}
      ?hide-bottom-border=${props['hide-bottom-border']}
      ?hide-shadow=${props['hide-shadow']}
      z-index=${props['z-index']}
      ?no-sticky=${props['no-sticky']}
      .config=${props['config']}
    ></sc-action-bar>
  `;
};

export const Default = Template.bind({});
Default.args = {
  config: defaultConfig,
  'hide-back': false,
  'hide-left-actions': false,
  'hide-right-helper': false,
  'hide-right-groups': false,
  'hide-bottom-border': false,
  'hide-shadow': true,
  'z-index': 400,
  'no-sticky': false,
};

const BreadcrumbTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  switchBorderAndShadow(props, 'breadcrumbtemplate');
  return html`
    <sc-action-bar
      ?hide-back=${props['hide-back']}
      ?hide-left-actions=${props['hide-left-actions']}
      ?hide-right-helper=${props['hide-right-helper']}
      ?hide-right-groups=${props['hide-right-groups']}
      ?hide-bottom-border=${props['hide-bottom-border']}
      ?hide-shadow=${props['hide-shadow']}
      z-index=${props['z-index']}
      ?no-sticky=${props['no-sticky']}
      .config=${props['config']}
    ></sc-action-bar>
  `;
};

export const BreadcrumbBar = BreadcrumbTemplate.bind({});
BreadcrumbBar.args = {
  config: {
    'left-back': {
      breadcrumb: {
          data: [
              { name: 'Home', href: '#', target: '_blank' },
              { name: 'Section', href: '#', target: '_blank' },
              { name: 'Sub-section', href: '#', target: '_blank' },
          ],
      },
    },
    'right-groups': [...defaultConfig['right-groups']],
    'left-actions': [
        {
            text: 'title-2',
        },
    ],
  },
  'hide-back': false,
  'hide-left-actions': false,
  'hide-right-helper': false,
  'hide-right-groups': false,
  'hide-bottom-border': false,
  'hide-shadow': true,
  'z-index': 400,
  'no-sticky': false,
};

const CusTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-action-bar
    ?hide-back=${props['hide-back']}
    ?hide-left-actions=${props['hide-left-actions']}
    ?hide-right-helper=${props['hide-right-helper']}
    ?hide-right-groups=${props['hide-right-groups']}
    ?hide-bottom-border=${props['hide-bottom-border']}
    ?hide-shadow=${props['hide-shadow']}
    z-index=${props['z-index']}
    ?no-sticky=${props['no-sticky']}
    .config=${props['config']}
  >
    <div slot="left-back">
      ${props['slot[name=\'left-back\']']}  
    </div>
    <div slot="left-actions">
      ${props['slot[name=\'left-actions\']']}  
    </div>
    <div slot="right-helper">
      ${props['slot[name=\'right-helper\']']}
    </div>
    <div slot="right-groups">
      ${props['slot[name=\'right-groups\']']}
    </div>
  </sc-action-bar>
`;

export const CustomActionBar = CusTemplate.bind({});
CustomActionBar.args = {
  'hide-back': false,
  'hide-left-actions': false,
  'hide-right-helper': false,
  'hide-right-groups': false,
  'hide-bottom-border': false,
  'hide-shadow': true,
  'z-index': 401,
  'no-sticky': false,
};


