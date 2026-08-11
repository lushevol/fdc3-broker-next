import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
// eslint-disable-next-line import/extensions
import '@scdevkit/docviewer/elements';
export default {
  title: 'Viewer/Document Viewer',
  component: 'sc-doc-viewer',
  parameters: {
    docs: {
      description: {
        component:
          'For more information please refer to [Documentation](https://confluence.global.standardchartered.com/display/APPPLAT/Universal+document+viewer).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      control: 'object',
      description: 'Set a File object',
      table: {
        type: { summary: 'object' },
        category: 'Properties',
      },
    },
    dataSource: {
      control: 'object',
      description: 'Array of scribble data sources for annotations',
      table: {
        type: { summary: '[]' },
        category: 'Properties',
      },
    },
    editable: {
      control: 'boolean',
      description:
        'Controls whether the component allows editing for textTypes files. When true, component opens in edit mode by default. When false or undefined, component opens in read-only mode. ',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Attributes',
      },
    },
    'page-number': {
      control: 'number',
      description: 'Current page number (PDF only for now)',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    toolConfig: {
      control: 'object',
      description: 'Toolbar configuration for the component.',
      table: {
        type: {
          summary: `{
            inputDelay: number,
            blurAction: 'set' | 'reset' | 'none',
            strictLimits: boolean,
            rotateScope: 'all' | 'page',
          }`.replace('          ', ''),
        },
        defaultValue: {},
        category: 'Properties',
      },
    },
    'sc-scribble-change': {
      description: 'Emitted when scribble data source changes',
      table: {
        type: { summary: 'CustomEvent<{ dataSource: ScribbleDataSource[] }>' },
        category: 'Events',
      },
    },
    'sc-doc-mode-changed': {
      description:
        'Emitted when document mode changes (e.g., from view to edit mode)',
      table: {
        type: {
          summary: 'CustomEvent<{ previousMode: string, currentMode: string }>',
        },
        category: 'Events',
      },
    },
    'sc-doc-save': {
      description: 'Emitted when document is saved',
      table: {
        type: {
          summary:
            'CustomEvent<{ content: string, fileName: string, fileType: string, method: string }>',
        },
        category: 'Events',
      },
    },
    'sc-doc-loaded': {
      description: 'Emitted when document has completed loading',
      table: {
        type: {
          summary: 'CustomEvent',
        },
        category: 'Events',
      },
    },
    'sc-page-change': {
      description: 'Emitted when navigating through the pages (PDF only for now)',
      table: {
        type: {
          summary: 'CustomEvent<{ page: number, pageSize: number }>',
        },
        category: 'Events',
      },
    },
  },
};
interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}
type ArgTypes = Record<string, any>;
const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <div style="height: 500px;">
      <sc-doc-viewer
        .editable=${props.editable} 
        .dataSource=${props.dataSource} 
        page-number=${ifDefined(props['page-number'])}
        .toolConfig=${props.toolConfig}
      ></sc-doc-viewer>
    </div>
    <sc-file-input> </sc-file-input>
    <script type="module">
      const docviewer = document.querySelector('sc-doc-viewer');
      const fileInput = document.querySelector('sc-file-input');
      fileInput.addEventListener('sc-change', e => {
        const file = e.detail.value;
        docviewer.file = file[0];
      });
    </script>
  `;
};
export const Default = Template.bind({});
Default.args = {
  editable: false,
};
