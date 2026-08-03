import { html, TemplateResult } from 'lit';
import { MainIconLibrary } from '@scdevkit/icons';

export default {
  title: 'Components/Stepper',
  component: 'sc-stepper',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Steppers convey progress through numbered steps.',
      },
    },
    actions: {
      handles: [
        'sc-active-step-changing',
        'sc-active-step-changed',
        'sc-step-click',
        'sc-change',
      ],
    },
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      description: 'The preferred direction of the stepper.',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' },
        category: 'Attributes',
      },
    },
    mode: {
      control: { type: 'inline-radio' },
      options: ['indicator', 'full'],
      description: 'The preffered mode of the stepper.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'full' },
        category: 'Attributes',
      },
    },
    'title-position': {
      control: 'inline-radio',
      options: ['bottom', 'right'],
      description: 'The preferred position of the steps text. Not applicable for vertical stepper.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'bottom' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'full' },
    },
    compact: {
      control: 'boolean',
      description: 'Show stepper in compact mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'min-horizontal-step-width': {
      control: 'text',
      description: 'Horizontal only. Minimum width of each step. When the total width of all steps exceeds the width of the stepper, it will enable the value of `min-horizontal-response` attribute. Accept px, rem & % css values',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '220px' },
        category: 'Attributes',
      },
      if: { arg: 'direction', eq: 'horizontal' },
    },
    'min-horizontal-response': {
      control: 'inline-radio',
      options: ['vertical', 'scroll'],
      description: 'Horizontal only. When the total width of all steps exceeds the width of the stepper, it will enable horizontal scrolling or switch to vertical layout.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'scroll' },
        category: 'Attributes',
      },
      if: { arg: 'direction', eq: 'horizontal' },
    },
    'presence-numbers': {
      control: 'number',
      description: 'The number of steps user wants to see by default. If this number is less than the total number of steps, the expand/collapse function will display. 0 means show all the steps without expand/collapse. Not applicable for horizontal stepper.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    'sc-active-step-changing': {
      description: `Emitted when changing the active step. Get newest index by event.detail.newIndex and
      get last index by event.detail.oldIndex and get the element container by event.detail.owner.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-active-step-changed': {
      description: `Emitted when the active step changes. Get the index by event.detail.index and
      get element container by event.detail.owner.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-change': {
      description: 'Emitted when the expand/collapse feature is enabled and toggled by clicking. Get the expanded status by event.detail.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'slot[name=\'description\']': {
      control: 'text',
      description: 'Sets to customize the description.',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    direction: 'horizontal',
    mode: 'full',
    'title-position': 'bottom',
    compact: false,
    'presence-numbers': 0,
    'min-horizontal-step-width': '220px',
    'min-horizontal-response': 'scroll',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  direction?: 'horizontal' | 'vertical';
  mode?: 'indicator' | 'full';
  'title-position'?: 'bottom' | 'right';
  compact?: boolean;
  'min-horizontal-step-width': string,
  'min-horizontal-response': 'scroll' | 'vertical',
  'presence-numbers'?: number;
  'slot[name=\'description\']'?: TemplateResult;
}

const DefaultTemplate: Story<ArgTypes> = ({
  direction = 'horizontal',
  mode = 'full',
  ...props
}: ArgTypes) => html`
<sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
  <sc-stepper
    direction=${direction}
    mode=${mode}
    title-position=${props['title-position'] ?? 'bottom'}
    presence-numbers=${props['presence-numbers'] ?? '0'}
    ?compact=${props.compact}
    min-horizontal-step-width=${props['min-horizontal-step-width']}
    min-horizontal-response=${props['min-horizontal-response']}
  >
    <sc-step status="finish" title="Step1" time="10 Jan 2025, 08:17AM CST" view-link="https://www.sc.com/en/" show-time show-description show-view>
      <div slot=description>${props['slot[name=\'description\']'] ? props['slot[name=\'description\']'] : 'Step completed.'}</div>
    </sc-step>
    <sc-step status="error" title="Step2" time="24 Feb 2025, 09:00AM CST" description="Step error occurred." view-link="https://www.sc.com/en/" show-time show-description show-view></sc-step>
    <sc-step active title="Step3" description="Step in progress." show-description></sc-step>
    <sc-step title="Step4" description="Step incomplete." view-link="https://www.sc.com/en/" show-description show-view></sc-step>
  </sc-stepper>
</sc-icon-provider>
`;

const FinishTemplate: Story<ArgTypes> = ({
  direction = 'horizontal',
  mode = 'full',
  ...props
}: ArgTypes) => html`
<sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
  <sc-stepper
    direction=${direction}
    mode=${mode}
    title-position=${props['title-position'] ?? 'bottom'}
    presence-numbers=${props['presence-numbers'] ?? '0'}
    ?compact=${props.compact}
    min-horizontal-step-width=${props['min-horizontal-step-width']}
    min-horizontal-response=${props['min-horizontal-response']}
  >
    <sc-step status="finish" title="Line manager" description="Approved" show-description></sc-step>
    <sc-step status="finish" title="Domain head" description="Approved" show-description></sc-step>
    <sc-step status="finish" title="Global head" description="Approved" show-description></sc-step>
    <sc-step status="finish" title="CEO" description="Approved" show-description active></sc-step>
  </sc-stepper>
</sc-icon-provider>
`;

const CustomTemplate: Story<ArgTypes> = ({
  direction = 'horizontal',
  mode = 'full',
  compact,
  ...props
}: ArgTypes) => html`
<sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
  <sc-stepper
    direction=${direction}
    mode=${mode}
    title-position=${props['title-position']}
    presence-numbers=${props['presence-numbers']}
    ?compact=${compact}
  >
    <sc-step status="finish" title="Step1" time="10 Jan 2025, 08:17AM CST" view-link="https://www.sc.com/en/" show-time show-description show-view>
      <div slot=description>
        This is the description by using slot
        <div>Get more details by clicking the show code</div>
      </div>
    </sc-step>
    <sc-step status="error" title="Step2" time="24 Feb 2025, 09:00AM CST" view-link="https://www.sc.com/en/" show-time show-description show-view>
      <div slot=description>
        This is the error step description by using slot
      </div>
    </sc-step>
    <sc-step active title="Step3" show-description>
      <div slot=description>
          This is the in progress step description by using slot
      </div>
    </sc-step>
    <sc-step title="Step4" view-link="https://www.sc.com/en/" show-description show-view>
      <div slot=description>
          This is the incomplete step description by using slot
      </div>
    </sc-step>
  </sc-stepper>
</sc-icon-provider>
`;

const ErrorTemplate: Story<ArgTypes> = ({
  direction = 'horizontal',
  mode = 'full',
  ...props
}: ArgTypes) => html`
<sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
  <sc-stepper
    direction=${direction}
    mode=${mode}
    title-position=${props['title-position'] ?? 'bottom'}
    presence-numbers=${props['presence-numbers'] ?? '0'}
    ?compact=${props.compact}
    min-horizontal-step-width=${props['min-horizontal-step-width']}
    min-horizontal-response=${props['min-horizontal-response']}
  >
    <sc-step status="finish" title="Line manager" description="Approved" show-description></sc-step>
    <sc-step status="error" title="Domain head" description="Rejected" show-description></sc-step>
    <sc-step active title="Global head" description="Unreachable" show-description></sc-step>
    <sc-step title="CEO"></sc-step>
  </sc-stepper>
</sc-icon-provider>
`;

export const Default = DefaultTemplate.bind({});
Default.args = {
  direction: 'horizontal',
  mode: 'full',
};

export const CustomBySlot = CustomTemplate.bind({});
Default.args = {
  direction: 'horizontal',
  mode: 'full',
};

export const Complete = FinishTemplate.bind({});
Complete.args = {
  direction: 'vertical',
  mode: 'full',
  'presence-numbers': 2,
};

export const Error = ErrorTemplate.bind({});
Error.args = {
  direction: 'horizontal',
  mode: 'full',
  'title-position': 'right',
};

export const Indicator = ErrorTemplate.bind({});
Indicator.args = {
  direction: 'horizontal',
  mode: 'indicator',
};

export const IndicatorCompact = ErrorTemplate.bind({});
IndicatorCompact.args = {
  direction: 'horizontal',
  mode: 'indicator',
  compact: true,
};

export const Vertical = ErrorTemplate.bind({});
Vertical.args = {
  direction: 'vertical',
  mode: 'full',
};

export const VerticalCompact = ErrorTemplate.bind({});
VerticalCompact.args = {
  direction: 'vertical',
  mode: 'full',
  compact: true,
};
