import '@scdevkit/webkit-ext';
//@ts-ignore
import type { ScRelationship } from '@scdevkit/webkit-ext/dist/elements/sc-relationship.js';
import { StoryContext } from '@storybook/web-components';
import { html, nothing, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
// @ts-ignore
import { default as serialize } from 'serialize-javascript';

export default {
  title: 'Business Components/Relationship/Relationship',
  component: 'sc-relationship',
  parameters: {
    docs: {
      description: {
        component:
          // eslint-disable-next-line max-len
          `Relationship shows organization relationship implementing [relationship diagram](?path=/docs/business-components-relationship-relationship-diagram--overview).
          <br/>
          To use business components, please import '@scdevkit/webkit-ext'.
          `,
      },
      source: {
        transform,
        language: 'html',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'The node sizes',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    search: {
      control: 'boolean',
      description: 'Set to show search field.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    minimap: {
      control: 'boolean',
      description: 'Set to show minimap & other controls.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    export: {
      control: 'boolean',
      description: 'Set to show export button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    legend: {
      control: 'boolean',
      description: 'Set to show legend.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    depthDropdown: {
      name: 'depth-dropdown',
      control: 'boolean',
      description: 'Set to show depth dropdown. Link depth limit can still be set with `depth` attribute.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    depth: {
      control: 'number',
      description:
        'The relationship depth from selected values. Set to 0 will disable link depth limit from selected nodes.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 2 },
        category: 'Attributes',
      },
    },
    selectIds: {
      control: 'array',
      description: 'Selected array of IDs',
      table: {
        type: { summary: 'array' },
        category: 'Properties',
      },
    },
    data: {
      control: 'object',
      description: 'Array of employee/entity data objects',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: 'undefined' },
        category: 'Properties',
      },
    },
    config: {
      control: 'object',
      description: 'Configuration object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: 'undefined' },
        category: 'Properties',
      },
    },
    onSearch: {
      control: 'object',
      description:
        'Async function callback for search, should return an array of employee data objects',
      table: {
        type: { summary: '(s:string) => Promise<RelNodeData[]>' },
        defaultValue: { summary: 'undefined' },
        category: 'Properties',
      },
    },
    fields: {
      control: 'array',
      description: 'Passed to ScEmployeeCard fields attribute with default hover',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: 'undefined' },
        category: 'Attributes',
      },
    },
    hoverFn: {
      control: 'function',
      description:
        'Function that returns an element to be displayed on hover.',
      table: {
        type: { summary: '(n?:RelNodeData) => string | HTMLElement | TemplateResult' },
        defaultValue: { summary: 'undefined' },
        category: 'Properties',
      },
    },
    'sc-select': {
      description: 'Emitted when a node selection was made.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    _scHover: {
      name: 'sc-hover',
      description: 'Emitted when a node is hovered.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-collapse': {
      description: 'Emitted when minimap is collapsed.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-expand': {
      description: 'Emitted when minimap is expanded.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-rel-depth': {
      description: 'Emitted when the relationship depth was changed.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-rel-search-select': {
      description:
        'Emitted when a search result was selected. ' +
        'Ideal place to dynamically update `data` based on search select',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-export': {
      description: 'Emitted with export type.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    _slotHover: {
      name: 'slot[name=\'hover\']',
      control: 'text',
      description: 'Sets to customize the hover.',
      table: {
        category: 'Slots',
      },
    },
  },
  render,
  args: {
    get data() {
      return data;
    },
    selectIds: ['1389585'],
    size: 'md',
    search: true,
    minimap: true,
    export: true,
    legend: true,
    depthDropdown: true,
    depth: 2,
    onSearch: undefined,
    fields: undefined,
    hoverFn: undefined,
  },
};

type ArgTypes = Partial<ScRelationship> & {
  _slotHover?: string | TemplateResult | HTMLElement;
  _scHover?: (e: CustomEvent) => void;
};
type Story = StoryContext<ArgTypes>;

function render(props: ArgTypes) {
  return Provider(html`
    <sc-relationship
      .data=${props.data ?? data}
      size=${props.size ?? 'md'}
      ?search=${props.search}
      ?minimap=${props.minimap}
      ?export=${props.export}
      ?legend=${props.legend}
      ?depth-dropdown=${props.depthDropdown}
      depth=${props.depth ?? 2}
      .fields=${props.fields}
      .selectIds=${props.selectIds ?? []}
      .config=${props.config ?? {}}
      .onSearch=${props.onSearch ?? undefined}
      .hoverFn=${props.hoverFn ?? undefined}
      style="height: calc(100vh - 2rem)"
      @sc-hover=${props._scHover}
    >
      ${props._slotHover
        ? html`<div slot="hover" style="background:var(--sc-color-white)">${props._slotHover}</div>`
        : nothing}
    </sc-relationship>
  `);
}
function transform(source: string, { args }: Story) {
  return `
    ${source.replace(
      '<sc-relationship',
      `<sc-relationship\n\t.data=\${data}\n\t${
        args.selectIds?.length ? '.selectIds=${selectIds}\n\t' : ''
      } ${args.config ? '.config=${config}\n\t' : ''} ${
        args.onSearch ? '.onSearch=${onSearch}\n\t' : ''
      } ${args._scHover ? '@sc-hover=${onHover}\n\t' : ''} ${
        args.hoverFn ? '.hoverFn=${hoverFn}\n\t' : ''
      }>`
    )}

    <script>
    ${args.selectIds ? `const selectIds = ${serialize(args.selectIds)};` : ''}
    ${args.config ? `const config = ${serialize(args.config)};` : ''}
    ${args.onSearch ? `const onSearch = ${serialize(args.onSearch)};` : ''}
    ${args._scHover ? `const onHover = ${serialize(args._scHover)};` : ''}
    ${
      args.hoverFn
        ? `const hoverFn = ${args.hoverFn.toString()};`
        : ''
    }
    const data = ${JSON.stringify(data)};
    </script>
  `;
}
function storyWith(args: Partial<Story>): Story {
  return Object.assign(render.bind({}), args) as unknown as Story;
}

export const Basic = storyWith({});

export const NoInterface = storyWith({
  args: {
    search: false,
    minimap: false,
    export: false,
    legend: false,
    depthDropdown: false,
    depth: 0,
  },
});

export const CustomSearch = storyWith({
  args: {
    get onSearch() {
      return customSearch;
    },
  },
});

export const CustomConfig = storyWith({
  args: {
    get config() {
      return customConfig;
    },
  },
});

export const CustomHover = storyWith({
  args: {
    get _slotHover() {
      return html`Custom Hover Content:<br /><span class="hover-name"></span>`;
    },
    _scHover: (e: CustomEvent) => {
      const span = document.querySelector('.hover-name');
      if (span && e.detail.hover) {
        span.textContent = e.detail.hover.name;
      }
    },
  },
});

export const CustomHoverFunction = storyWith({
  args: {
    get _slotHover() {
      return html`Custom Hover Content:<br /><span class="hover-name"></span>`;
    },
    hoverFn: ((node: any) => {
      return html`Custom Hover Content:<br />
      <span class="hover-name">${node?.name}</span>`;
    }) as any,
  },
});


const customSearch = (s: string): Promise<ScRelationship['data']> =>
  Promise.resolve(data.filter((item: any) => item.id === s || item.name.includes(s)));

const customConfig: ScRelationship['config'] = {
  color: '--sc-white',
  node: {
    placeholder: { default: 'initials' },
    shape: {
      default: 'rectRounded',
      custom: {
        entity: 'circle',
      },
    },
    borderWidth: {
      default: 1,
      selected: 4,
      hover: 4,
    },
    borderColor: {
      custom: {
        entity: '--sc-color-yellow-200',
        entityHover: '--sc-color-orange-400',
        entitySelected: '--sc-color-red-400',
      },
    },
  },
};

const data = [
  {
    id: '1389585',
    name: 'Johnson, Kingston',
    businessTitle: 'Head, Application Platform',
    department: 'IT-Projs-ET Integration Svcs',
    location: 'Singapore',
    email: 'kingston.johnson@sc.com',
    links: [
      {
        id: '3440000005279031',
        relationship: 'Owner',
      },
    ],
  },
  {
    id: '3440000005279031',
    name: 'App Platform',
    type: 'entity',
  },
  {
    id: '1574871',
    name: 'Thian, Hon Fui',
    businessTitle: 'Sr. Engineering Manager',
    department: 'TSA PRJ SG DevOps',
    connection: { open: true, label: '21' },
    location: 'Singapore',
    email: 'honfui.thian@sc.com',
    links: [
      {
        id: '3440000005279030',
        relationship: 'Owner',
      },
      {
        id: '1389585',
        relationship: 'Guarantor',
      },
    ],
  },
  {
    id: '3440000005279030',
    name: 'Service Bench',
    type: 'entity',
  },
  {
    id: '1577986',
    name: 'Wuryantobroto, Sulistyo',
    businessTitle: 'Lead Software Engineer',
    department: 'IT-TPS-T&A WKS Observability',
    location: 'Singapore',
    email: 'Sulistyo.Wuryantobroto@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1547358',
    name: 'Li Wen',
    businessTitle: 'Testing Lead',
    department: 'TSA PRJ SG DevOps',
    location: 'Singapore',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1632470',
    name: 'Li Qiang',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-TPS-T&A Cloud Operations',
    location: 'Singapore',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1399899',
    name: 'Wang Yufang',
    businessTitle: 'Product Engineer Manager',
    department: 'China - Tianjin (GBS)',
    location: 'Tianjin',
    rel: 'POA',
    links: [
      {
        id: '1574871',
        relationship: 'POA',
      },
    ],
  },
  {
    id: '1664072',
    name: 'Feng, Shiyu',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1626487',
    name: 'Zhao, Haixi',
    businessTitle: 'Lead Software Engineer',
    department: 'IT-TPS-T&A WKS Observability',
    location: 'Tianjin',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2027226',
    name: 'Santos, Jaycee',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Projects-TC-T&A SE DevOps',
    location: 'Manila',
    email: 'jaycee.santos@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
      {
        id: '2026658',
        relationship: 'Matrix Manager',
      },
    ],
  },
  {
    id: '2027194',
    name: 'Real, Aaron',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Projects-TC-T&A SE DevOps',
    location: 'Manila',
    email: 'Aaron.Real@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
      {
        id: '2026658',
        relationship: 'Matrix Manager',
      },
    ],
  },
  {
    id: '2013454',
    name: 'Ng, Ching Ting',
    businessTitle: 'Software Engineer',
    department: 'IT-Prj-IC-T&A-Tech Delivery',
    location: 'Singapore',
    email: 'ChingTing.Ng@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1649583',
    name: 'Chee, Carlsson',
    businessTitle: 'Design Director',
    department: 'IT-Proj-IC-T&A SE Msg Platform',
    location: 'Singapore',
    email: 'Carlsson.Chee@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1614703',
    name: 'Vijaya Kumar P',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Proj-IC-T&A SE aXes Academy',
    location: 'Chennai',
    email: 'VijayaKumar.P1@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1656337',
    name: 'Li2, Dan',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Dan.Li2@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1431830',
    name: 'Jiao, Lancy Qinglan',
    businessTitle: 'Lead Software Engineer',
    department: 'IT-TPS-T&A WKS Observability',
    location: 'Tianjin',
    email: 'QingLan.Jiao@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1399902',
    name: 'Wang, Cindy',
    businessTitle: 'Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'CindyZiYin.Wang@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1664550',
    name: 'Liu, Sara',
    businessTitle: 'Senior Experience Designer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'SaraJinghan.Liu@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
      {
        id: '1649583',
        relationship: 'UX team',
      },
    ],
  },
  {
    id: '2026176',
    name: 'Yue, Troy',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Troy.Yue@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2026933',
    name: 'Xianliang, Zhang',
    businessTitle: 'Senior Software Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Zhang.Xianliang@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1653204',
    name: 'Song, Linlin Song',
    businessTitle: 'Lead Software Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Linlin.Song@sc.com',
    links: [
      {
        id: '1399899',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1431823',
    name: 'Meng, Chalmers',
    businessTitle: 'Senior Site Reliability Engineer',
    department: 'IT-TPS-T&A WKS Observability',
    location: 'Tianjin',
    email: 'Chalmers.Meng@sc.com',
    links: [
      {
        id: '1574871',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2027744',
    name: 'Hou, Binglei',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'binglei.hou@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2033365',
    name: 'Tang, Lei',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Lei.Tang@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2031779',
    name: 'Yu, Xuezhong',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Xuezhong.Yu@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1238480',
    name: 'R, Venkatesh',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Proj-IC-T&A SE aXes Academy',
    location: 'Chennai',
    email: 'Venkatesh.Ramachandran@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2027330',
    name: 'Cajuday, Ayron Wyette',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Projects-TC-T&A SE DevOps',
    location: 'Makati City',
    email: 'AyronWyette.Cajuday@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
      {
        id: '2026658',
        relationship: 'Matrix Manager',
      },
    ],
  },
  {
    id: '2027410',
    name: 'Ordona, Alfie',
    businessTitle: 'Site Reliability Engineer',
    department: 'IT-Projects-TC-T&A SE DevOps',
    location: 'Makati City',
    email: 'AyronWyette.Cajuday@sc.com',
    links: [
      {
        id: '1431823',
        relationship: 'Beneficiary',
      },
      {
        id: '2026658',
        relationship: 'Matrix Manager',
      },
    ],
  },
  {
    id: '1579493',
    name: 'Tan, Harry',
    businessTitle: 'Sr. Engineering Manager - SC IDP',
    department: 'IT-TPS-T&A Cloud Operations',
    location: 'Singapore',
    email: 'Harry.Tan@sc.com',
    links: [
      {
        id: '1389585',
        relationship: 'Beneficiary',
      },
      {
        id: '3440000005279029',
        relationship: 'Owner',
      },
    ],
  },
  {
    id: '3440000005279029',
    name: 'Identity Platform',
    type: 'entity',
  },
  {
    id: '2023418',
    name: 'Yue, Wenjie',
    businessTitle: 'Platform Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Wenjie.Yue@sc.com',
    links: [
      {
        id: '1579493',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1631160',
    name: 'Liu, Jimmy',
    businessTitle: 'Lead Platform Engineer',
    department: 'IT-Proj-IC-T&A SE App Platform',
    location: 'Tianjin',
    email: 'Jimmy.Liu@sc.com',
    links: [
      {
        id: '1579493',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '1574206',
    name: 'Sun, Bill',
    businessTitle: 'Head, Solution Delivery',
    department: 'IT-Projects-IC-T&A SE DevOps',
    location: 'Singapore',
    email: 'Bill.Sun@sc.com',
    links: [
      {
        id: '1389585',
        relationship: 'Beneficiary',
      },
    ],
  },
  {
    id: '2026658',
    name: 'Los Banos, Joseph Paulo',
    businessTitle: 'Engineering Manager',
    department: 'IT-Projects-TC-T&A SE DevOps',
    location: 'Makati City',
    email: 'JosephPaulo.LosBanos@sc.com',
    links: [
      {
        id: '1574206',
        relationship: 'Beneficiary',
      },
    ],
  },
] as ScRelationship['data'];
