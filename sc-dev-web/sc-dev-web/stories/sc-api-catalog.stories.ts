import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormArgTypes } from './utils/FormArg.js';
import { Provider } from './utils/Provider.js';

const formArgs = FormArgTypes() as any;
delete formArgs.truncate;
delete formArgs.clearable;
delete formArgs['border-type'];
delete formArgs['max-rows'];
delete formArgs['readonly-rows'];

export default {
  title: 'Business Components/API Catalog',
  component: 'sc-api-catalog',
  parameters: {
    docs: {
      description: {
        component:
          'API Catalog allows users to search and select API endpoints.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...formArgs,
    value: {
      control: 'object',
      description: 'API Catalog selected value.',
      table: {
        type: {
          summary: `{${[
            'artifactId: string,',
            'path: string',
            'method: string',
          ].join('\n')}}`,
        },
        category: 'Properties',
      },
    },
    'api-placeholder': { 
      control: 'text',
      description: 'Sets the API search placeholder text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'end-pt-placeholder': { 
      control: 'text',
      description: 'Sets the end point search placeholder text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'sc-select': {
      description: 'Emitted when and API endpoint is selected',
      table: {
        type: {
          summary:
            'CustomEvent<{ artifactId: string; path: string; method: string }>',
        },
        category: 'Custom Events',
      },
    },
    'sc-clear': {
      description: 'Emitted when clear content.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    label: 'API End Point',
    'label-size': undefined,
    tooltip: undefined,
    'tooltip-placement': undefined,
    hint: undefined,
    'hint-placement': undefined,
    placeholder: 'Select API',
    'api-placeholder': undefined,
    'end-pt-placeholder': undefined,
    'help-text': undefined,
    value: undefined,
    required: false,
    readonly: false,
    disabled: false,
    success: false,
    error: false,
    'success-message': undefined,
    'error-message': undefined,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  value: string;
  placeholder: string;
  'api-placeholder': string;
  'end-pt-placeholder': string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  console.log('props', props);
  return html`
  <div style="min-width: 400px; min-height: 80dvh">
    ${Provider(html`
      <sc-api-catalog
        .value=${props.value}
        label=${ifDefined(props.label)}
        label-size=${ifDefined(props['label-size'])}
        placeholder=${ifDefined(props.placeholder)}
        api-placeholder=${ifDefined(props['api-placeholder'] || undefined)}
        end-pt-placeholder=${ifDefined(props['end-pt-placeholder'] || undefined)}
        tooltip=${ifDefined(props.tooltip)}
        tooltip-placement=${ifDefined(props['tooltip-placement'] || undefined)}
        hint=${ifDefined(props.hint)}
        hint-placement=${ifDefined(props['hint-placement'] || undefined)}
        help-text=${ifDefined(props['help-text'])}
        ?required=${props.required}
        ?disabled=${props.disabled}
        ?error=${!!props.error}
        ?success=${!!props.success}
        success-message=${ifDefined(props['success-message'] || undefined)}
        error-message=${ifDefined(props['error-message'] || undefined)}
        ?readonly=${props.readonly}
        @sc-select=${(e: CustomEvent) => {
      console.log('API selected:', e.detail);
    } }
      ></sc-api-catalog>
    `)}
  </div>
`;
};

export const Default = Template.bind({});
Default.args = {};
