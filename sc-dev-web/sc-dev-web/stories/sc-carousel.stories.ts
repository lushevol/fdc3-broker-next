import { html, TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

export default {
  title: 'Components/Carousel',
  component: 'sc-carousel',
  tags: ['autodocs'],
  argTypes: {
    pagination: {
      control: 'boolean',
      description: 'Sets to show the pagination.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    autoplay: {
      control: 'boolean',
      description: 'Sets to autoplay the carousel.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    loop: {
      control: 'boolean',
      description: 'By default, the carousel will not advanced beyond the first and last slides. You can change this behavior and force the carousel to “wrap” with the loop attribute.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    navigation: {
      control: 'boolean',
      description: 'Sets to show the navigation arrows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  pagination?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  navigation?: boolean;
  items: object;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
  <div style="width: 400px; height: 300px">
  ${
    keyed(props, html`
      <sc-carousel
        ?pagination=${props.pagination}
        ?navigation=${props.navigation}
        ?autoplay=${props.autoplay}
        ?loop=${props.loop}
      >
        <sc-carousel-item>
          <img src="images/illustration.png">
        </sc-carousel-item>
        <sc-carousel-item>
          <img src="images/presentation.svg">
        </sc-carousel-item>
        <sc-carousel-item>
          <sc-card>
            Hello world
          </sc-card>
        </sc-carousel-item>
      </sc-carousel>
    `)
  }
  </div>
  `;

export const Default = Template.bind({});
Default.args = {
  pagination: true,
};

export const Autoplay = Template.bind({});
Autoplay.args = {
  pagination: true,
  autoplay: true,
  loop: true,
};

export const Navigation = Template.bind({});
Navigation.args = {
  pagination: true,
  navigation: true,
};
