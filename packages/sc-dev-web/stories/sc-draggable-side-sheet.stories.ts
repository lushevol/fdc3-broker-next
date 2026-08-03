import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Sheet/Draggable Side Sheet',
  component: 'sc-draggable-side',
  parameters: {
    docs: {
      description: {
        component:
          'Draggable draggable side sheet slide in from a container to expose additional options and information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'The label of the draggable side sheet.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'no-header', neq: true },
    },
    size: { 
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets the preferred size of the draggable side sheet.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xs' },
        category: 'Attributes',
      },
    },    
    width: { 
      control: 'text',
      description: 'Customize the width of the draggable side sheet. If specified, size will be ignored.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    fixed: { 
      control: 'boolean', 
      description: `By default, the draggable side sheet take part of the container's width, 
      this attribute will make it fixed in the container and will not take any width.`,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },      
    'no-header': { 
      control: 'boolean', 
      description: 'Set to hide header on action sheet. Set this to true will remove label and close icon',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize the label.',
      table: {
        category: 'Slots',
      }, 
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-dragging': {
      description: 'Emitted when dragging. Get the width by event.detail.width.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when collapsed. Get the width by event.detail.width.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-show': {
      description: 'Emitted when expanded. Get the width by event.detail.width.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    label: '',
    size: 'xs',
    width: '',
    fixed: false,
    'no-header': false,
    'slot[name=\'label\']': '',    
    slot: '',    
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label?: string;
  size?: string,
  width?: string;
  fixed?: boolean,
  'no-header'?: boolean,
  'slot[name=\'label\']'?: TemplateResult;
  slot?: TemplateResult;  
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {

  return html`
    <div class=container style='display: flex; height: 400px; position: relative;'>
      <div class=left-content style='flex: 1'>Left panel</div>
      <sc-draggable-side-sheet
        label=${props.label}
        size=${props.size}
        width=${props.width}
        ?fixed=${props.fixed}
        ?no-header=${props['no-header']}
      >
        <div slot="label">
          ${props['slot[name=\'label\']'] 
    ? props['slot[name=\'label\']'] 
    : props.label
}
        </div>
        ${props.slot} 
      </sc-draggable-side-sheet>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  label: 'Custom width',
  width: '300px',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Fixed = Template.bind({});
Fixed.args = {
  label: 'Fixed',
  fixed: true,  
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};