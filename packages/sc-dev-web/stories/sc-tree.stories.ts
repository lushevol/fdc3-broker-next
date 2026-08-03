import { html, TemplateResult } from 'lit';
import { MainIconLibrary } from '@scdevkit/icons';
import { handleCustomEvent } from '../src/shared/util.js';

export default {
  title: 'Components/Tree',
  component: 'sc-tree',
  parameters: {
    docs: {
      description: {
        component: `
Trees allow you to display a hierarchical list of selectable tree items. Items with children can be expanded and collapsed as desired by the user

-----

| Name | Type | Description | Optional | Default |
| ---- | ---- | ----------- | -------- | ------- |
| value | string | The unique identifier for the tree node | no | - |
| label | string OR (context: LabelRenderContext) => string | A string or function to use when extracting the value for the tree node | no | - |
| expanded | boolean | Expand the current tree node to display its child nodes.  | yes | false |
| selected | boolean | The current node selected or not | yes | false |
| disabled | boolean | The current node is active or not | yes | false |
| prefixIcon | string | Allow tree node to show the prefix icon | yes | '' |
| children | array | child node list  | yes | [] |
| hasChildren | boolean | Enable or disable get the children info from API | yes | false |
| draggable | boolean | Enable drag and drop reordering of nodes | yes | false |
| actionRenderer | (context: ActionsContext) => TemplateResult\\\|string | Per-node action buttons rendered flush-right, revealed on hover | yes | undefined |
| show-actions | 'hover' \\\| 'always' | When to reveal per-node action buttons | yes | 'hover' |

`,
        story: `Click **[Show code]** button to check more details.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selection: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      description: 'Sets the tree view select mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'single' },
        category: 'Attributes',
      },
    },
    selected: {
      control: 'text',
      description: 'Set the default selected tree node for single mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'selection', eq: 'single' }, 
    },
    'show-indent-lines': {
      control: 'boolean',
      description: 'Sets whether tree should show in indent line or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    data: {
      control: 'array',
      description: 'Set to render virtual tree list.',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: [] },
        category: 'Properties',
      },
    },
    selectedItems: {
      control: 'array',
      description: 'Set the default selected tree node for multiple mode.',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: [] },
        category: 'Properties',
      },
      if: { arg: 'selection', eq: 'multiple' }, 
    },
    actionRenderer: {
      description:
        'Function `(context: ActionsContext) => TemplateResult | string` — called once per node. ' +
        'Returns the Lit template to render inside the row\'s action area (flush-right). ' +
        '`ActionsContext` exposes `{ currentNode, parentNode, tree }`.',
      table: {
        type: { summary: 'Function' },
        defaultValue: { summary: 'undefined' },
        category: 'Properties',
      },
    },
    'show-actions': {
      control: 'inline-radio',
      options: ['hover', 'always'],
      description: 'Controls when per-node action buttons are visible. ' +
        '`hover` — revealed only on row hover/focus-within. ' +
        '`always` — always visible.',
      table: {
        type: { summary: '\'hover\' | \'always\'' },
        defaultValue: { summary: 'hover' },
        category: 'Attributes',
      },
    },
    loadChildren: {
      description: 'Emitted when expand the parent tree node to get more children nodes.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-select': {
      description: 'Emitted when select the tree node. Get the selected value by event.detail.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    draggable: {
      control: 'boolean',
      description: 'Enable drag and drop reordering of tree nodes.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'sc-drop': {
      description: 'Emitted on a successful drop. ' +
        'Detail: `{ sourceValue, targetValue, position: "before"|"inside"|"after", data }`.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-edit-save': {
      description:
        'Emitted when the user confirms an inline edit (Enter or blur). ' +
        'Detail: `{ currentNode, newLabel, cancel() }`. ' +
        'Call `cancel()` to abort the save — the input stays open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-edit-cancel': {
      description:
        'Emitted when the user cancels an inline edit (Escape or empty label). ' +
        'Detail: `{ value }`.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    data: [],
    selection: 'single',
    selected: '',
    selectedItems: [],
    'show-indent-lines': false,
    draggable: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

interface TreeItem {
  value: string;
  label: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: TreeItem[];
  prefixIcon?: string;
  hasChildren?: boolean;
}

interface ArgTypes {
  selection?: string;
  selected?: string;
  selectedItems?: any[];
  'show-indent-lines'?: boolean;
  draggable?: boolean;
  loadChildren?: boolean;
  refresh?: boolean;
  data: TreeItem[];
}

const defaultTreeWithIcon = [
  {
    value: '1',
    label: 'label 1',
    prefixIcon: 'folder--line',
    expanded: true,
    children: [
      {
        value: '1-1',
        label: 'label 1-1',
        prefixIcon: 'file-text--line',
      },
      {
        value: '1-2',
        label: 'label 1-2',
        prefixIcon: 'file-text--line',
      },
    ],
  },
  {
    value: '2',
    label: 'label 2',
    prefixIcon: 'folder--line',
    expanded: false,
    children: [
      {
        value: '2-1',
        label: 'label 2-1',
        prefixIcon: 'file-text--line',
      },
      {
        value: '2-2',
        label: 'label 2-2',
        prefixIcon: 'file-text--line',
      },
    ],
  },
];
const defaultTreeWithoutIcon = [
  {
    value: '1',
    label: 'label 1',
    expanded: true,
    children: [
      {
        value: '1-1',
        label: 'label 1-1',
      },
      {
        value: '1-2',
        label: 'label 1-2',
      },
    ],
  },
  {
    value: '2',
    label: 'label 2',
    expanded: false,
    children: [
      {
        value: '2-1',
        label: 'label 2-1',
        children: [
            {
              value: '2-1-1',
              label: 'label 2-1-1',
            },
            {
              value: '2-2-2',
              label: 'label 2-2-2',
            },
          ],
      },
      {
        value: '2-2',
        label: 'label 2-2',
      },
    ],
  },
];

const hasDisabledNode  = [
    {
      value: '1',
      label: 'label 1',
      expanded: true,
      children: [
        {
          value: '1-1',
          label: 'label 1-1',
        },
        {
          value: '1-2',
          label: 'label 1-2',
        },
      ],
    },
    {
      value: '2',
      label: 'label 2',
      expanded: false,
      children: [
        {
          value: '2-1',
          label: 'label 2-1',
          children: [
              {
                value: '2-1-1',
                disabled: true,
                label: 'label 2-1-1',
              },
              {
                value: '2-2-2',
                label: 'label 2-2-2',
              },
            ],
        },
        {
          value: '2-2',
          disabled: true,
          label: 'label 2-2',
        },
      ],
    },
  ];

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const data = JSON.stringify(props.data);

  const onSelect = (e: CustomEvent) => {
    console.log('[sc-select]', (e as any).detail);
  };

  const onDrop = (e: CustomEvent) => {
    console.log('[sc-drop]', (e as any).detail);
  };

  return html`
    <sc-icon-provider .iconLibraries=${[MainIconLibrary]}
      ><div>
        <sc-tree
          .data="${props.data}"
          .selection="${props.selection}"
          .selected="${props.selected}"
          ?show-indent-lines="${props['show-indent-lines']}"
          ?draggable="${props.draggable}"
          @sc-select="${onSelect}"
          @sc-drop="${onDrop}"
        >
        </sc-tree>
      </div>
    </sc-icon-provider>

    <br></br>
    <br></br>
    <script type="module">
      const virtualData = ${data};
      const scTree = document.querySelector('sc-tree');
      scTree.addEventListener('sc-select', function(e) {
        console.log('[sc-select]', e.detail);
      });
      scTree.addEventListener('sc-drop', function(e) {
        console.log('[sc-drop]', e.detail);
      });
    </script>
  `;
};

const MultipleTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  const data = JSON.stringify(props.data);
  return html`
    <sc-icon-provider .iconLibraries=${[MainIconLibrary]}
      ><div>
        <sc-tree
          .data="${props.data}"
          .selection="${props.selection}"
          .selectedItems="${props.selectedItems}"
          @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
        >
        </sc-tree>
      </div>
    </sc-icon-provider>

    <br></br>
    <br></br>
    <script type="module">
      const virtualData = ${data};
      /**
      *  scTree.data = virtualData;
      */
    </script>

  `;
};

export const Default = Template.bind({});

Default.args = {
  selection: 'single',
  selected: '',
  data: defaultTreeWithoutIcon,
};

export const DefaultSelected = Template.bind({});

DefaultSelected.args = {
  selection: 'single',
  selected: '1-1',
  data: defaultTreeWithoutIcon,
};

export const MultipleTree = Template.bind({});

MultipleTree.args = {
  selection: 'multiple',
  selected: '',
  data: defaultTreeWithoutIcon,
};

export const MultipleSelectedTree = MultipleTemplate.bind({});

MultipleSelectedTree.args = {
  selection: 'multiple',
  selectedItems: ['1-1', '2-1'],
  data: defaultTreeWithoutIcon,
};

export const WithIcon = Template.bind({});

WithIcon.args = {
  selection: 'single',
  selected: '',
  data: defaultTreeWithIcon,
};

export const WithoutIcon = Template.bind({});

WithoutIcon.args = {
  selection: 'single',
  selected: '',
  data: defaultTreeWithoutIcon,
};


export const WithIndentLines = Template.bind({});

WithIndentLines.args = {
  selection: 'single',
  'show-indent-lines': true,
  data: defaultTreeWithoutIcon,
};

export const WithoutIndentLines = Template.bind({});

WithoutIndentLines.args = {
  selection: 'single',
  'show-indent-lines': false,
  data: defaultTreeWithoutIcon,
};


export const DisableSomeTreeNode = Template.bind({});

DisableSomeTreeNode.args = {
  selection: 'multiple',
  'show-indent-lines': false,
  data: hasDisabledNode,
};

// ── Drag & Drop ───────────────────────────────────────────────────────────────

const dragDropData = [
  {
    value: 'root-1', label: 'Documents', prefixIcon: 'folder--line', expanded: true,
    children: [
      {
        value: 'doc-reports', label: 'Reports', prefixIcon: 'folder--line', expanded: true,
        children: [
          { value: 'doc-1', label: 'Q1-Report.pdf', prefixIcon: 'file-text--line' },
          { value: 'doc-2', label: 'Q2-Report.pdf', prefixIcon: 'file-text--line' },
          { value: 'doc-3', label: 'Q3-Report.pdf', prefixIcon: 'file-text--line' },
        ],
      },
      {
        value: 'doc-finance', label: 'Finance', prefixIcon: 'folder--line', expanded: false,
        children: [
          { value: 'fin-1', label: 'Budget.xlsx', prefixIcon: 'file-text--line' },
          { value: 'fin-2', label: 'Forecast.xlsx', prefixIcon: 'file-text--line' },
        ],
      },
      { value: 'doc-notes', label: 'Notes.txt', prefixIcon: 'file-text--line' },
    ],
  },
  {
    value: 'root-2', label: 'Images', prefixIcon: 'folder--line', expanded: true,
    children: [
      {
        value: 'img-photos', label: 'Photos', prefixIcon: 'folder--line', expanded: true,
        children: [
          { value: 'img-1', label: 'Vacation.png', prefixIcon: 'file-text--line' },
          { value: 'img-2', label: 'Profile.jpg', prefixIcon: 'file-text--line' },
        ],
      },
      {
        value: 'img-design', label: 'Design', prefixIcon: 'folder--line', expanded: false,
        children: [
          { value: 'des-1', label: 'Banner.psd', prefixIcon: 'file-text--line' },
          { value: 'des-2', label: 'Logo.ai', prefixIcon: 'file-text--line' },
        ],
      },
    ],
  },
  {
    value: 'root-3', label: 'Archive', prefixIcon: 'folder--line', expanded: true,
    children: [
      { value: 'arc-1', label: '2023-backup.zip', prefixIcon: 'file-text--line' },
      { value: 'arc-2', label: '2024-backup.zip', prefixIcon: 'file-text--line' },
    ],
  },
];

function renderTreeText(nodes: any[], depth = 0): string {
  return nodes
    .map(n => {
      const indent = '\u00a0\u00a0'.repeat(depth);
      const prefix = n.children?.length ? '\u25b8 ' : '\u00b7 ';
      const line = `${indent}${prefix}${n.label}`;
      const childText = n.children?.length ? renderTreeText(n.children, depth + 1) : '';
      return childText ? `${line}\n${childText}` : line;
    })
    .join('\n');
}

function findLabel(nodes: any[], value: string): string {
  for (const n of nodes) {
    if (n.value === value) return n.label;
    if (n.children?.length) {
      const found = findLabel(n.children, value);
      if (found) return found;
    }
  }
  return value;
}

const DragAndDropTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  const panelStyle = [
    'display:block',
    'background:var(--sc-color-grey-5,#f5f5f5)',
    'border:1px solid var(--sc-color-grey-15,#e0e0e0)',
    'border-radius:0.25rem',
    'padding:0.75rem',
    'margin:0',
    'font-size:0.72rem',
    'line-height:1.6',
    'min-height:5rem',
    'max-height:16rem',
    'overflow-y:auto',
    'white-space:pre',
    'box-sizing:border-box',
    'width:100%',
  ].join(';');

  const labelStyle = 'font-size:0.75rem;font-weight:600;margin-bottom:0.5rem;color:var(--sc-color-blue-900,#1e3a5f)';
  const rootStyle = 'display:flex;flex-wrap:wrap;gap:1.25rem;align-items:flex-start;';
  const colStyle = 'flex:1;min-width:280px;display:flex;flex-direction:column;';

  const onDrop = (e: CustomEvent) => {
    const { sourceValue, targetValue, position, data } = (e as any).detail;
    const root = (e.target as HTMLElement).closest('[data-dnd-root]') as HTMLElement;
    const treeEl = root?.querySelector<any>('sc-tree');
    const logEl = root?.querySelector<HTMLPreElement>('.dnd-log');
    const dataEl = root?.querySelector<HTMLPreElement>('.dnd-data');
    // Feed reordered data back so the tree reflects the new structure
    if (treeEl) treeEl.data = data;
    if (logEl) {
      const time = new Date().toLocaleTimeString();
      const srcLabel = findLabel(data, sourceValue);
      const tgtLabel = findLabel(data, targetValue);
      const entry = `[${time}]\n  moved: "${srcLabel}"\n  \u2192 ${position} "${tgtLabel}"\n\n`;
      logEl.textContent = entry + logEl.textContent;
    }
    if (dataEl) dataEl.textContent = renderTreeText(data);
  };

  return html`
    <sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
      <div data-dnd-root style="${rootStyle}">
        <sc-tree
          .data="${props.data}"
          .selection="${props.selection ?? 'single'}"
          ?show-indent-lines="${props['show-indent-lines']}"
          ?draggable="${props.draggable}"
          style="width:260px;flex-shrink:0"
          @sc-drop="${onDrop}"
        ></sc-tree>
        <div style="${colStyle}">
          <div style="${labelStyle}">Current data</div>
          <pre class="dnd-data" style="${panelStyle}">— no changes yet —</pre>
        </div>
        <div style="${colStyle}">
          <div style="${labelStyle}">sc-drop event log</div>
          <pre class="dnd-log" style="${panelStyle}">— waiting for drop —</pre>
        </div>
      </div>
    </sc-icon-provider>

    <script type="module">
      const root = document.querySelector('[data-dnd-root]');
      const tree = root.querySelector('sc-tree');

      function findLabel(nodes, value) {
        for (const n of nodes) {
          if (n.value === value) return n.label;
          if (n.children?.length) {
            const found = findLabel(n.children, value);
            if (found) return found;
          }
        }
        return value;
      }

      function renderTreeText(nodes, depth) {
        depth = depth || 0;
        var indent = '\u00a0\u00a0'.repeat(depth);
        return nodes.map(function(n) {
          var prefix = (n.children && n.children.length) ? '\u25b8 ' : '\u00b7 ';
          var line = indent + prefix + n.label;
          var childLines = (n.children && n.children.length) ? renderTreeText(n.children, depth + 1) : [];
          return [line].concat(childLines).join('\n');
        }).join('\n');
      }

      tree.addEventListener('sc-drop', function(e) {
        const { sourceValue, targetValue, position, data } = e.detail;
        // Feed the reordered data back so the tree reflects the new order
        tree.data = data;
        const logEl = root.querySelector('.dnd-log');
        const dataEl = root.querySelector('.dnd-data');
        if (logEl) {
          const time = new Date().toLocaleTimeString();
          const srcLabel = findLabel(data, sourceValue);
          const tgtLabel = findLabel(data, targetValue);
          const entry = '[' + time + ']\n  moved: "' + srcLabel + '"\n  \u2192 ' + position + ' "' + tgtLabel + '"\n\n';
          logEl.textContent = entry + logEl.textContent;
        }
        if (dataEl) dataEl.textContent = renderTreeText(data);
      });
    </script>
  `;
};

export const DragAndDrop = DragAndDropTemplate.bind({});

DragAndDrop.args = {
  selection: 'single',
  'show-indent-lines': true,
  draggable: true,
  data: dragDropData,
};

DragAndDrop.parameters = {
  docs: {
    source: {
      code: `
<sc-tree
  id="my-tree"
  show-indent-lines
  draggable
></sc-tree>

<script type="module">
  const tree = document.querySelector('#my-tree');

  tree.data = [
    {
      value: 'root-1', label: 'Documents', prefixIcon: 'folder--line', expanded: true,
      children: [
        {
          value: 'doc-reports', label: 'Reports', prefixIcon: 'folder--line', expanded: true,
          children: [
            { value: 'doc-1', label: 'Q1-Report.pdf', prefixIcon: 'file-text--line' },
            { value: 'doc-2', label: 'Q2-Report.pdf', prefixIcon: 'file-text--line' },
            { value: 'doc-3', label: 'Q3-Report.pdf', prefixIcon: 'file-text--line' },
          ],
        },
        {
          value: 'doc-finance', label: 'Finance', prefixIcon: 'folder--line',
          children: [
            { value: 'fin-1', label: 'Budget.xlsx',   prefixIcon: 'file-text--line' },
            { value: 'fin-2', label: 'Forecast.xlsx', prefixIcon: 'file-text--line' },
          ],
        },
        { value: 'doc-notes', label: 'Notes.txt', prefixIcon: 'file-text--line' },
      ],
    },
    {
      value: 'root-2', label: 'Images', prefixIcon: 'folder--line', expanded: true,
      children: [
        {
          value: 'img-photos', label: 'Photos', prefixIcon: 'folder--line', expanded: true,
          children: [
            { value: 'img-1', label: 'Vacation.png', prefixIcon: 'file-text--line' },
            { value: 'img-2', label: 'Profile.jpg',  prefixIcon: 'file-text--line' },
          ],
        },
      ],
    },
  ];

  tree.addEventListener('sc-drop', function(e) {
    const { sourceValue, targetValue, position, data } = e.detail;
    // Feed the reordered data back so the tree reflects the new order
    tree.data = data;
    console.log('Moved "' + sourceValue + '" ' + position + ' "' + targetValue + '"');
  });
<\/script>
      `,
      language: 'html',
    },
  },
};

// ── WithActionRenderer story ─────────────────────────────────────────────────

const arInitialData = [
  {
    value: 'page-home', label: 'Home',
    prefixIcon: 'folder--line', expanded: true,
    children: [
      { value: 'page-about',    label: 'About us',
        prefixIcon: 'file-text--line', children: [] },
      { value: 'page-contact',  label: 'Contact',
        prefixIcon: 'file-text--line', children: [] },
      { value: 'error',         label: 'Error node',
        prefixIcon: 'file-text--line', children: [] },
      { value: 'not-deletable', label: 'Not deletable',
        prefixIcon: 'file-text--line', children: [] },
    ],
  },
  {
    value: 'page-blog', label: 'Blog',
    prefixIcon: 'folder--line', expanded: false,
    children: [
      { value: 'page-post-1', label: 'First post',
        prefixIcon: 'file-text--line', children: [] },
    ],
  },
];

function arAddSibling(nodes: any[], sibValue: string, newNode: any): any[] {
  const idx = nodes.findIndex((n: any) => n.value === sibValue);
  if (idx !== -1) {
    const r = [...nodes];
    r.splice(idx + 1, 0, newNode);
    return r;
  }
  return nodes.map((n: any) => ({
    ...n,
    children: n.children?.length
      ? arAddSibling(n.children, sibValue, newNode) : n.children,
  }));
}

function arRemoveNode(nodes: any[], value: string): any[] {
  return nodes
    .filter((n: any) => n.value !== value)
    .map((n: any) => ({
      ...n, children: n.children ? arRemoveNode(n.children, value) : [],
    }));
}

function arRenameNode(nodes: any[], value: string, newLabel: string): any[] {
  return nodes.map((n: any) => {
    if (n.value === value) return { ...n, label: newLabel };
    if (n.children?.length)
      return { ...n, children: arRenameNode(n.children, value, newLabel) };
    return n;
  });
}

function arFindSiblings(nodes: any[], value: string): any[] {
  if (nodes.some((n: any) => n.value === value)) return nodes;
  for (const n of nodes) {
    if (n.children?.length) {
      const found = arFindSiblings(n.children, value);
      if (found.length) return found;
    }
  }
  return [];
}

function arShowToast(
  toastEl: any, bodyEl: HTMLElement | null,
  type: string, message: string,
) {
  if (!toastEl || !bodyEl) return;
  toastEl.type = type;
  bodyEl.innerHTML = message;
  toastEl.open = true;
}

const WithActionRendererTemplate: Story<ArgTypes> = () => {
  let treeData = JSON.parse(JSON.stringify(arInitialData));

  const actionRenderer = ({ currentNode, parentNode, tree: t }: any) => {
    const canDelete =
      !!parentNode && currentNode.value !== 'not-deletable';

    const toast = (type: string, msg: string) => {
      const el   = document.getElementById('ar-toast') as any;
      const body = document.getElementById('ar-toast-body') as HTMLElement | null;
      arShowToast(el, body, type, msg);
    };

    return html`
      <span style="display:inline-flex;align-items:center;gap:0.25rem;"
            @click=${(e: Event) => e.stopPropagation()}>

        <sc-icon name="plus" size="sm" title="Add sibling"
          @click=${async (e: Event) => {
            e.stopPropagation();
            const newNode = {
              value: `node-${Date.now()}`,
              label: 'New page',
              prefixIcon: 'file-text--line',
              children: [],
            };
            await new Promise(r => setTimeout(r, 500));
            if (currentNode.value === 'error') {
              toast('error', 'Add node error');
              return;
            }
            treeData = arAddSibling(treeData, currentNode.value, newNode);
            t.data = JSON.parse(JSON.stringify(treeData));
            t.updateComplete.then(() => t.startEditing(newNode.value));
          }}
        ></sc-icon>

        <sc-dropdown-input hoist hide-tick-mark
          @sc-select=${async (e: CustomEvent) => {
            e.stopPropagation();
            const val = (e as any).detail?.value;
            if (val === 'rename') {
              t.startEditing(currentNode.value);
            } else if (val === 'delete' && canDelete) {
              await new Promise(r => setTimeout(r, 500));
              if (currentNode.value === 'error') {
                toast('error', 'Delete node error');
                return;
              }
              const snapshot = JSON.parse(JSON.stringify(treeData));
              treeData = arRemoveNode(treeData, currentNode.value);
              t.data = JSON.parse(JSON.stringify(treeData));
              const revertId = `revert-${Date.now()}`;
              toast('success',
                `"${currentNode.label}" deleted.` +
                ` <a href="#" id="${revertId}">Undo</a>`);
              setTimeout(() => {
                document.getElementById(revertId)
                  ?.addEventListener('click', ev => {
                    ev.preventDefault();
                    treeData = snapshot;
                    t.data = JSON.parse(JSON.stringify(treeData));
                    toast('success', 'Delete reverted.');
                  });
              }, 50);
            }
          }}
        >
          <div slot="trigger">
            <sc-icon name="more-horizontal" size="sm"
              style="cursor:pointer"></sc-icon>
          </div>
          <sc-dropdown-option value="rename">
            <div style="display:flex;align-items:center;gap:.5rem;">
              <sc-icon name="edit-alt--line" size="sm"></sc-icon>
              <span>Rename</span>
            </div>
          </sc-dropdown-option>
          <sc-dropdown-option value="delete"
            disabled=${canDelete ? '' : 'true'}>
            <div style="display:flex;align-items:center;gap:.5rem;
              color:${canDelete ? '#D50000' : 'grey'}">
              <sc-icon name="trash--line" size="sm"></sc-icon>
              <span>Delete</span>
            </div>
          </sc-dropdown-option>
        </sc-dropdown-input>
      </span>
    `;
  };

  const onDrop = (e: CustomEvent) => {
    treeData = (e as any).detail.data;
  };

  const onEditSave = (e: CustomEvent) => {
    const { currentNode, newLabel, cancel } = (e as any).detail;
    const siblings = arFindSiblings(treeData, currentNode.value);
    const duplicate = siblings.some(
      (n: any) =>
        n.value !== currentNode.value && n.label === newLabel.trim()
    );
    const toastEl   = document.getElementById('ar-toast') as any;
    const toastBody =
      document.getElementById('ar-toast-body') as HTMLElement | null;
    if (duplicate) {
      arShowToast(toastEl, toastBody, 'error',
        `"${newLabel.trim()}" already exists at this level.`);
      cancel();
      return;
    }
    treeData = arRenameNode(treeData, currentNode.value, newLabel);
    const treeEl = document.getElementById('ar-tree') as any;
    if (treeEl) treeEl.data = JSON.parse(JSON.stringify(treeData));
  };

  return html`
    <sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
      <div style="width:320px">
        <sc-tree
          id="ar-tree"
          show-indent-lines
          draggable
          .data=${JSON.parse(JSON.stringify(treeData))}
          .actionRenderer=${actionRenderer}
          @sc-drop=${onDrop}
          @sc-edit-save=${onEditSave}
        ></sc-tree>
      </div>
      <sc-toast id="ar-toast" placement="top-right" duration="3000">
        <div id="ar-toast-body"></div>
      </sc-toast>
    </sc-icon-provider>
  `;
};

export const WithActionRenderer = WithActionRendererTemplate.bind({});
WithActionRenderer.args = {};
WithActionRenderer.parameters = {
  docs: {
    description: {
      story: `
Demonstrates the **\`actionRenderer\`** prop — a function \`(context) => TemplateResult\`
called once per node, returning the Lit template for the row's right-hand action area.

\`\`\`ts
tree.actionRenderer = ({ currentNode, parentNode, tree }) => html\`…\`;
\`\`\`

**Context object**

| Key | Type | Description |
|---|---|---|
| \`currentNode\` | \`TreeItem\` | The node this row represents |
| \`parentNode\` | \`TreeItem \| null\` | Parent node (\`null\` for root) |
| \`tree\` | \`ScTree\` | The tree element itself |

**Features shown**
- **➕ Add sibling** — inserts a node after the current one, then calls
  \`tree.startEditing()\` to open inline edit immediately
- **Rename** — calls \`tree.startEditing()\` to open the built-in inline input
- **Delete** — removes the node; disabled for root nodes and \`not-deletable\`
- **Error node** — simulates a server error on add / delete
- **\`sc-edit-save\`** — validates for duplicate sibling names;
  calls \`cancel()\` to keep the input open on failure
- **\`sc-drop\`** — keeps \`treeData\` in sync after drag-reorder
- Actions reveal on **hover** by default (\`show-actions="hover"\`)
      `,
    },
    source: {
      code: `
<sc-tree id="my-tree" show-indent-lines draggable></sc-tree>
<sc-toast id="my-toast" placement="top-right" duration="3000">
  <div id="my-toast-body"></div>
</sc-toast>

<script type="module">
  import { html } from 'lit';
  const tree      = document.getElementById('my-tree');
  const toastEl   = document.getElementById('my-toast');
  const toastBody = document.getElementById('my-toast-body');

  function showToast(type, msg) {
    toastEl.type = type; toastBody.innerHTML = msg; toastEl.open = true;
  }

  let treeData = [ /* your data */ ];

  const addSibling = (nodes, sib, node) => {
    const i = nodes.findIndex(n => n.value === sib);
    if (i !== -1) { const r = [...nodes]; r.splice(i + 1, 0, node); return r; }
    return nodes.map(n => ({
      ...n, children: n.children?.length ? addSibling(n.children, sib, node) : n.children,
    }));
  };
  const removeNode = (nodes, v) =>
    nodes.filter(n => n.value !== v)
         .map(n => ({ ...n, children: n.children ? removeNode(n.children, v) : [] }));
  const renameNode = (nodes, v, lbl) =>
    nodes.map(n => n.value === v ? { ...n, label: lbl }
      : { ...n, children: n.children?.length ? renameNode(n.children, v, lbl) : n.children });
  const findSiblings = (nodes, v) => {
    if (nodes.some(n => n.value === v)) return nodes;
    for (const n of nodes) {
      if (n.children?.length) {
        const f = findSiblings(n.children, v); if (f.length) return f;
      }
    }
    return [];
  };

  tree.actionRenderer = ({ currentNode, parentNode, tree: t }) => {
    const canDelete = !!parentNode && currentNode.value !== 'not-deletable';
    return html\`
      <span style="display:inline-flex;align-items:center;gap:.25rem;"
            @click=\${e => e.stopPropagation()}>
        <sc-icon name="plus" size="sm" title="Add sibling"
          @click=\${async e => {
            e.stopPropagation();
            const node = { value: \\\`node-\\\${Date.now()}\\\`, label: 'New page',
                           prefixIcon: 'file-text--line', children: [] };
            await new Promise(r => setTimeout(r, 500));
            treeData = addSibling(treeData, currentNode.value, node);
            t.data = JSON.parse(JSON.stringify(treeData));
            t.updateComplete.then(() => t.startEditing(node.value));
          }}></sc-icon>
        <sc-dropdown-input hoist hide-tick-mark
          @sc-select=\${async e => {
            e.stopPropagation();
            const val = e.detail?.value;
            if (val === 'rename') { t.startEditing(currentNode.value); }
            else if (val === 'delete' && canDelete) {
              await new Promise(r => setTimeout(r, 500));
              const snap = JSON.parse(JSON.stringify(treeData));
              treeData = removeNode(treeData, currentNode.value);
              t.data = JSON.parse(JSON.stringify(treeData));
              const rid = \\\`rv-\\\${Date.now()}\\\`;
              showToast('success',
                \\\`"\\\${currentNode.label}" deleted. <a href="#" id="\\\${rid}">Undo</a>\\\`);
              setTimeout(() => {
                document.getElementById(rid)?.addEventListener('click', ev => {
                  ev.preventDefault();
                  treeData = snap; t.data = JSON.parse(JSON.stringify(treeData));
                  showToast('success', 'Delete reverted.');
                });
              }, 50);
            }
          }}>
          <div slot="trigger"><sc-icon name="more-horizontal" size="sm"></sc-icon></div>
          <sc-dropdown-option value="rename">Rename</sc-dropdown-option>
          <sc-dropdown-option value="delete" disabled=\${canDelete ? '' : 'true'}>
            Delete
          </sc-dropdown-option>
        </sc-dropdown-input>
      </span>
    \`;
  };

  tree.addEventListener('sc-drop', e => { treeData = e.detail.data; });
  tree.addEventListener('sc-edit-save', e => {
    const { currentNode, newLabel, cancel } = e.detail;
    const sibs = findSiblings(treeData, currentNode.value);
    if (sibs.some(n => n.value !== currentNode.value && n.label === newLabel.trim())) {
      showToast('error', \\\`"\\\${newLabel.trim()}" already exists at this level.\\\`);
      cancel(); return;
    }
    treeData = renameNode(treeData, currentNode.value, newLabel);
    tree.data = JSON.parse(JSON.stringify(treeData));
  });

  tree.data = JSON.parse(JSON.stringify(treeData));
<\/script>
      `,
      language: 'html',
    },
  },
};
