import { html, TemplateResult } from 'lit';

const toolbar = [
  'undo',
  'redo',
  'separate',
  'fontstyle',
  'separate',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'separate',
  'alignleft',
  'aligncenter',
  'alignright',
  'orderedlist',
  'unorderedlist',
  'outdent',
  'indent',
  'separate',
  'insertimage',
  'addlink',
  'unlink',
  'quote',
  'table',
];
export default {
  title: 'Components/Text Editor',
  component: 'sc-rich-text-editor',
  parameters: {
    docs: {
      description: {
        component: `
Powerful rich text editor. Intuitive WYSIWYG Editor.
(Available from 1.3.0)

**Shortcut support - Out of the box.**

| action | window | mac |
| ------ | --- |
| tab | tab | tab |
| undo | ctrl + z | cmd + z |
| redo | ctrl + y| cmd + shift + z |
| bold | ctrl + b | cmd + b |
| italic | ctrl + i | cmd + i |
| underline | ctrl + u | cmd + u |
| strike through | ctrl + shift + s | cmd + shift + s |
| blockquote | ctrl + shift + q | cmd + shift + q |
| remove format | ctrl + \\ | cmd + \\ |
| justify left | ctrl + shift + l| cmd + shift + l |
| justify center | ctrl + shift + e | cmd + shift + e |
| justify right | ctrl + shift + r | cmd + shift + r |
| unordered list | ctrl + shift + 7 | cmd + shift + 7 |
| ordered list | ctrl + shift + 8| cmd + shift + 8 |
| outdent | ctrl + [ | cmd + [ |
| indent | ctrl + ] | cmd + ] |
| paragraph | ctrl + 0 | cmd + 0 |
| heading 1 | ctrl + 1 | cmd + 1 |
| heading 2 | ctrl + 2 | cmd + 2 |
| heading 3 | ctrl + 3 | cmd + 3 |
| heading 4 | ctrl + 4 | cmd + 4 |
| heading 5 | ctrl + 5 | cmd + 5 |
| heading 6 | ctrl + 6 | cmd + 6 |
| superscript | ctrl + shift + up arrow | cmd + shift + up arrow |
| subscript | ctrl + shift + down arrow | cmd + shift + down arrow |
| insert image | ctrl + shift + m | cmd + shift + m |



        `,
      },
    },
  },
  args: {
    toolbar,
    value: '',
    // 'max-length': 100,
    // 'show-count': false,
    shortcut: false,
    readonly: false,
  },
  tags: ['autodocs'],
  argTypes: {
    toolbar: {
      control: 'array',
      description: 'Control toolbar of Text Editor',
      table: {
        type: { summary: 'array' },
        defaultValue: {
          summary: 'array',
          detail: `[${toolbar.map(_ => `'${_}'`).toString()}]`,
        },
        category: 'Attributes',
      },
    },
    value: {
      control: 'text',
      description: 'Pass context to Text Editor',
      table: {
        category: 'Attributes',
      },
    },
    // 'show-count': {
    //   control: 'boolean',
    //   table: {
    //     type: { summary: 'boolean' },
    //     defaultValue: { summary: false },
    //     category: 'Attributes',
    //   },
    // },
    shortcut: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    readonly: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    // 'max-length': {
    //   control: 'number',
    //   table: {
    //     type: { summary: 'number' },
    //     defaultValue: { summary: 'number' },
    //     category: 'Attributes',
    //   },
    // },
    'sc-change': {
      description:
        'Emitted when the content chagned. Get the state by event.detail.text.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  toolbar?: string[];
  value: string;
  'show-count': boolean;
  shortcut: boolean;
  readonly: boolean;
  'max-length': number;
  'pre-tag'?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-rich-text-editor
      value=${props.value}
      .toolbar=${props.toolbar as any}
      ?show-count=${props['show-count']}
      ?shortcut=${props['shortcut']}
      ?readonly=${props['readonly']}
      .preTag=${props['pre-tag']}
    >
    </sc-rich-text-editor>
    <script>
      const toobar = [${props.toolbar?.map(_ => `'${_}'`)?.toString()}];
    </script>
  `;
};

export const Default = Template.bind({});
Default.args = {};

export const CustomizeToolbar = Template.bind({});
CustomizeToolbar.args = {
  toolbar: [
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'bold',
    'italic',
  ],
};
export const Shortcut = Template.bind({});
Shortcut.args = {
  shortcut: true,
  'pre-tag': true,
};
export const Readonly = Template.bind({});
Readonly.args = {
  value: 'some text.',
  readonly: true,
};

/**
 * The ImageAttachment story is a story that demonstrates how to use the sc-rich-text-editor component.
 */
export const ImageAttachment = {
  args: {
    value: '<b>bold text</b> and normal text',
  },
  render: (props: ArgTypes) => {
    const handleInput = (e: Event) => {
      console.log({ e });
      console.log((e as CustomEvent).detail.text);
    };
    return html`
      <sc-rich-text-editor
        value=${props.value}
        .toolbar=${props.toolbar as any}
        ?show-count=${props['show-count']}
        ?shortcut=${props['shortcut']}
        ?readonly=${props['readonly']}
        max-length=${props['max-length']}
        @sc-change=${handleInput}
        .configuration=${{
    toolbar: {
      maxImageSize: 2048,
    },
  }}
      >
      </sc-rich-text-editor>
    `;
  },
};
