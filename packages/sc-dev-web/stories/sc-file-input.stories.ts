import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormArgTypesWithoutEvent } from './utils/FormArg.js';

const { value, ...otherArgs } = FormArgTypesWithoutEvent('file input');

export default {
  title: 'Components/File/File Input',
  component: 'sc-file-input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'File input provides a drop zone to upload files.',
      },
    },    
    controls: {
      exclude: [
        'border-type',
        'success',
        'error',
      ],
    },
  },
  argTypes: {
    ...otherArgs,
    value: {
      control: 'array',
      description: 'Sets the input field value.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'label-size': {
      control: 'inline-radio',
      description: 'The size of the label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
      options: ['sm', 'md', 'lg'],
    },
    'icon-size': {
      control: 'inline-radio',
      description: 'The size of the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    },        
    accept: {
      control: 'text',
      description: 'The file types the file input should accept, separated by comma.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'text',
      description: 'The width of file input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '100%' },
        category: 'Attributes',
      },
    },
    'max-size': {
      control: 'number',
      description: 'The max size allowed (in bytes).',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },    
    direction: {
      type: '"horizontal" | "vertical"',
      description: 'The direction of the file list.',
      options: ['horizontal', 'vertical'],
      control: 'inline-radio',
      table: { 
        defaultValue: { summary: 'vertical' },
        category: 'Attributes',
      },
    },
    'no-icon': {
      control: 'boolean',
      description: 'Hide file icon if set to true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'no-border': {
      control: 'boolean',
      description: 'Hide border if set to true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'bg-gray': {
      control: 'boolean',
      description: 'drop zone with gray background if set to true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hide-file-list': {
      control: 'boolean',
      description: 'Hide file list if set to true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Sets to allow accept more than one files at once.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    selectable: {
      control: 'boolean',
      description: 'Sets to show file name as link.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    deletable: {
      control: 'boolean',
      description: 'Sets to show delete file icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'slot[name=\'placeholder\']': {
      control: 'text',
      description: 'Sets to customize the text in drop zone.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'add-button\']': {
      control: 'text',
      description: 'Sets to Add Button style to upload file.',
      table: {
        category: 'Slots',
      },
    },
    'sc-change': {
      description: 'Emitted when file input value is changed. Get the file information by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    label: '',
    'label-size': 'md',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    placeholder: 'Click or drop file here',
    'help-text': '',
    value: [],
    accept: '',
    direction: 'vertical',
    'max-size': 0,  
    width: '100%',    
    'icon-size': 'lg',
    'no-icon': false,
    'no-border': false,
    'bg-gray': false,
    'hide-file-list': false,
    multiple: false,
    selectable: false,
    deletable: false,
    required: false,
    truncate: false,
    readonly: false,
    disabled: false,
    success: false,    
    error: false,
    'success-message': '',
    'error-message': '',
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'success\']': '',
    'slot[name=\'error\']': '',
    'slot[name=\'placeholder\']': '',
    'slot[name=\'add-button\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  accept: string;
  direction: string;
  'max-size'?: number;
  width: string;
  'icon-size': string;
  'no-icon'?: boolean;
  'no-border'?: boolean;
  'bg-gray': boolean,
  'hide-file-list': boolean,
  truncate?: boolean;
  multiple?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  'slot[name=\'placeholder\']': TemplateResult; 
  'slot[name=\'add-button\']': TemplateResult;
}

const Template: Story<ArgTypes> = props =>
  html`
  <div style="padding: 20px 30px">
    <sc-file-input
      label=${props.label} 
      label-size=${props['label-size']} 
      tooltip=${props.tooltip} 
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint} 
      hint-placement=${props['hint-placement']}
      placeholder=${props.placeholder} 
      help-text=${props['help-text']}
      value=${props.value} 
      accept=${props.accept} 
      direction=${props.direction}
      max-size=${props['max-size']} 
      width=${props.width}
      icon-size=${props['icon-size']}
      ?no-icon=${props['no-icon']}
      .no-border=${props['no-border']}
      ?bg-gray=${props['bg-gray']}
      ?hide-file-list=${props['hide-file-list']}
      ?multiple=${props.multiple} 
      ?selectable=${props.selectable} 
      ?deletable=${props.deletable}     
      ?required=${props.required} 
      ?truncate=${props.truncate} 
      ?readonly=${props.readonly} 
      ?disabled=${props.disabled} 
      ?success=${props.success}
      ?error=${props.error}
      error-message=${props['error-message']}
      success-message=${props['success-message']}
    >
      ${props['slot[name=\'label\']']
    ? html`
            <div slot="label">${props['slot[name=\'label\']']}</div>
          ` 
    : '' 
}
      ${props['slot[name=\'label-tooltip\']']
    ? html`
              <div slot="label-tooltip">${props['slot[name=\'label-tooltip\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'label-hint\']']
    ? html`
              <div slot="label-hint">${props['slot[name=\'label-hint\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'help\']']
    ? html`
              <div slot="help">${props['slot[name=\'help\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'success\']']
    ? html`
              <div slot="success">${props['slot[name=\'success\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'error\']']
    ? html`
              <div slot="error">${props['slot[name=\'error\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'placeholder\']']
    ? html`
              <div slot="placeholder">${props['slot[name=\'placeholder\']']}</div>
            ` 
    : '' 
}
    </sc-file-input>
  </div>
  `;

export const Default = Template.bind({});
Default.args = {
  label: 'Document',
};

export const Multiple = Template.bind({});
Multiple.args = {
  label: 'Document',
  multiple: true,
  accept: 'image/jpeg, image/png',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Document',
  disabled: true,
};

export const ErrorBorder = Template.bind({});
ErrorBorder.args = {
  label: 'Document',
  'error-message': 'Invalid File Format.',
};

export const GrayBackgroundDropzone = Template.bind({});
GrayBackgroundDropzone.args = {
  label: 'Document',
  'bg-gray': true,
  placeholder: 'Drag and drop files here to upload',
};

export const HideFileList = Template.bind({});
HideFileList.args = {
  label: 'Document',
  'hide-file-list': true,
};

const CustomValue: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-file-input id="input-init-value"
      ?required=${props.required} 
      ?truncate=${props.truncate} 
      ?disabled=${props.disabled} 
      ?readonly=${props.readonly} 
      ?multiple=${props.multiple} 
      accept=${props.accept} 
      value=${props.value} 
      max-size=${props['max-size']}
      placeholder=''
      ?bg-gray=${props['bg-gray']}
      ?hide-file-list=${props['hide-file-list']}
      width=${props.width}
      label=${props.label} 
      label-size=${props['label-size']} 
      tooltip=${props.tooltip} 
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint} 
      hint-placement=${props['hint-placement']}
      error-message=${props['error-message']}
      help-text=${props['help-text']}
      success-message=${props['success-message']}
      ?selectable=${props.selectable} 
      ?deletable=${props.deletable} 
      icon-size=${props['icon-size']}
      ?no-border=${props['no-border']}
      ?no-icon=${props['no-icon']}
    >
        <span slot="placeholder">Drag and drop file here or click to upload</span>
    </sc-file-input>
    <script type="text/javascript">
      document.querySelector('#input-init-value').value = [
        { name: 'test1.docx', size: 200, selectable: true, deletable: true },
        { name: 'test2.pdf', size: 10000, selectable: true, deletable: true }
      ];
    </script>
  `;

export const WithInitValue = CustomValue.bind({});
WithInitValue.args = {
  label: 'Label',
  width: '60%',
  multiple: true,
  required: true,
  value: [
    { name: 'test1.docx', size: 200, selectable: true, deletable: true },
    { name: 'test2.pdf', size: 10000, selectable: true, deletable: true },
  ],
};

export const Readonly = CustomValue.bind({});
Readonly.args = {
  label: 'Readonly file input',
  width: '60%',
  multiple: true,
  readonly: true,
};


const ButtonStyleTemplate: Story<ArgTypes> = (props: ArgTypes) => 
html`
  <sc-file-input
    id="file-input-btn-cus-title"
    error-message="${props['error-message']}"
    ?disabled=${props.disabled}
    ?required=${props.required} 
    ?truncate=${props.truncate} 
    ?readonly=${props.readonly} 
    ?multiple=${props.multiple} 
    accept=${props.accept} 
    value=${props.value} 
    max-size=${props['max-size']}
    placeholder=''
    ?bg-gray=${props['bg-gray']}
    ?hide-file-list=${props['hide-file-list']}
    width=${props.width}
    label=${props.label} 
    label-size=${props['label-size']} 
    tooltip=${props.tooltip} 
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint} 
    hint-placement=${props['hint-placement']}
    help-text=${props['help-text']}
    success-message=${props['success-message']}
    ?selectable=${props.selectable} 
    ?deletable=${props.deletable} 
    icon-size=${props['icon-size']}
    ?no-border=${props['no-border']}
    ?no-icon=${props['no-icon']}
    >
    <div slot="add-button">
    ${props['slot[name=\'add-button\']'] || '' }
    </div>
  </sc-file-input>
  <script type="module">
    document.querySelector('#file-input-btn-cus-title').addEventListener('sc-remove', (data) => {
      console.log(data.detail);
    })
  </script>
  `;

export const AddButtonPrimaryWithAccepts = ButtonStyleTemplate.bind({});
AddButtonPrimaryWithAccepts.args = {
  accept: '.docx,.xlsx,.png,.jpg,.jpeg',
  'slot[name=\'add-button\']': html`<sc-button icon="upload" size="sm" fill>Add Files</sc-button>`,
};

export const AddButtonWithErrorMessage = ButtonStyleTemplate.bind({});
AddButtonWithErrorMessage.args = {
  'error-message': 'some error message here',
  'slot[name=\'add-button\']': html`<sc-button icon="upload" size="sm" fill>Add Files</sc-button>`,
};

export const AddButtonWithCustomTitleAndLargeSize = ButtonStyleTemplate.bind({});
AddButtonWithCustomTitleAndLargeSize.args = {
  'slot[name=\'add-button\']': html`<sc-button icon="upload" size=lg">Upload Some Files</sc-button>`,
};

export const AddButtonWithDisabled = ButtonStyleTemplate.bind({});
AddButtonWithDisabled.args = {
  disabled: true,
  'slot[name=\'add-button\']': html`<sc-button disabled icon="upload" size="sm">Add Files</sc-button>`,
};