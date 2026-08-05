import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';
import { ifDefined } from 'lit/directives/if-defined.js';

function handleCustomEvent(e: Event) {
  console.log(e);
  console.log((e as CustomEvent).detail);
}

export default {
  title: 'Components/SearchField',
  component: 'sc-search-field',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The value of search field.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      description: 'The preferrred field size.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Attributes',
      },
    },
    'show-suggestion': {
      control: 'boolean',
      description:
        'Sets to show the suggestion when input value\'s length >= threshold.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    threshold: {
      control: 'number',
      description:
        'Sets to control the mininum value length to show the suggestion.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 3 },
        category: 'Attributes',
      },
    },
    hoist: { 
      control: 'boolean',
      description: 'Search panels will be clipped if they’re inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.', // eslint-disable-line
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'empty-text': {
      control: 'text',
      description:
        'Sets to customize the empty text if there is no suggestion result.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'No data found' },
        category: 'Attributes',
      },
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder of search field.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    readonly: {
      control: 'boolean',
      description: 'Sets the search field as readonly.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'max-rows': { 
      control: 'boolean', 
      description: 'Set to show a maximum number of rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'readonly', eq: true },
    },
    'readonly-rows': { 
      control: 'number',
      description: 'Maximum number of rows allowed in readonly state.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'max-rows', eq: true },
    },
    disabled: {
      control: 'boolean',
      description: 'Sets to disable search field.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    clearable: { 
      control: 'boolean',
      description: 'Sets to allow user to clear the value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    error: {
      control: 'boolean',
      description: 'Sets to display error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'error-message': {
      control: 'text',
      description: 'Sets the error message.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'error', eq: true },
    },
    ...truncateArgType(),
    'display-raw-value': {
      control: 'boolean',
      description: 'Sets `value` as the text displayed when selecting from the dropdrown.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'sc-input': {
      description:
        'Emitted when the control receives input. Get the input content by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-search': {
      description:
        'Emitted when click the search icon or press Enter. Get the latest input value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    updateSuggestions: {
      control: false,
      description:
        `A method to dynamically update the list of suggestions. It accepts an array of 
          SuggestionOption objects,
          where each object contains a \`value\` and an optional \`displayValue\` (string or function).`,
      table: {
        type: { summary: '(suggestions: SuggestionOption[]) => void' },
        category: 'Methods',
      },
    },
    'slot[name=\'error\']': {
      control: 'text',
      description: 'Sets to customize the error message.',
      table: {
        category: 'Slots',
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
    value: '',
    size: 'lg',
    'show-suggestion': false,
    threshold: 3,
    placeholder: '',
    'empty-text': 'No data found',
    readonly: false,
    'max-rows': false,
    'readonly-rows': 5,
    disabled: false,
    clearable: false,
    truncate: false,
    hoist: false,
    'display-raw-value': false,
    error: false,
    'slot[name=\'error\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

const handleInput = (event: any) => {
  const searchField: any = document.querySelector('.sc-search-field');
  const v = event.detail.value;
  const suggestions = [
    { displayValue: 'Hi, I am speaking English', value: 'English' },
    { displayValue: '你好，我在说普通话', value: 'Mandarin' },
    { displayValue: 'नमस्ते, मैं हिंदी बोल रहा हूँ', value: 'Hindi' },
    { displayValue: 'Hola, estoy hablando español', value: 'Spanish' },
    { displayValue: 'Salut, je parle français', value: 'French' },
  ];
  const escapeRegExp = (text: string) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const list = suggestions.filter(option =>
    new RegExp(`(${escapeRegExp(v ?? '')})`, 'ig').test(option.displayValue) ||
    new RegExp(`(${escapeRegExp(v ?? '')})`, 'ig').test(option.value)
  );
  searchField.addEventListener('sc-search', (event: any) => {
    console.log('sc-search', event.detail.value);
  });
  setTimeout(() => {
    searchField?.updateSuggestion(
      list.map(listItem => ({
        value: listItem.value,
        displayValue: listItem.displayValue,
      }))
    );
  }, 3000);
};

interface ArgTypes {
  placeholder: string;
  value: string;
  'show-suggestion': boolean;
  'empty-text': boolean;
  threshold: number;
  readonly: boolean;
  'max-rows'?: boolean;
  'readonly-rows'?: number;
  disabled: boolean;
  clearable: boolean;
  truncate: boolean;
  size?: string;
  hoist: boolean;
  'display-raw-value': boolean;
  error: boolean;
  'error-message'?: string;
  'slot[name=\'error\']': TemplateResult;
}

const Template: Story<ArgTypes> = props => html`
  <sc-search-field
    class="sc-search-field"
    empty-text=${props['empty-text'] || 'No data found'}
    placeholder=${props.placeholder}
    ?show-suggestion=${props['show-suggestion']}
    .threshold=${props.threshold}
    .value=${props.value}
    .size=${props.size}
    ?readonly=${props.readonly}
    ?max-rows=${props['max-rows']} 
    readonly-rows=${props['readonly-rows']} 
    ?disabled=${props.disabled}
    ?clearable=${props.clearable}
    ?truncate=${props.truncate}
    ?hoist=${props.hoist}
    @sc-input=${handleInput}
    ?display-raw-value=${props['display-raw-value']}
    ?error=${props.error}
    error-message=${ifDefined(props['error-message'])}
    @sc-clear=${handleCustomEvent}
  >
  
  ${props['slot[name=\'error\']']
      ? html`
              <div slot="error">${props['slot[name=\'error\']']}</div>
            ` 
      : '' 
}
  </sc-search-field>

  <script type="module">
    const searchFieldSuggestion = document.querySelector(
      '.sc-search-field-suggestion'
    );
    searchFieldSuggestion.addEventListener('sc-input', event => {
      let v = event.detail.value;

      const suggestions = ['English', 'Mandarin', 'Hindi', 'Spanish', 'French', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam condimentum scelerisque sodales. Morbi euismod tempor nunc vitae maximus. Nunc vel nulla lectus. In porta consectetur arcu. Donec in ornare purus, vitae imperdiet justo. Mauris sit amet lacinia enim. Mauris non libero nec turpis venenatis semper. Pellentesque hendrerit eros at urna posuere, dignissim dignissim tellus dapibus.'];

      const escapeRegExp = text =>
        text.replace(/[-[]{}()*+?.,\\^$|#s]/g, '\\$&');

      const list = suggestions.filter(s => {
        return new RegExp(escapeRegExp(v ?? ''), 'ig').test(s);
      });
      setTimeout(() => {
        searchFieldSuggestion.updateSuggestion(
          list.map(l => ({
            value: l,
            displayValue: l,
          }))
        );
      }, 3000);
    });
    searchFieldSuggestion.addEventListener('sc-search', event => {
      console.log('sc-search', event.detail.value);
    });

    /**
     * <sc-search-field
     * class="sc-search-field"
     * empty-text="No data found"
     * show-suggestion
     * ></sc-search-field>
     */
  </script>
`;

export const Default = Template.bind({});
