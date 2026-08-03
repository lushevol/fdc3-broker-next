/* eslint-disable indent */
import type { StoryFn } from '@storybook/web-components';
import { html } from 'lit';
import { ScButtonDropdown } from '../src/components/ScButton/ScButtonDropdown.js';
import { truncateArgType } from './utils/ArgTypes.js';

const dropdownData = [
  {
    label: 'label 1',
    value: 'value 1',
  },
  {
    label: 'label 2',
    value: 'value 2',
  },
  {
    label: 'label 3',
    value: 'value 4',
  },
];

export default {
  title: 'Components/Button/Button Dropdown',
  component: 'sc-button-dropdown',
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'array',
      description: 'Set to render virtual list.',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: undefined },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'text', 'link'],
      description: 'Sets the button type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'secondary' },
        category: 'Attributes',
      },
    },
    state: {
      control: 'inline-radio',
      options: ['default', 'error'],
      description: 'Sets the button state.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    updateButtonText: {
      name: 'update-button-text',
      control: 'boolean',
      description: 'Enable to sync button text with selected item',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    float: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'Align menu w.r.t button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets the button size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    noPill: {
      name: 'no-pill',
      control: 'boolean',
      description: 'Sets if not round border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    loading: {
      control: 'boolean',
      description: 'Sets if show spinner on button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    loadingText: {
      name: 'loading-text',
      control: 'text',
      description: 'Customize button width.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'loading', eq: true },
    },
    ...truncateArgType(),
    buttonText: {
      name: 'button-text',
      control: 'text',
      description: 'Customized button text. It will not work if you using button slot.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Button' },
        category: 'Attributes',
      },
    },
    emptyText: {
      name: 'empty-text',
      control: 'text',
      description: 'Customized empty text. It will not work if you using empty-text slot.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'No data found' },
        category: 'Attributes',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button dropdown.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    hoist: {
      control: 'boolean',
      description: 'Allow button dropdown break out of the container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    leftIcon: {
      name: 'left-icon',
      control: 'text',
      description: 'Sets the left icon of the dropdown.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    hideTickMark: {
      name: 'hide-tick-mark',
      control: 'boolean',
      description: 'Hides tick mark for selected items',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    slot: {
      name: 'slot',
      description: 'Main content of the dropdown.',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
    emptyTextSlot: {
      name: 'slot[name="empty-text"]',
      description: 'Empty text content.',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
    buttonSlot: {
      name: 'slot[name="button"]',
      description: 'Button content.',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
    'sc-select': {
      description:
        'Emitted when a dropdown option is selected. Get the selected value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    type: 'secondary',
    size: 'sm',
    state: 'default',
    updateButtonText: false,
    buttonText: 'Button',
    emptyText: 'No data found',
    noPill: false,
    loading: false,
    loadingText: '',
    truncate: false,
    disabled: false,
    hoist: false,
    hideTickMark: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Button Dropdowns expose additional content that “drops down” in a panel.',
      },
    },
  },
};

const Template: StoryFn<ScButtonDropdown> = props => {
  return html`
<div style="height: 300px;padding-left:100px;">
    <sc-button-dropdown
        ?hoist=${props.hoist}
        ?update-button-text=${props.updateButtonText}
        button-text=${props.buttonText}
        data=${JSON.stringify(dropdownData)}
        state=${props.state}
        type=${props.type}
        size=${props.size}
        ?no-pill=${props.noPill}
        ?loading=${props.loading}
        loading-text=${props.loadingText}
        ?truncate=${props.truncate}
        ?disabled=${props.disabled}
        float=${props.float}
        left-icon=${props.leftIcon}
        ?hide-tick-mark=${props.hideTickMark}
    >
        <div slot="empty-text">${props.emptyText}</div>
    </sc-button-dropdown>
</div>
<style>
    sc-button-dropdown {
    --sc-dropdown-min-width: 200px;
    --sc-dropdown-menu-margin-top:1rem
    }
</style>
  `;
};

export const Default = Template.bind({});
Default.args = {};

const SlotTemplate: StoryFn<ScButtonDropdown> = props => {
  return html`
<div style="height: 300px;">
    <sc-button-dropdown
        ?hoist=${props.hoist}
        ?update-button-text=${props.updateButtonText}
        button-text=${props.buttonText}
        type=${props.type}
        size=${props.size}
        state=${props.state}
        ?no-pill=${props.noPill}
        ?loading=${props.loading}
        loading-text=${props.loadingText}
        ?truncate=${props.truncate}
        ?disabled=${props.disabled}
        float=${props.float}
        ?hide-tick-mark=${props.hideTickMark}
    >
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="mandarin"
        >Mandarin<sc-link>View more</sc-link></sc-dropdown-option
        >
        <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
        <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
    </sc-button-dropdown>
</div>
  `;
};

export const Slot = SlotTemplate.bind({});
Slot.args = {};
