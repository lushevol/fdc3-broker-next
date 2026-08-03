import { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';
import {
  ScTableauDashboard,
} from '../src/components/ScDashboardViewer/ScTableauDashboard/ScTableauDashboard.js';
import { TableauFilterUpdateType } from '../src/components/ScDashboardViewer/ScTableauDashboard/typings.js';

const meta: Meta = {
  title: 'Viewer/Dashboard/Tableau',
  component: 'sc-dashboard-viewer',
  render: args => {
    return html`
      <sc-dashboard-viewer type="tableau" .config=${args}></sc-dashboard-viewer>`;
  },
  parameters: {
    docs: {
      description: {
        component:
          'Live report, embedded from Tableau.',
      },
    },
    styles: {
      width: '100%',
      height: '100vw',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    scriptPath: {
      control: 'text',
      description: 'Represents the full Tableau script path including the hostname.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    reportPath: {
      control: 'text',
      description: 'Represents the full Tableau report path including the hostname.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'text',
      description: 'Represents width in pixels. Can be any valid CSS size specifier.',
      table: {
        type: { summary: 'string | number' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'text',
      description: 'Represents height in pixels. Can be any valid CSS size specifier.',
      table: {
        type: { summary: 'string | number' },
        category: 'Attributes',
      },
    },
    disableUrlActionsPopups: {
      control: 'boolean',
      description: 'Indicates whether to suppress the execution of URL actions.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    hideTabs: {
      control: 'boolean',
      description: 'Indicates whether tabs are hidden or shown.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    toolbar: {
      type: {
        name: 'enum',
        value: ['top', 'bottom', 'hidden'],
      },
      description: 'Specifies the position of the toolbar.',
      table: {
        category: 'Attributes',
      },
    },
    device: {
      type: {
        name: 'enum',
        value: ['default', 'desktop', 'tablet', 'phone'],
      },
      description: 'Specifies a device layout for a dashboard.',
      table: {
        category: 'Attributes',
      },
    },
    instanceIdToClone: {
      control: 'text',
      description: 'Specifies the ID of an existing instance to make a copy of.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    hideEditButton: {
      control: 'boolean',
      description: 'Indicates whether the Edit button is hidden or visible.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    touchOptimize: {
      control: 'boolean',
      description: 'Indicates whether to touch optimize viz controls.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    hideEditInDesktopButton: {
      control: 'boolean',
      description: 'Indicates whether the Edit in Desktop button is hidden or visible.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    suppressDefaultEditBehavior: {
      control: 'boolean',
      description: 'Indicates whether the default edit behavior is suppressed.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    token: {
      control: 'text',
      description: 'The token used for authorization.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    iframeAuth: {
      control: 'boolean',
      description: 'Indicates whether to use the old auth mechanism for authentication inside the iframe.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    iframeAttributeLoading: {
      control: 'text',
      description: 'The value of the \'loading\' attribute of the embedded iframe.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    iframeAttributeStyle: {
      control: 'text',
      description: 'The value of the \'style\' attribute of the embedded iframe.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    iframeAttributeClass: {
      control: 'text',
      description: 'The value of the \'class\' attribute of the embedded iframe.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
  },
  args: {
    scriptPath: 'https://crrtableau.50529.app.standardchartered.com/javascripts/api/tableau.embedding.3.latest.min.js',
    reportPath: 'https://crrtableau.50529.app.standardchartered.com/#/views/NSFRSummaryandSourceUses-Entity/NSFRSummary',
    width: '100%',
    height: '500px',
  },
};

export default meta;

export const Default: StoryObj = {
  args: {},
};

export const HideEditButton: StoryObj = {
  args: {
    hideEditButton: true,
  },
};

export const TopToolbar: StoryObj = {
  args: {
    toolbar: 'top',
  },
};

export const OnFirstInteractive: StoryObj = {
  args: {
    '.onFirstInteractive': () => {
      alert('onFirstInteractive');
    },
  },
};

export const StaticFilter: StoryObj = {
  args: {
    '.filters': [
      {
        field: 'entity',
        value: 'GB',
      },
    ],
  },
};

export const DynamicFilter: StoryObj = {
  render: args => {
    return html`
      <div class="wrapper">
        <input id="filter" type="text" placeholder="Filter Entity"/>
        <button
          @click=${() => {
    const filterValue = (document.getElementById('filter') as HTMLInputElement).value;
    const scEmbeddedReport = document.querySelector('sc-dashboard-viewer')?.shadowRoot?.querySelector('#tableau-dynamic-filter') as ScTableauDashboard;
    scEmbeddedReport.getFiltersAsync('Summary Table').then(filters => console.log({ filters }));
    scEmbeddedReport.getParametersAsync().then(params => console.log({ params }));
    scEmbeddedReport.applyFilterAsync('Entity', filterValue.split(','), TableauFilterUpdateType.Replace, { isExcludeMode: false }, 'Summary Table');
  }}
        >Filter
        </button>
        <button
          @click=${() => {
    const scEmbeddedReport = document.querySelector('sc-dashboard-viewer')?.shadowRoot?.querySelector('#tableau-dynamic-filter') as ScTableauDashboard;
    scEmbeddedReport.clearFilterAsync('Entity', 'Summary Table');
  }}
        >Clear
        </button>
        <sc-dashboard-viewer type="tableau" .config=${{ ...args, id: 'tableau-dynamic-filter' }}></sc-dashboard-viewer>
      </div>
    `;
  },
};
