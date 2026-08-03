import { html, TemplateResult } from 'lit';
import '@scdevkit/webkit-ext';

const tourSteps = [
  {
    element: '#tour-step-1',
    popover: {
      title: 'Welcome',
      description: 'This tour highlights the main workflow entry points in the page.',
    },
  },
  {
    element: '#tour-step-2',
    popover: {
      title: 'Next action',
      description: 'Use this area to continue the business process after review.',
    },
  },
];

export default {
  title: 'Business Components/Tour',
  component: 'sc-tour',
  parameters: {
    docs: {
      description: {
        component:
          'Tour component that guides users through a flow with highlighted steps and popovers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    autostart: {
      control: 'boolean',
      description: 'Start the tour automatically after the component is rendered.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    steps: {
      control: 'object',
      description: 'Array of steps used by the tour driver.',
      table: {
        type: { summary: 'DriveStep[] | string' },
        category: 'Attributes',
      },
    },
    'enable-reminder': {
      control: 'boolean',
      description: 'Show the reminder affordance in the tour popover.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
  },
  args: {
    autostart: true,
    steps: tourSteps,
    'enable-reminder': true,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface Args {
  autostart: boolean;
  steps: typeof tourSteps;
  'enable-reminder': boolean;
}

const Template: Story<Args> = (props: Args) => html`
  <style>
    .tour-story {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--sc-color-grey-50), var(--sc-color-white));
      min-height: 24rem;
      align-items: start;
    }

    .tour-card {
      border: 1px solid var(--sc-color-grey-150);
      border-radius: 0.75rem;
      background: var(--sc-color-white);
      padding: 1.25rem;
      box-shadow: 0 10px 30px rgba(82, 83, 85, 0.08);
    }

    .tour-card h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: var(--sc-color-blue-900);
    }

    .tour-card p {
      margin: 0;
      color: var(--sc-color-grey-700);
      line-height: 1.5;
    }

    .tour-card + .tour-card {
      margin-top: 0.75rem;
    }
  </style>

  <div class="tour-story">
    <div>
      <div id="tour-step-1" class="tour-card">
        <h3>Workspace overview</h3>
        <p>This card acts as the first tour target and introduces the workflow.</p>
      </div>

      <div id="tour-step-2" class="tour-card">
        <h3>Primary action</h3>
        <p>This card is the second tour target and represents the key action area.</p>
      </div>
    </div>

    <sc-tour
      .steps=${props.steps}
      ?autostart=${props.autostart}
      ?enable-reminder=${props['enable-reminder']}
    ></sc-tour>
  </div>
`;

export const Default = Template.bind({});
Default.args = {};