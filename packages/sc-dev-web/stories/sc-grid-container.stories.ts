import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Grid/Grid Container',
  component: 'sc-grid-container',
  parameters: {
    docs: {
      description: {
        component:
          `Container is the parent element that contains all the items (rows and columns) within the grid system. <br />
          To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
          Then add ScGridStyle into static css, static styles = css\`$\{ScGridStyle\}\`;`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fluid: {
      control: 'boolean',
      description: 'Sets to change the container to fluid mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'text',
      description: 'Grid container text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
  },
  args: {
    fluid: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  fluid?: boolean;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-grid-container
    ?fluid=${props.fluid}
    style="border:1px solid #0473EA;margin-bottom:5px;padding:5px"
  >
    ${props.slot}
  </sc-grid-container>
`;

export const Default = Template.bind({});
Default.args = {
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Fluid = Template.bind({});
Fluid.args = {
  fluid: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};
