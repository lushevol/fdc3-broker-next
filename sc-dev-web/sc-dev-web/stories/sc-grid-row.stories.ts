import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Grid/Grid Row',
  component: 'sc-grid-row',
  parameters: {
    docs: {
      description: {
        component:
          `Rows are used to organize and align grid items horizontally across the grid container. <br />
          To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
          Then add ScGridStyle into static css, static styles = css\`$\{ScGridStyle\}\`;`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'no-gutters': {
      control: 'boolean',
      description: 'Sets to change the row with no gutters',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'text',
      description: 'Grid row text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
  },
  args: {
    'no-gutters': false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  'no-gutters'?: boolean;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-grid-row
    ?no-gutters=${props['no-gutters']}
    style="border:1px solid #0473EA;margin-bottom:5px;padding:5px"
  >
    ${props.slot}
  </sc-grid-row>
  <sc-grid-row
    ?no-gutters=${props['no-gutters']}
    style="border:1px solid #0473EA;margin-bottom:5px;padding:5px"
  >
    ${props.slot}
  </sc-grid-row>
`;

export const Default = Template.bind({});
Default.args = {
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const NoGutters = Template.bind({});
NoGutters.args = {
  'no-gutters': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};
