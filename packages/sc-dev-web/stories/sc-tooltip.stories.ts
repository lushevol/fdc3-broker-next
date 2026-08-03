import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Tooltip',
  component: 'sc-tooltip',
  parameters: {
    docs: {
      description: {
        component:
          'Tooltips display additional information based on a specific action.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    header: {
      control: 'text',
      description:
        'Sets the tooltip header.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    content: {
      control: 'text',
      description:
        'Sets the tooltip content.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    placement: {
      control: 'inline-radio',
      description:
        'The preferrred placement of the tooltip.',
      options: ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end', 'left-start', 'left', 'left-end', 'right-start', 'right', 'right-end'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Attributes',
      },
    },
    mode: {
      control: 'inline-radio',
      description:
        'The mode of the tooltip.',
      options: ['dark', 'light', 'success', 'warning', 'error', 'primary'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'dark' },
        category: 'Attributes',
      },
    },
    distance: {
      control: 'number',
      description:
        'The distance in pixels from which to offset the tooltip away from its target.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 10 },
        category: 'Attributes',
      },
    },
    skidding: {
      control: 'number',
      description:
        'The distance in pixels from which to offset the tooltip along from its target.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    trigger: {
      control: 'inline-radio',
      description:
        'Controls how the tooltip is activated. Multiple option can be passed by separating them with a space.',
      options: ['click', 'hover', 'manual'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'click' },
        category: 'Attributes',
      },
    },
    'content-max-width': {
      control: 'text',
      description:
        'the maximum width of the tooltip before its content will wrap.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '144px' },
        category: 'Attributes',
      },
    },
    open: {
      control: 'boolean',
      description: 'Sets to open and show tooltip.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hover-show-delay': {
      control: 'number',
      description:
        'Millisecond delay before showing the tooltip when hovering',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    'hover-hide-delay': {
      control: 'number',
      description:
        'Millisecond delay before hiding the tooltip when hovering',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 150 },
        category: 'Attributes',
      },
    },
    hoist: {
      control: 'boolean',
      description: 'It will be clipped if it\'s inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tooltip so it won\'t show when triggered.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'slot[name=\'content\']': {
      control: 'text',
      description: 'Sets to customize the tooltip content.',
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
  },
  args: {
    content: 'top',
    placement: 'top',
    mode: 'dark',
    distance: 10,
    skidding: 0,
    trigger: 'click',
    'content-max-width': '144px',
    'hover-show-delay': 0,
    'hover-hide-delay': 150,
    open: false,
    hoist: false,
    disabled: false,
    'slot[name=\'content\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  className?: string;
  header?: string;
  content?: string;
  placement?: string;
  mode?: string;
  distance?: number;
  skidding?: number;
  trigger: string;
  'content-max-width'?: string;
  'hover-show-delay': number;
  'hover-hide-delay': number;
  open?: boolean;
  hoist?: boolean;
  disabled?: boolean;
  'slot[name=\'content\']': TemplateResult;
  slot: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const handleClick = () => {
    const tooltip: any = document.querySelector('.manual');

    if (tooltip) {
      tooltip.open = !tooltip.open;
    }
  };

  const renderManualTrigger = (trigger: string) => {
    if (trigger !== 'manual') return;

    return html`
      <span style="padding: 0 30px"></span>
      <sc-button class="tooltip-trigger" size="md" @click=${handleClick}
        >Toggle tooltip</sc-button
      >
    `;
  };

  return html`
    <div style="padding: 50px 150px; position:relative;">
      <sc-tooltip
        class=${`${props.className ?? ''} manual-tooltip`}
        header=${props.header}
        content=${props.content}
        placement=${props.placement}
        mode=${props.mode}
        ?disabled=${props.disabled}
        distance=${props.distance}
        skidding=${props.skidding}
        trigger=${props.trigger}
        content-max-width=${props['content-max-width']}
        hover-show-delay=${props['hover-show-delay']}
        hover-hide-delay=${props['hover-hide-delay']}
        ?open=${props.open}
        ?hoist=${props.hoist}
      >      
        <sc-icon name="info-circle--line" size="md" compact></sc-icon>
        <div slot="content">
          ${props['slot[name=\'content\']']
    ? props['slot[name=\'content\']']
    : props.content
}
        </div>
      ${props.slot}
      </sc-tooltip>
      ${renderManualTrigger(props.trigger)}
    </div>
  `;
};

const HTMLTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <div style="padding: 50px 150px; position:relative;">
      <sc-tooltip
        class=${`${props.className ?? ''} manual-tooltip`}
        header=${props.header}
        content=${props.content}
        placement=${props.placement}
        ?disabled=${props.disabled}
        distance=${props.distance}
        skidding=${props.skidding}
        trigger=${props.trigger}
        content-max-width=${props['content-max-width']}
        hover-show-delay=${props['hover-show-delay']}
        hover-hide-delay=${props['hover-hide-delay']}
        ?open=${props.open}
        ?hoist=${props.hoist}
      >      
        <div slot="content">
            I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!
        </div>
        <sc-icon name="info-circle--line" size="md" compact> </sc-icon>
      </sc-tooltip>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  placement: 'top',
  header: 'Action required',
  content: 'Morbi bibendum enim elementum a auctor.',
};

export const BottomPlacement = Template.bind({});
BottomPlacement.args = {
  placement: 'bottom',
  content: 'Morbi bibendum enim elementum a auctor.',
};

export const LeftPlacement = Template.bind({});
LeftPlacement.args = {
  placement: 'left',
  content: 'Morbi bibendum enim elementum a auctor.',
  trigger: 'hover',
};

export const RightPlacement = Template.bind({});
RightPlacement.args = {
  placement: 'right',
  content: 'Morbi bibendum enim elementum a auctor.',
  trigger: 'hover',
};

export const Manual = Template.bind({});
Manual.args = {
  className: 'manual',
  placement: 'top',
  content: 'Morbi bibendum enim elementum a auctor.',
  trigger: 'manual',
};

export const Disabled = Template.bind({});
Disabled.args = {
  content: 'Morbi bibendum enim elementum a auctor.',
  disabled: true,
};

export const HTMLTooltip = HTMLTemplate.bind({});
HTMLTooltip.args = {
  placement: 'right',
};

const HoistTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <div style="padding: 10px; position:relative; border: 1px solid #000; overflow: hidden">
      <sc-tooltip
        class=${`${props.className ?? ''} manual-tooltip`}
        header=${props.header}
        content=${props.content}
        placement=${props.placement}
        ?disabled=${props.disabled}
        distance=${props.distance}
        skidding=${props.skidding}
        trigger=${props.trigger}
        content-max-width=${props['content-max-width']}
        hover-show-delay=${props['hover-show-delay']}
        hover-hide-delay=${props['hover-hide-delay']}
        ?open=${props.open}
        ?hoist=${props.hoist}
      >      
        <div slot="content">
            I'm not <strong>just</strong> a tooltip, I'm a <em>tooltip</em> with HTML!
        </div>
        <sc-icon name="info-circle--line" size="md" compact> </sc-icon>
      </sc-tooltip>
    </div>
  `;
};

export const Hoist = HoistTemplate.bind({});
Hoist.args = {
  hoist: true,
};

