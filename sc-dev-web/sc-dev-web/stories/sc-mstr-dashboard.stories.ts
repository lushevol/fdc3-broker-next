import { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../elements/sc-dashboard-viewer.js';

const meta: Meta = {
  title: 'Viewer/Dashboard/MicroStrategy',
  component: 'sc-dashboard-viewer',
  render: args => {
    return html`
      <sc-dashboard-viewer type="mstr" .config=${args}></sc-dashboard-viewer>
    `;
  },
  parameters: {
    docs: {
      description: {
        component: 'Embedded MicroStrategy report and dossier viewer.',
      },
    },
    styles: {
      width: '100%',
      height: '100vw',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'subscription-id': {
      control: 'text',
      description: 'MicroStrategy report or dossier subscription ID.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    server: {
      control: 'text',
      description: 'MicroStrategy server host with optional port.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'project-id': {
      control: 'text',
      description: 'MicroStrategy project ID.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'identity-token': {
      control: 'text',
      description: 'Identity token for seamless login (static token only).',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    getLoginToken: {
      control: false,
      description: 'Async identity token provider for seamless login.',
      table: {
        type: { summary: '() => Promise<string> | string' },
        category: 'Properties',
      },
    },
    port: {
      control: 'text',
      description: 'MicroStrategy server port.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'text',
      description: 'Container width. Accepts any valid CSS size.',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '100%' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'text',
      description: 'Container height. Accepts any valid CSS size.',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '100vh' },
        category: 'Attributes',
      },
    },
    'embed-mode': {
      type: {
        name: 'enum',
        value: ['auto', 'library', 'report', 'dossier', 'iframe'],
      },
      description:
        'Embedding mode. auto: SDK chooses library->report->dossier with iframe fallback. library: embed Library page. report: embed report page. dossier: embed dossier. iframe: plain iframe without SDK features.',
      table: {
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
    },
    'disable-navigation-bar': {
      control: 'boolean',
      description: 'Disable navigation bar UI elements.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'disable-responsive': {
      control: 'boolean',
      description: 'Disable responsive layout behavior in embedded views.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'enable-navigation': {
      control: 'boolean',
      description: 'Enable navigation UI elements.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'disable-auto-retry': {
      control: 'boolean',
      description: 'Disable automatic retry on embed failures.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-account': {
      control: 'boolean',
      description: 'Hide account menu in navigation UI.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-header': {
      control: 'boolean',
      description: 'Hide header in iframe mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-path': {
      control: 'boolean',
      description: 'Hide breadcrumb/path in iframe mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-dock-top': {
      control: 'boolean',
      description: 'Hide top dock in iframe mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-dock-left': {
      control: 'boolean',
      description: 'Hide left dock in iframe mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    'hide-footer': {
      control: 'boolean',
      description: 'Hide footer in iframe mode.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    debug: {
      control: 'boolean',
      description: 'Enable debug logging.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
  },
  args: {},
};

export default meta;

export const Default: StoryObj = {
  args: {
    'subscription-id': 'AFA5806B46E8EEB913CFA5B5DD8FAEE6',
    server: 'mstrdev-stg.51287.app.standardchartered.com:9013',
    'project-id': '2C778EA54EE39A5FE9BA04958B471A6B',
    width: '100%',
    height: '600px',
    'embed-mode': 'library',
    debug: false,
  },
};

// export const IframeMode: StoryObj = {
//   args: {
//     'embed-mode': 'iframe',
//     'subscription-id': 'AFA5806B46E8EEB913CFA5B5DD8FAEE6',
//     server: 'mstrdev-stg.51287.app.standardchartered.com:9013',
//     'project-id': '2C778EA54EE39A5FE9BA04958B471A6B',
//     width: '100%',
//     height: '600px',
//     debug: false,
//   },
// };

export const WithNavigation: StoryObj = {
  args: {
    'enable-navigation': true,
    'show-search': true,
    'show-filter': true,
    'subscription-id': 'AFA5806B46E8EEB913CFA5B5DD8FAEE6',
    server: 'mstrdev-stg.51287.app.standardchartered.com:9013',
    'project-id': '2C778EA54EE39A5FE9BA04958B471A6B',
    width: '100%',
    height: '600px',
    'embed-mode': 'library',
    debug: false,
  },
};

