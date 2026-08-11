import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Grid/Grid Column',
  component: 'sc-grid-column',
  parameters: {
    docs: {
      description: {
        component:
          `Columns are used to organize and align grid items vertically within the grid container. <br />
          To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
          Then add ScGridStyle into static css, static styles = css\`$\{ScGridStyle\}\`;`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    auto: {
      control: 'boolean',
      description: 'Sets the column to auto width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-1': {
      control: 'boolean',
      description: 'Sets the column’s width to 1/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-2': {
      control: 'boolean',
      description: 'Sets the column’s width to 2/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-3': {
      control: 'boolean',
      description: 'Sets the column’s width to 3/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-4': {
      control: 'boolean',
      description: 'Sets the column’s width to 4/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-5': {
      control: 'boolean',
      description: 'Sets the column’s width to 5/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-6': {
      control: 'boolean',
      description: 'Sets the column’s width to 6/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-7': {
      control: 'boolean',
      description: 'Sets the column’s width to 7/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-8': {
      control: 'boolean',
      description: 'Sets the column’s width to 8/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-9': {
      control: 'boolean',
      description: 'Sets the column’s width to 9/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-10': {
      control: 'boolean',
      description: 'Sets the column’s width to 10/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-11': {
      control: 'boolean',
      description: 'Sets the column’s width to 11/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'col-12': {
      control: 'boolean',
      description: 'Sets the column’s width to 12/12',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    xs: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in xs screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    sm: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in sm screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    md: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in md screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    lg: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in lg screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    xl: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in xl screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    xxl: {
      control: 'inline-radio',
      options: [
        'auto',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
      ],
      description: 'Sets the column’s width in xxl screen',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'text',
      description: 'Grid column text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
  },
  args: {
    auto: false,
    'col-1': false,
    'col-2': false,
    'col-3': false,
    'col-4': false,
    'col-5': false,
    'col-6': false,
    'col-7': false,
    'col-8': false,
    'col-9': false,
    'col-10': false,
    'col-11': false,
    'col-12': false,
    xs: '',
    sm: '',
    md: '',
    lg: '',
    xl: '',
    xxl: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  auto?: boolean;
  'col-1'?: boolean;
  'col-2'?: boolean;
  'col-3'?: boolean;
  'col-4'?: boolean;
  'col-5'?: boolean;
  'col-6'?: boolean;
  'col-7'?: boolean;
  'col-8'?: boolean;
  'col-9'?: boolean;
  'col-10'?: boolean;
  'col-11'?: boolean;
  'col-12'?: boolean;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  xxl?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-grid-container>
    <sc-grid-row>
      <sc-grid-column
        style="border:1px solid #0473EA;"
        ?auto=${props.auto}
        col-1=${props['col-1']}
        col-2=${props['col-2']}
        ?col-3=${props['col-3']}
        ?col-4=${props['col-4']}
        ?col-5=${props['col-5']}
        ?col-6=${props['col-6']}
        ?col-7=${props['col-7']}
        ?col-8=${props['col-8']}
        ?col-9=${props['col-9']}
        ?col-10=${props['col-10']}
        ?col-11=${props['col-11']}
        ?col-12=${props['col-12']}
        xs=${props['xs']}
        sm=${props['sm']}
        md=${props['md']}
        lg=${props['lg']}
        xl=${props['xl']}
        xxl=${props['xxl']}
      >
        ${props.slot}
      </sc-grid-column>
      <sc-grid-column
        style="border:1px solid #0473EA;background-color:#E5E5E5;"
        auto
        >Auto column</sc-grid-column
      >
    </sc-grid-row>
  </sc-grid-container>
`;

const TemplateMulti: Story<ArgTypes> = ({}) => html`
  <sc-grid-container>
    <sc-grid-row>
      <sc-grid-column
        xs="12"
        sm="4"
        md="4"
        lg="4"
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 1</sc-grid-column
      >
      <sc-grid-column
        xs="12"
        sm="3"
        md="3"
        lg="3"
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 2</sc-grid-column
      >
      <sc-grid-column
        auto
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 3</sc-grid-column
      >
    </sc-grid-row>
    <sc-grid-row>
      <sc-grid-column
        xs="12"
        sm="3"
        md="3"
        lg="3"
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 1</sc-grid-column
      >
      <sc-grid-column
        xs="12"
        sm="4"
        md="4"
        lg="4"
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 2</sc-grid-column
      >
      <sc-grid-column
        auto
        style="border:1px solid var(--sc-color-white);background-color:var(--sc-color-blue-lighter)"
        >Col 3</sc-grid-column
      >
    </sc-grid-row>
  </sc-grid-container>
`;

export const Default = Template.bind({});
Default.args = {
  auto: true,
  slot: html`Column`,
};

export const MultiColumns = TemplateMulti.bind({});
MultiColumns.args = {};
