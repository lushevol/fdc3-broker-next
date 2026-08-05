import { html, TemplateResult } from 'lit';

function handleCustomEvent(e: Event, eventType: string) {
  console.log(eventType, (e as CustomEvent).detail);
}

export default {
  title: 'Components/Tabs',
  component: 'sc-tabs',
  tags: ['autodocs'],
  argTypes: {
    alignment: {
      control: 'inline-radio',
      options: ['left', 'center'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      options: ['outline', 'filled', 'segmented'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'outline' },
        category: 'Attributes',
      },
    },
    'show-tabs-bottom-line': {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Attributes',
      },
    },
    'sc-tab-select': {
      description:
        'Emitted when select a tab. Get the tab name by event.detail.name.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-close': {
      description:
        'Emitted when close a tab. Get the closed tab by event.detail.tab. Get the name of closed tab by event.detail.name.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tab-hide': {
      description:
        'Emitted when a tab is hidden. Get the tab name by event.detail.name.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tab-show': {
      description:
        'Emitted when a tab is shown. Get the tab name by event.detail.name.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    alignment: 'left',
    type: 'outline',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  alignment?: 'left' | 'center';
  type?: 'outline' | 'filled' | 'segmented';
  tabs?: object;
  'show-tabs-bottom-line'?: boolean;
}

const Template: Story<ArgTypes> = ({
  alignment = 'left',
  type = 'outline',
  ...otherProps
}: ArgTypes) =>
  html`
    <sc-tab-group class="sc-tabs" 
      .alignment=${alignment} 
      .type=${type} 
      ?show-tabs-bottom-line=${otherProps['show-tabs-bottom-line']}
      @sc-tab-select=${(e: any) => handleCustomEvent(e, 'sc-tab-select:')}
      @sc-close=${(e: any) => handleCustomEvent(e, 'sc-close:')}
      @sc-tab-hide=${(e: any) => handleCustomEvent(e, 'sc-tab-hide:')}
      @sc-tab-show=${(e: any) => handleCustomEvent(e, 'sc-tab-show:')}
    >
      <sc-tab slot="nav" panel="tab1"> tab1-name </sc-tab>
      <sc-tab slot="nav" panel="tab2" active closable icon="alert-circle--fill" counter="20"> tab2-name </sc-tab>
      <sc-tab slot="nav" panel="tab3" disabled> tab3-name </sc-tab>
      <sc-tab slot="nav" panel="tab4" error> tab4-name </sc-tab>
      <sc-tab slot="nav" panel="tab5"> tab5-name </sc-tab>
      <sc-tab slot="nav" panel="tab6"> tab6-name </sc-tab>
      <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
      <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
      <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
      <sc-tab-panel name="tab4">Tab4 content</sc-tab-panel>
      <sc-tab-panel name="tab5">Tab5 content</sc-tab-panel>
      <sc-tab-panel name="tab6">Tab6 content</sc-tab-panel>
    </sc-tab-group>
  `;

export const Default = Template.bind({});

const DividerTemplate: Story<ArgTypes> = ({
  alignment = 'left',
  type = 'outline',
  ...otherProps
}: ArgTypes) =>
  html`
    <sc-tab-group class="sc-tabs" .alignment=${alignment} .type=${type} ?show-tabs-bottom-line=${otherProps['show-tabs-bottom-line']}>
      <sc-tab slot="nav" panel="tab1"> tab1-name </sc-tab>
      <sc-tab-divider slot="nav"></sc-tab-divider>
      <sc-tab slot="nav" panel="tab2" active> tab2-name </sc-tab>
      <sc-tab slot="nav" panel="tab3"> tab3-name </sc-tab>
      <sc-tab slot="nav" panel="tab4"> tab4-name </sc-tab>
      <sc-tab slot="nav" panel="tab5"> tab5-name </sc-tab>
      <sc-tab slot="nav" panel="tab6"> tab6-name </sc-tab>
      <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
      <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
      <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
      <sc-tab-panel name="tab4">Tab4 content</sc-tab-panel>
      <sc-tab-panel name="tab5">Tab5 content</sc-tab-panel>
      <sc-tab-panel name="tab6">Tab6 content</sc-tab-panel>
    </sc-tab-group>
  `;

export const TabDivider = DividerTemplate.bind({});

const NoBottomLineTemplate: Story<ArgTypes> = ({
  alignment = 'left',
  type = 'outline',
  ...otherProps
}: ArgTypes) =>
  html`
    <sc-tab-group
      class="sc-tabs"
      no-scroll-controls
      no-active-bottom-line
      .alignment=${alignment}
      .type=${type}
      ?show-tabs-bottom-line=${otherProps['show-tabs-bottom-line']}
    >
      <sc-tab slot="nav" panel="tab1"> tab1-name </sc-tab>
      <sc-tab-divider slot="nav"></sc-tab-divider>
      <sc-tab slot="nav" panel="tab2" active> tab2-name </sc-tab>
      <sc-tab slot="nav" panel="tab3"> tab3-name </sc-tab>
      <sc-tab slot="nav" panel="tab4"> tab4-name </sc-tab>
      <sc-tab slot="nav" panel="tab5"> tab5-name </sc-tab>
      <sc-tab slot="nav" panel="tab6"> tab6-name </sc-tab>
      <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
      <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
      <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
      <sc-tab-panel name="tab4">Tab4 content</sc-tab-panel>
      <sc-tab-panel name="tab5">Tab5 content</sc-tab-panel>
      <sc-tab-panel name="tab6">Tab6 content</sc-tab-panel>
    </sc-tab-group>
  `;

export const NoBottomLine = NoBottomLineTemplate.bind({});

const ClosableTemplate: Story<ArgTypes> = ({
  alignment = 'left',
  type = 'outline',
  ...otherProps
}: ArgTypes) =>
  html`
    <sc-tab-group class="sc-tabs" .alignment=${alignment} .type=${type} ?show-tabs-bottom-line=${otherProps['show-tabs-bottom-line']}>
      <sc-tab slot="nav" panel="tab1"> tab1-name </sc-tab>
      <sc-tab slot="nav" panel="tab2" active closable> tab2-name </sc-tab>
      <sc-tab slot="nav" panel="tab3" closable> tab3-name </sc-tab>
      <sc-tab slot="nav" panel="tab4" closable> tab4-name </sc-tab>
      <sc-tab slot="nav" panel="tab5" closable> tab5-name </sc-tab>
      <sc-tab slot="nav" panel="tab6" closable> tab6-name </sc-tab>
      <sc-tab-panel name="tab1">Tab1 content</sc-tab-panel>
      <sc-tab-panel name="tab2">Tab2 content</sc-tab-panel>
      <sc-tab-panel name="tab3">Tab3 content</sc-tab-panel>
      <sc-tab-panel name="tab4">Tab4 content</sc-tab-panel>
      <sc-tab-panel name="tab5">Tab5 content</sc-tab-panel>
      <sc-tab-panel name="tab6">Tab6 content</sc-tab-panel>
    </sc-tab-group>
  `;

export const Closeable = ClosableTemplate.bind({});


const SegmentedTemplate: Story<ArgTypes> = ({
  alignment = 'left',
  type = 'segmented',
  ...otherProps
}: ArgTypes) =>
  html`
    <sc-tab-group class="sc-tabs" .alignment=${alignment} .type=${type} ?show-tabs-bottom-line=${otherProps['show-tabs-bottom-line']}>
      <sc-tab slot="nav" panel="tab1"> JPY </sc-tab>
      <sc-tab slot="nav" panel="tab2" active> SDG </sc-tab>
      <sc-tab slot="nav" panel="tab3"> USD </sc-tab>
      <sc-tab slot="nav" panel="tab4"> TEST </sc-tab>
      <sc-tab-panel name="tab1">JPY content</sc-tab-panel>
      <sc-tab-panel name="tab2">SDG content</sc-tab-panel>
      <sc-tab-panel name="tab3">USD content</sc-tab-panel>
      <sc-tab-panel name="tab4">Test content</sc-tab-panel>
    </sc-tab-group>
  `;

export const Segmented = SegmentedTemplate.bind({});
Segmented.args = {
  alignment: 'left',
  type: 'segmented',
};
