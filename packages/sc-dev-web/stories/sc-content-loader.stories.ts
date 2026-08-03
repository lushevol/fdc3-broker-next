import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Content Loader',
  component: 'sc-content-loader',
  parameters: {
    docs: {
      description: {
        component: 'Content loaders are used to entertain the user while they wait for a longer operation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['circle', 'line', 'rectangle', 'square'],
      description: 'Sets the preferred loader type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'line' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'text',
      description: 'The preferred height of content loader.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '16px' },
        category: 'Attributes',
      },
    },
    radius: {
      control: 'inline-radio',
      description: 'The preferred radius of content loader. Not applicable for circle.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'none'],
    },
  },
  args: {
    type: 'line',
    height: '16px',
    radius: 'sm',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type: string;
  height: string;
  radius: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-content-loader
    type=${props.type}  
    height=${props.height}
    radius=${props.radius}
  ></sc-content-loader>
`;

const CombineTemplate: Story<ArgTypes> = () => html`
  <div style="display:flex;">
    <sc-content-loader type='circle' height="60px"></sc-content-loader>
    <div style="display:flex;flex-direction:column;width:30%;margin:0 10px;">
        <sc-content-loader height="10px" radius="none"></sc-content-loader>
        <sc-spacer vertical> </sc-spacer>
        <sc-content-loader height="10px" radius="none"></sc-content-loader>
        <sc-spacer vertical> </sc-spacer>        
        <sc-content-loader height="25px" radius="none"></sc-content-loader>
    </div>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
};

export const Circle = Template.bind({});
Circle.args = {
  type: 'circle',
  height: '50px',
};

export const Rectangle = Template.bind({});
Rectangle.args = {
  type: 'rectangle',
  height: '16px',
};

export const Square = Template.bind({});
Square.args = {
  type: 'square',
  height: '50px',
};

export const Combine = CombineTemplate.bind({});
Combine.args = {};