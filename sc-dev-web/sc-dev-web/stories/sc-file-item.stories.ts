import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/File/File Item',
  component: 'sc-file-item',
  parameters: {
    docs: {
      description: {
        component:
          'File item shows information such as file type, size and icon for a given file.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'file-id': {
      control: 'text',
      description: 'Unique File id. And it will add the same class to the component',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    name: {
      control: 'text',
      description: 'File name with extension.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'icon-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'default'],
      description: 'The size of the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },    
    width: {
      control: 'text',
      description: 'Sets the preferred width.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'max-content' },
        category: 'Attributes',
      },
    },    
    size: {
      control: 'number',
      description: 'File size (in byte).',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'progress-size': {
      control: 'number',
      description: `Sets the size (in byte) processed. 
        For example, to show 50% progress for file of size 100KB, set the progress-size to 50KB.`,
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      }, 
      if: { arg: 'size', neq: 0 },
    },
    'progress-text': {
      control: 'text',
      description: 'Prefix label to be prepended to the progress information.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'size', neq: 0 },
    },
    'progress-type': {
      control: 'inline-radio',
      options: ['success', 'warning', 'error'],
      description: 'Sets the type of the progress bar.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
        defaultValue: { summary: 'success' },
      },
      if: { arg: 'size', neq: 0 },
    },
    extra: {
      control: 'text',
      description: 'Sets the extra text of the file.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    status: {
      control: 'inline-radio',
      options: ['default', 'uploading', 'error'],
      description: 'Sets the status of the file.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
        defaultValue: { summary: 'default' },
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
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-select': {
      description: `Emitted when select the file name. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and
      get interacted element by event.detail.target.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-remove': {
      description: `Emitted when click on the delete icon. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and
      get interacted element by event.detail.target.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-cancel': {
      description: `Emitted when click on the cancel icon only in uploading status. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and
      get interacted element by event.detail.target.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-loaded': {
      description: `Emitted when the status change. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and
      get interacted element by event.detail.target.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    'file-id': '',
    name: '',
    'icon-size': 'default',
    width: 'max-content',
    size: 0,
    'progress-size': 0,
    'progress-text': '',
    'progress-type': 'success',
    extra: '',
    status: 'default',
    'no-icon': false,
    'no-border': false,
    selectable: false,
    deletable: false,
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'file-id'?: string;
  name: string;
  'icon-size': string;
  width: string;
  size: number;
  'progress-size'?: number;
  'progress-text'?: string;
  'progress-type'?: string;
  extra?: string,
  status?: string,
  'no-icon'?: boolean;
  'no-border'?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  slot: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-file-item
    file-id="test-file-item-1" 
    name=${props.name} 
    icon-size=${props['icon-size']}
    width=${props.width}
    size=${props.size} 
    progress-size=${props['progress-size']}
    progress-text=${props['progress-text']}
    progress-type=${props['progress-type']}
    extra=${props['extra']}
    status=${props['status']}
    ?no-icon=${props['no-icon']}
    ?no-border=${props['no-border']}
    ?selectable=${props.selectable} 
    ?deletable=${props.deletable}    
  > 
    ${props.slot}
  </sc-file-item>
`;

export const Default = Template.bind({});
Default.args = {
  'file-id': 'test-file-item-2',
  name: 'ArchitectureDesign.doc',
  size: 4000,
};

export const Selectable = Template.bind({});
Selectable.args = {
  'file-id': 'test-file-item-3',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  selectable: true,
};

export const Deletable = Template.bind({});
Deletable.args = {
  'file-id': 'test-file-item-4',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  deletable: true,
};

export const Progress = Template.bind({});
Progress.args = {
  'file-id': 'test-file-item-5',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  'progress-size': 2000,
  'progress-text': 'Progress info:',
};

export const StatusLoading = Template.bind({});
StatusLoading.args = {
  'file-id': 'test-file-item-6',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  status: 'uploading',
};

export const StatusError = Template.bind({});
StatusError.args = {
  'file-id': 'test-file-item-7',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  status: 'error',
};


export const Extra = Template.bind({});
Extra.args = {
  'file-id': 'test-file-item-8',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  extra: 'Hint text here',
};

export const ExtraOnError = Template.bind({});
ExtraOnError.args = {
  'file-id': 'test-file-item-9',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  extra: 'Something went wrong!',
  status: 'error',
};

export const NoBorder = Template.bind({});
NoBorder.args = {
  'file-id': 'test-file-item-10',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  'no-border': true,
};

export const OnlyText = Template.bind({});
OnlyText.args = {
  'file-id': 'test-file-item-11',
  name: 'ArchitectureDesign.doc',
  size: 4000,
  'no-border': true,
  'no-icon': true,
};

export const Customize = Template.bind({});
Customize.args = {
  'file-id': 'test-file-item-12',
  name: 'ArchitectureDesign.doc',
  slot: html`
    <div style="margin:10px 0">
      <div style="margin-bottom:5px;font-size:12px;color:#A8A9AA;">
        Last reviewed By: Peter Parker
      </div>
      <div style="margin-bottom:5px;font-size:12px;color:#A8A9AA;">
        Last reviewed Date: 23 Jan 2024
      </div>
    </div>
  `,
};
