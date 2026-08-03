import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Breadcrumb/Breadcrumb',
  component: 'sc-breadcrumb',
  parameters: {
    docs: {
      description: {
        component:
          `A breadcrumb is a list of links that help visualize navigation location,
          it allows navigation up to any of the ancestors.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    compressed: {
      control: 'boolean',
      description: 'Set breadcrumb in compressed view.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    fill: {
      control: 'boolean',
      description: 'Set breadcrumb UI mode to fill.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'slot[name=\'separator\']': {
      control: 'text',
      description: 'Sets to customize the separator.',
      table: {
        category: 'Slots',
      },
    },
    'sc-action': {
      description:
        'Emitted when clicking on breadcrumb. Get the interacted element by event.detail.target',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    compressed: false,
    fill: false,
    'slot[name=\'separator\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  compressed?: boolean;
  fill?: boolean,
  'slot[name=\'separator\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-breadcrumb
      ?compressed=${props.compressed}
      ?fill=${props.fill}
    >
      ${props['slot[name=\'separator\']']
    ? html`<div slot="separator">${props['slot[name=\'separator\']']}</div>`
    : ''
}
      <sc-breadcrumb-item href="#" target="_blank">Home</sc-breadcrumb-item>
      <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
      <sc-breadcrumb-item>Web Design</sc-breadcrumb-item>
      <sc-breadcrumb-item>Web Develop</sc-breadcrumb-item>
      <sc-breadcrumb-item>Web Testing</sc-breadcrumb-item>
      <sc-breadcrumb-item>Color</sc-breadcrumb-item>
    </sc-breadcrumb>
  `;
};

const CustomTemplate: Story<ArgTypes> = ({ compressed = false }: ArgTypes) =>
  html`
    <sc-breadcrumb .compressed=${compressed}>
      <sc-icon slot="separator" name="arrow-forward" compact></sc-icon>
      <sc-breadcrumb-item href="#" target="_blank">
        <sc-icon slot="prefix" name="home--line" compact></sc-icon>
        Home
      </sc-breadcrumb-item>
      <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
      <sc-breadcrumb-item>
        Color
        <sc-icon slot="suffix" name="alert-circle--line" compact></sc-icon>
      </sc-breadcrumb-item>
    </sc-breadcrumb>
  `;

  const CustomEventTemplate: Story<ArgTypes> = (props: ArgTypes) => {
    return html`
      <sc-breadcrumb
        class="sc-breadcrumb"
        ?compressed=${props.compressed}
        ?fill=${props.fill}
      >
        <sc-breadcrumb-item>Home</sc-breadcrumb-item>
        <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
        <sc-breadcrumb-item>Web Design</sc-breadcrumb-item>
        <sc-breadcrumb-item>Web Develop</sc-breadcrumb-item>
        <sc-breadcrumb-item>Web Testing</sc-breadcrumb-item>
        <sc-breadcrumb-item>Color</sc-breadcrumb-item>
      </sc-breadcrumb>
      <script type="module">
      /**
        * When you want to customize action based on the click action please do not set the href for the sc-breadcrumb-item;
        * use sc-action event to customize the action
        *
        * <sc-breadcrumb @sc-action=\${this.handleClick}>
        * <sc-breadcrumb-item>Home</sc-breadcrumb-item>
        * <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
        * <sc-breadcrumb-item>Web Testing</sc-breadcrumb-item>
        * <sc-breadcrumb-item>Color</sc-breadcrumb-item>
        * </sc-breadcrumb>
        *
        *
        */
      this.handleClick(event){
        console.log('sc-action', event.detail.value);
      }
    </script>
    `;
  };
export const Default = Template.bind({});
Default.args = {};

export const Compressed = Template.bind({});
Compressed.args = {
  compressed: true,
};

export const Fill = Template.bind({});
Fill.args = {
  fill: true,
};


export const Custom = CustomTemplate.bind({});
Custom.args = {};


export const CustomEvent = CustomEventTemplate.bind({});
CustomEvent.args = {};
