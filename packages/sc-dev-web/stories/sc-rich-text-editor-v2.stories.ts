import { ScRichTextEditorV2 } from '@scdevkit/webkit-rte/dist/elements/sc-rich-text-editor-v2.js';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormArgTypes } from './utils/FormArg.js';
import { Provider } from './utils/Provider.js';

import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';

if (!customElements.get('sl-dropdown')) {
  customElements.define('sl-dropdown', SlDropdown);
}
if (!customElements.get('sl-menu')) {
  customElements.define('sl-menu', SlMenu);
}
if (!customElements.get('sl-menu-item')) {
  customElements.define('sl-menu-item', SlMenuItem);
}
if (!customElements.get('sl-button')) {
  customElements.define('sl-button', SlButton);
}

type Editor = ScRichTextEditorV2['editorInstance'];
type Revisions = ScRichTextEditorV2['revisions'];


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

const sampleRevisions: Revisions = [
  {
    id: '1',
    dateCreated: '2025-05-01T12:00:00Z',
    authorId: '1574871',
    content:
      '<h2>Lorem ipsum dolor sit amet</h2>, consectetur adipiscing <small>elit</small>. ' +
      '<p> Nullam faucibus, diam sit amet <i>mollis egestas</i>, leo nulla tincidunt purus, ' +
      'sed rutrum turpis ipsum sit amet.',
  },
  {
    id: '2',
    dateCreated: '2025-05-02T12:00:00Z',
    authorId: '2027226',
    content:
      '<h1>Lorem ipsum dolor sit amet</h1>, consectetur adipiscing <strong>elit</strong>. ' +
      '<p> Nullam faucibuss, <u>diam sit amet mollis egestas</u>, leo nulla tincidunt purus, ' +
      'sed rutrum turpis ipsum sit amet.</p>',
  },
];
export default {
  title: 'Components/Text Editor V2',
  component: 'sc-rich-text-editor-v2',
  parameters: {
    docs: {
      description: {
        component: `
Powerful rich text editor. Intuitive WYSIWYG Editor.

## Shortcut support - Out of the box.

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

## Custom toolbar button support
The editor supports custom toolbar buttons. 
You can define an array of custom buttons in the \`customToolbarButtons\` property. 
<br>
The \`customToolbarButtons\` should be an array of \`CustomToolbarButton\` objects. 
Each \`CustomToolbarButton\` object should have an \`icon\`, a \`handler\` function, and a \`hintText\`  property. 
<br>
Example usage of customToolbarButtons property:

\`\`\`
        <sc-rich-text-editor-v2 
          .customToolbarButtons=\${[{
            icon: 'cross',
            handler: (editor: Editor) => {
              editor.resetContent();
              alert('Reset content, this is a custom button');
            },
            hintText: 'Reset content',
          }, {
            icon: 'alert-circle--line',
            handler: (editor: Editor | null) => {
              editor?.notificationManager.open({
                text: 'Custom button clicked!',
                type: 'success',
              });
            },
            hintText: 'Custom button',
          }]}
        >
\`\`\`

The table below shows the properties of the \`CustomToolbarButton\` object:

| Property | Type | Description |
| -------- | ---- | ----------- |
| icon | string | The icon to display in the button. |
| handler | function | The function to call when the button is clicked. The function receives the TinyMCE editor instance as a parameter. \mExample: \` (editor: Editor) => { /* insert javascript code */ } \`|
| hintText | string | The text to display as a tooltip when hovering over the button. |

## Configuration
The editor can be configured using the \`ext-config\` property. But not all can be overridden from the defaults. 
See [TinyMCE init config properties](https://www.tiny.cloud/docs/tinymce/6/initial-configuration/).

### Custom Configuration
There are also added custom configuration options.

| Option | Type | Default | Description |
|---|---|---|---|
| \`sc_paste_keep_all_nbsp\` | \`boolean\` | \`false\` | Master override. When \`true\`, disables **all** \`&nbsp;\` removal processing. Skips the other paste-keep-* options. Use when you need to preserve every non-breaking space from the pasted content. |
| \`sc_paste_keep_span_nbsp\` | \`boolean\` | \`false\` | When \`true\`, preserves \`&nbsp;\` inside **nested span structures** (e.g. \`<span ...><span>text&nbsp;</span></span>\`). By default these trailing \`&nbsp;\` characters are stripped, as they commonly cause unwanted visual dots when pasting from Word/Outlook. |
| \`sc_paste_keep_span_text_nbsp\` | \`boolean\` | \`false\` | When \`true\`, preserves \`&nbsp;\` inside **single span elements** (e.g. \`<span>text&nbsp;</span>\`). By default one or more trailing \`&nbsp;\` at the end of a span's text content are removed. |
| \`sc_paste_keep_consecutive_nbsp\` | \`boolean\` | \`false\` | When \`true\`, preserves **multiple consecutive \`&nbsp;\`** sequences. By default two or more consecutive \`&nbsp;\` (optionally separated by whitespace) are collapsed into a single regular space, preventing runs of extra dots or unwanted spacing gaps from Office pastes. |
| <s>objAlign</s> | \`"inline" | "parent"\`  | \`"inline"\` | **Deprecated** - use \`sc_process_object_align\` instead. Specifies object alignment |
| \`sc_process_object_align\` | \`"inline" | "parent"\` | \`"inline"\` | Specifies object alignment. Default \`"inline"\` applies inline styles to align. Set to \`"parent"\` to set align style on it's parent. |
        `,
      },
      source: {
        language: 'html',
        transform: (code: string, { args: props }: { args: ArgTypes }) => {
          const values = (
            [
              'value',
              'revisions',
              'ext-config',
              'valid-styles',
              'customToolbarButtons',
              'success-message',
              'error-message',
              'valid-styles',
              'toolbar',
            ] as (keyof ArgTypes)[]
          )
            .map(key => {
              if (props[key] !== undefined) {
                return `.${key}=\${${JSON.stringify(props[key], null, 2)}}`;
              }
            })
            .filter(Boolean);
          return code.replace(
            /(<sc-rich-text-editor-v2[^>]*)>/,
            ['$1', ...values, '>'].join('\n')
          );
        },
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
    format: 'html',
    'default-format': [],
    'enable-fullscreen': false,
    'scrollbar-size': 'sm',
    'scrollbar-opaque': false,
    'scrollbar-always-visible': false,
  },
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'inline-radio',
      options: ['html', 'md'],
      description: 'Sets the preferred format.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'html' },
        category: 'Attributes',
      },
    },
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
      control: 'object',
      description: 'Sets the input field value (raw HTML)',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    shortcut: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'max-length': {
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: undefined },
        category: 'Attributes',
      },
    },
    'disable-spellcheck': {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-fullscreen': {
      control: 'boolean',
      description: 'Enables the fullscreen mode for the editor',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'scrollbar-size': {
      control: 'inline-radio',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Adjusts the thickness of the scrollbar.',
      table: {
        type: { summary: '"xs" | "sm" | "default" | "lg" | "xl"' },
        defaultValue: { summary: 'sm' },
        category: 'Scrollbar',
      },
    },
    'scrollbar-opaque': {
      control: 'boolean',
      description: 'Makes the scrollbar background not transparent.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Scrollbar',
      },
    },
    'scrollbar-always-visible': {
      control: 'boolean',
      description: 'Always show the scrollbar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Scrollbar',
      },
    },
    disabled: {
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
    revisions: {
      control: 'array',
      description: 'Revision history entries for the editor',
      table: {
        type: { summary: 'array' },
        defaultValue: {
          summary: 'object',
        },
        category: 'Attributes',
      },
    },
    'ext-config': {
      control: 'object',
      description:
        'External configuration for the editor. This is based on TinyMCE init config properties',
      table: {
        type: { summary: 'object' },
        defaultValue: {
          summary: 'object',
        },
        category: 'Attributes',
      },
    },
    'valid-styles': {
      control: 'object',
      description:
        'Map of elements & allowed css styles for it. See [https://www.tiny.cloud/docs/tinymce/6/content-filtering/#valid_styles](https://www.tiny.cloud/docs/tinymce/6/content-filtering/#valid_styles)',
      table: {
        type: { summary: 'object' },
        defaultValue: {
          summary: 'object',
        },
        category: 'Attributes',
      },
    },
    customToolbarButtons: {
      control: 'object',
      description: `Array of custom toolbar button definitions. 
      Each object should have an icon, handler, and command. 
      The handler receives a paremeter 'editor' which is the TinyMCE editor instance.`,
      table: {
        type: { summary: 'CustomToolbarButton[]' },
        defaultValue: {
          summary: '[]',
        },
        category: 'Attributes',
      },
    },
    'default-format': {
      control: 'array',
      description: `Applies a set of formats when a new block or table is inserted. The formats
      are only applied if the element is empty and has no similar or conflicting styles.`,
      table: {
        type: { summary: 'string[]' },
        defaultValue: { 
          summary: 'string[]',
          // eslint-disable-next-line max-len
          detail: `bold
            italic
            underline
            strikethrough
            superscript
            subscript
            alignleft
            aligncenter
            alignright
            alignjustify
            forecolor:#3366FF
            backcolor:#FFAA80`.replace(/^\s{2,}/gm, ''),
        },
        category: 'Attributes',
      },
    },
    'sc-change': {
      description:
        'Emitted when the content changed. Get the state by event.detail.text.',
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
  render?: (args: T) => ReturnType<typeof html>;
}

interface ArgTypes extends FormArgTypes {
  id?: string;
  toolbar?: string[];
  'show-count': boolean;
  shortcut: boolean;
  'max-length': number;
  'disable-spellcheck': boolean;
  'enable-fullscreen': boolean;
  'valid-styles': Record<string, string>;
  revisions: Revisions;
  'ext-config'?: ScRichTextEditorV2['extConfig'];
  'default-format'?: string[],
  customToolbarButtons?: ScRichTextEditorV2['customToolbarButtons'];
  'scrollbar-size': 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  'scrollbar-opaque': boolean;
  'scrollbar-always-visible': boolean;
  format?: 'html' | 'md',
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return Provider(html`
    <sc-rich-text-editor-v2
      .value=${props.value || ''}
      id=${ifDefined(props.id)}
      .toolbar=${props.toolbar as any}
      ?error=${props.error} 
      .errorMessage=${props['error-message']}
      ?success=${props.success}
      .successMessage=${props['success-message']}  
      ?show-count=${props['show-count']}
      ?shortcut=${props['shortcut']}
        ?disabled=${props['disabled']}
      ?readonly=${props['readonly']}
      .revisions=${props.revisions || []}
      .extConfig=${props['ext-config']}
      max-length=${props['max-length']}
      ?disable-spellcheck=${props['disable-spellcheck']}
      label=${ifDefined(props['label'])} 
      tooltip=${ifDefined(props['tooltip'])}
      hint=${ifDefined(props['hint'])}
      .validStyles=${props['valid-styles']}
      .customToolbarButtons=${props['customToolbarButtons'] || []}
      ?enable-fullscreen=${props['enable-fullscreen']}
      scrollbar-size=${props['scrollbar-size']}
      ?scrollbar-opaque=${props['scrollbar-opaque']}
      ?scrollbar-always-visible=${props['scrollbar-always-visible']}
      default-format=${ifDefined(props['default-format']?.length ? props['default-format'].join('; ') : undefined)}
      format=${ifDefined(props['format'] !== 'html' ? props['format'] : undefined)}
    >
    </sc-rich-text-editor-v2>
  `);
};

export const Default = Template.bind({});
Default.args = {
};

export const LessToolbar = Template.bind({});
LessToolbar.args = {
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

export const NoToolbar = Template.bind({});
NoToolbar.args = {
  toolbar: undefined,
};

export const Shortcut = Template.bind({});
Shortcut.args = {
  shortcut: true,
};

export const MaxLength = Template.bind({});
MaxLength.args = {
  'max-length': 20,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Readonly = Template.bind({});
Readonly.args = {
  value: 'some text.',
  readonly: true,
};

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
      <sc-rich-text-editor-v2
        .value=${props.value}
        .toolbar=${['undo', 'redo', 'insertimage'] as any}
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
      </sc-rich-text-editor-v2>
    `;
  },
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  error: true,
  'error-message': 'Test Error 123123',
};

export const SuccessMessage = Template.bind({});
SuccessMessage.args = {
  success: true,
  'success-message': 'Test Success 123123',
};

export const RevisionHistory = Template.bind({});
RevisionHistory.args = {
  toolbar: [
    'undo',
    'redo',
    'revisionhistory',
  ],
  value: 'Lorererererere ipsum dolor sit ametsdsd, consectetur adipiscing elit. ' +
  'Nullam faucibusseses, diam sit amet mollis egestas, leo nulla Incident purus, ' +
  'sed rutrum turpis ipsum sit amet.',
  revisions: sampleRevisions,
};

export const CustomHeight = Template.bind({});
CustomHeight.args = {
  'ext-config': {
    height: '300px',
  },
};

export const ExternalConfig = Template.bind({});
ExternalConfig.args = {
  'ext-config': {
    height: '10em',
    width: 200,
  },
};

export const DisableSpellcheck = Template.bind({});
DisableSpellcheck.args = {
  'disable-spellcheck': true,
};

export const CustomToolbarButtons = Template.bind({});
CustomToolbarButtons.args = {
  toolbar: ['redo', 'undo'],
  customToolbarButtons: [
    {
      icon: 'cross',
      handler: (editor: Editor | null) => {
        editor?.resetContent();
        alert('Reset content, this is a custom button');
      },
      hintText: 'Clear content of the editor',
    },
    {
      icon: 'alert-circle--line',
      handler: (editor: Editor | null) => {
        editor?.notificationManager.open({
          text: 'Custom button clicked!',
          type: 'success',
        });
      },
      hintText: 'Display Success Toast',
    },
  ],
};

export const DefaultFormat = Template.bind({});
DefaultFormat.args = {
  toolbar: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'subscript',
    'superscript',
    'backcolor',
    'forecolor',
    'clear',
    'alignleft',
    'aligncenter',
    'alignright',
    'orderedlist',
    'unorderedlist',
    'quote',
    'table',
  ],
  'default-format': ['bold', 'italic', 'underline', 'backcolor:#D9D9D9', 'forecolor:#E00A15', 'aligncenter'],
};

export const AskAIToolbars = Template.bind({});

AskAIToolbars.args = {
  toolbar: [
    'undo',
    'redo',
    'separate',
    'askai',
    'aishortcuts',
    'separate',
    'fontstyle',
    'separate',
    'copy',
    'paste',
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
    'addlink',
    'insertimage',
    'unlink',
    'quote',
  ],
};

export const CopyPaste = Template.bind({});
CopyPaste.args = {
  toolbar: [
    'undo',
    'redo',
    'separate',
    'fontstyle',
    'separate',
    'copy',
    'paste',
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
  ],
  value: 'Try selecting text and using the copy/paste buttons in the toolbar!',
};

export const EnableFullscreen = Template.bind({});
EnableFullscreen.args = {
  'enable-fullscreen': true,
};

export const Scrollbar = Template.bind({});
Scrollbar.args = {
  value: `
    <p>Scrollbar configurations:</p>
    <ul>
      <li><strong>scrollbar-size:</strong> Adjusts the thickness of the scrollbar.</li>
      <li><strong>scrollbar-opaque:</strong> Default is <code>false</code>. When <code>true</code>, adds a light grey background to the scrollbar track.</li>
      <li><strong>scrollbar-always-visible:</strong> Default is <code>false</code>. When <code>true</code>, the scrollbar stays visible all the time. Otherwise, it automatically hides.</li>
    </ul>
    <p>Keep scrolling to test the interaction...</p>
    <p></p>
    ${Array(10)
      .fill(
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>'
      )
      .join('')}
    `,
  'ext-config': { height: '200px' },
  'scrollbar-size': 'sm',
  'scrollbar-opaque': false,
  'scrollbar-always-visible': false,
};

export const Markdown = {
  render: (props: ArgTypes) => {
    return html`
      <div style="display:flex;gap:1rem">
      <textarea
        id="markdown-input"
        style="width:30%;max-height:96%;padding:0.5rem;font-family:monospace;font-size:0.75rem;outline:none"
        label="Raw Markdown"
        .value=${props.value}
        multiline></textarea>
      ${Template({ ...props, id: 'markdown-editor' })}
      <style> #markdown-input + * { width: 70%; } </style>
    </div>
    <script>
      const input = document.querySelector('#markdown-input');
      const rte = document.querySelector('#markdown-editor');
      rte.addEventListener('sc-change', (e) => {
        if (document.activeElement !== input)
          input.value = e.detail.md;
      });

      input.addEventListener('input', () => {
        if (document.activeElement === input)
          rte.value = input.value;
      });
    </script>
    `;
  },
  args: {
    format: 'md',
    value: `# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Paragraph

| Table Data 1 | Table Data 2 | Table Data 3 |
| --- | --- | --- |  
| Table Data 4 | Table Data 5 | Table Data 6 |`,
  },
} as Story<ArgTypes>;