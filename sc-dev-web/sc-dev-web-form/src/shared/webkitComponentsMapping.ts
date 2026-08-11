import { PropertyCategories } from './propertyTypes.js';

type COMPONENT_TYPE = {
  [key: string]: COMPONENT_ITEM_TYPE
}

export type COMPONENT_ITEM_TYPE = {
  type?: string;
  icon?: string;
  display?: string[];
  label: string;
  id: string;
  properties?: object;
  settings?: object;
}

const cardCommonProperties = {
  title: {
    type: 'string',
    defaultValue: 'Card title',
    mappingValue: true,
    bindKey: 'title',
  },
  titleSize: {
    type: 'string',
    defaultValue: 'sm',
  },
  subTitle: {
    type: 'string',
    defaultValue: 'Card sub title',
    mappingValue: true,
    bindKey: 'subTitle',
  },
  body: {
    type: 'slot',
    defaultValue: 'Card body',
    mappingValue: true,
    bindKey: 'body',
  },
  bodySize: {
    type: 'string',
    defaultValue: 'sm',
  },
  spaceSize: {
    type: 'string',
    defaultValue: 'sm',
  },
  textAlign: {
    type: 'string',
    defaultValue: 'left',
  },
  direction: {
    type: 'string',
    defaultValue: 'horizontal',
  },
  width: {
    type: 'string',
    defaultValue: '100%',
  },
  height: {
    type: 'string',
    defaultValue: 'Auto',
  },
  icon: {
    type: 'string',
    defaultValue: '',
  },
  iconSize: {
    type: 'string',
  },
  iconAlign: {
    type: 'string',
    defaultValue: 'left',
  },
  iconVerticalAlign: {
    type: 'string',
    defaultValue: 'top',
  },
  hoverHighlight: {
    type: 'boolean',
    defaultValue: true,
  },
  disabled: {
    type: 'boolean',
  },
  noBorder: {
    type: 'boolean',
  },
  clickable: {
    type: 'boolean',
  },
  selected: {
    type: 'boolean',
  },
  noActions: {
    type: 'boolean',
    defaultValue: true,
  },
};
const cardCommonSettings = {
  title: {
    type: 'text-input',
    label: 'Title',
  },
  subTitle: {
    type: 'text-input',
    label: 'Sub title',
  },
  body: {
    type: 'rich-text-editor',
    label: 'Body',
  },
  value: {
    bindKey: [{
      label: 'Title',
      key: 'title',
    },{
      label: 'Sub title',
      key: 'subTitle',
    },{
      label: 'Body',
      key: 'body',
    }],
    category: PropertyCategories.DATABINDING,
  },
  width: {
    type: 'text-input',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Width',
  },
  height: {
    type: 'text-input',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Height',
  },
  titleSize: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Title',
    className: 'text-uppercase',
    options: ['xxs', 'xs', 'sm', 'md', 'lg'],
  },
  bodySize: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Body',
    className: 'text-uppercase',
    options: ['xxs', 'xs', 'sm', 'md', 'lg'],
  },
  spaceSize: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Spacing',
    className: 'text-uppercase',
    options: ['xxs', 'xs', 'sm', 'md', 'lg'],
  },
  iconSize: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Icon size',
    className: 'text-uppercase',
    options: ['xxs', 'xs', 'sm', 'md', 'lg'],
  },
};

const cardCommonSettings_other = {
  iconAlign: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Icon alignment',
    options: ['left', 'center', 'right', 'justify'],
  },
  iconVerticalAlign: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Icon vertical alignment',
    options: ['top', 'middle', 'bottom'],
  },
  direction: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'The direction of the title list.',
    options: ['horizontal', 'vertical'],
  },
  textAlign: {
    type: 'radio-group',
    category: PropertyCategories.STYLINGLAYOUT,
    label: 'Text alignment',
    options: ['left', 'center', 'right', 'justify'],
  },
  clickable: {
    type: 'switch',
    category: PropertyCategories.BEHAVIOR,
    label: 'Clickable',
  },
  disabled: {
    type: 'switch',
    category: PropertyCategories.BEHAVIOR,
    label: 'Disabled',
  },
  selected: {
    type: 'switch',
    category: PropertyCategories.BEHAVIOR,
    label: 'Highlight',
  },
  noBorder: {
    type: 'switch',
    category: PropertyCategories.BEHAVIOR,
    label: 'No border',
  },
  hoverHighlight: {
    type: 'switch',
    category: PropertyCategories.BEHAVIOR,
    label: 'No hover',
    opposite: true,
  },
};

const CardComponentsMapping: COMPONENT_TYPE = {
  'sc-card': {
    type: 'card',
    icon: 'card',
    label: 'Card',
    id: 'card',
    properties: cardCommonProperties,
    settings: {
      ...cardCommonSettings,
      icon: {
        type: 'icon-selector',
        label: 'Icon',
      },
      ...cardCommonSettings_other,
    },
  },
  'sc-check-card': {
    type: 'card',
    icon: 'check-card',
    label: 'Check card',
    id: 'check-card',
    properties: {
      ...cardCommonProperties,
      checked: {
        type: 'boolean',
      },
      layout: {
        type: 'string',
        defaultValue: 'left',
      },
      'sc-change': {
        type: 'event',
        eventKey: 'detail.checked',
        callback: 'onValueChange',
      },
    },
    settings: {
      ...cardCommonSettings,
      icon: {
        type: 'icon-selector',
        label: 'Icon',
      },
      layout: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Checkbox position',
        options: ['left', 'right'],
      },
      iconAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Icon alignment',
        options: ['left', 'center', 'right', 'justify'],
      },
      iconVerticalAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Icon vertical alignment',
        options: ['top', 'middle', 'bottom'],
      },
      direction: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'The direction of the title list.',
        options: ['horizontal', 'vertical'],
      },
      textAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Text alignment',
        options: ['left', 'center', 'right', 'justify'],
      },
      clickable: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Clickable',
      },
      disabled: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Disabled',
      },
      checked: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Highlight',
      },
      noBorder: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'No border',
      },
      hoverHighlight: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'No hover',
        opposite: true,
      },
    },
  },
  'sc-radio-card': {
    type: 'card',
    icon: 'radio-card',
    label: 'Radio card',
    id: 'radio-card',
    properties: {
      ...cardCommonProperties,
      checked: {
        type: 'boolean',
      },
      layout: {
        type: 'string',
        defaultValue: 'left',
      },
      'sc-change': {
        type: 'event',
        eventKey: 'detail.checked',
        callback: 'onValueChange',
      },
    },
    settings: {
      ...cardCommonSettings,
      icon: {
        type: 'icon-selector',
        label: 'Icon',
      },
      layout: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Radio position',
        options: ['left', 'right'],
      },
      iconAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Icon alignment',
        options: ['left', 'center', 'right', 'justify'],
      },
      iconVerticalAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Icon vertical alignment',
        options: ['top', 'middle', 'bottom'],
        limiter: { arg: 'direction', eq: 'horizontal' },
      },
      direction: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'The direction of the title list.',
        options: ['horizontal', 'vertical'],
      },
      textAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Text alignment',
        options: ['left', 'center', 'right', 'justify'],
      },
      clickable: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Clickable',
      },
      disabled: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Disabled',
      },
      checked: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Highlight',
      },
      noBorder: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'No border',
      },
      hoverHighlight: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'No hover',
        opposite: true,
      },
    },
  },
  'sc-icon-card': {
    type: 'card',
    icon: 'icon-card',
    label: 'Icon card',
    id: 'icon-card',
    properties: {
      ...cardCommonProperties,
      icon: {
        type: 'string',
        defaultValue: '',
      },
      mode: {
        type: 'string',
        defaultValue: 'default',
      },
      src: {
        type: 'string',
        defaultValue: 'https://servicebench-sit.global.standardchartered.com/sc-webkit/storybook/images/logo.svg',
      },
      image: {
        type: 'string',
        defaultValue: 'URL',
      },
      imageAlign: {
        type: 'string',
        defaultValue: 'left',
      },
      layout: {
        type: 'string',
        defaultValue: 'content-cover',
      },
      size: {
        type: 'string',
        defaultValue: 'custom',
      },
    },
    settings: {
      ...cardCommonSettings,
      imageAlign: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Image position',
        options: ['left', 'center', 'right', 'justify'],
        limiter: { arg: 'mode', eq: 'default' },
      },
      ...cardCommonSettings_other,
      mode: {
        type: 'radio-group',
        label: 'Icon card mode',
        options: ['default', 'icon'],
      },
      icon: {
        type: 'icon-selector',
        label: 'Icon',
        limiter: { arg: 'mode', eq: 'icon' },
      },
      image: {
        type: 'dropdown-input',
        label: 'Image',
        options: ['Upload', 'URL'],
        limiter: { arg: 'mode', eq: 'default' },
      },
      src: {
        type: 'text-input',
        limiter: [
          { arg: 'image', eq: 'URL' },
          { arg: 'mode', eq: 'default' },
        ],
      },
      upload: {
        type: 'upload-input',
        bindingKey: 'src',
        limiter: [
          { arg: 'image', eq: 'Upload' },
          { arg: 'mode', eq: 'default' },
        ],
      },
    },
  },
  'sc-image-card': {
    type: 'card',
    icon: 'image-card',
    label: 'Image card',
    id: 'image-card',
    properties: {
      ...cardCommonProperties,
      layout: {
        type: 'string',
        defaultValue: 'left',
      },
      image: {
        type: 'string',
        defaultValue: 'URL',
      },
      imageSource: {
        type: 'string',
        defaultValue: '',
      },
      backgroundColor: {
        type: 'string',
        defaultValue: '',
      },
      backgroundPosition: {
        type: 'string',
        defaultValue: '',
      },
      backgroundRepeat: {
        type: 'string',
        defaultValue: '',
      },
      backgroundSize: {
        type: 'string',
        defaultValue: '',
      },
      hoverHighlight: {
        type: 'boolean',
        defaultValue: true,
      },
    },
    settings: {
      ...cardCommonSettings,
      icon: {
        type: 'icon-selector',
        label: 'Icon',
      },
      image: {
        type: 'dropdown-input',
        label: 'Image',
        options: ['Upload', 'URL'],
      },
      imageSource: {
        type: 'text-input',
        limiter: { arg: 'image', eq: 'URL' },
      },
      upload: {
        type: 'upload-input',
        bindingKey: 'imageSource',
        limiter: { arg: 'image', eq: 'Upload' },
      },
      layout: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Image position',
        options: ['left', 'right', 'background'],
      },
      backgroundColor: {
        type: 'dropdown-input',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Background color',
        limiter: { arg: 'layout', eq: 'background' },
      },
      backgroundPosition: {
        type: 'dropdown-input',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Background position',
        options: ['left top', 'left center', 'left bottom', 'center top', 'center center', 'center bottom', 'right top', 'right center', 'right bottom', 'custom'],
        limiter: { arg: 'layout', eq: 'background' },
      },
      backgroundPositionText: {
        type: 'text-input',
        category: PropertyCategories.STYLINGLAYOUT,
        bindingKey: 'backgroundPosition',
        limiter: [
          { arg: 'layout', eq: 'background' },
          { arg: 'backgroundPosition', eq: 'custom' },
        ],
        placeholder: 'left 50%',
      },
      backgroundRepeat: {
        type: 'dropdown-input',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Background repeat',
        options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round', 'custom'],
        limiter: { arg: 'layout', eq: 'background' },
      },
      backgroundRepeatText: {
        type: 'text-input',
        category: PropertyCategories.STYLINGLAYOUT,
        bindingKey: 'backgroundRepeat',
        limiter: [
          { arg: 'layout', eq: 'background' },
          { arg: 'backgroundRepeat', eq: 'custom' },
        ],
        placeholder: 'repeat, no-repeat',
      },
      backgroundSize: {
        type: 'dropdown-input',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Background size',
        options: ['auto', 'cover', 'contain', 'custom'],
        limiter: { arg: 'layout', eq: 'background' },
      },
      backgroundSizeText: {
        type: 'text-input',
        category: PropertyCategories.STYLINGLAYOUT,
        bindingKey: 'backgroundSize',
        limiter: [
          { arg: 'layout', eq: 'background' },
          { arg: 'backgroundSize', eq: 'custom' },
        ],
        placeholder: '100px 50px',
      },
      ...cardCommonSettings_other,
    },
  },
};

const StatusComponentsMapping: COMPONENT_TYPE = {
  'sc-alert': {
    type: 'status',
    icon: 'alert',
    label: 'Alert',
    id: 'alert',
    properties: {
      open: {
        type: 'boolean',
        defaultValue: true,
      },
      title: {
        type: 'string',
        defaultValue: 'This is alert',
      },
      type: {
        type: 'string',
        defaultValue: 'info',
      },
      mode: {
        type: 'string',
        defaultValue: 'default',
      },
      body: {
        type: 'slot',
        defaultValue: '',
      },
      expand: {
        type: 'boolean',
        defaultValue: true,
      },
      closable: {
        type: 'boolean',
        defaultValue: false,
      },
    },
    settings: {
      title: {
        type: 'text-input',
        label: 'Title',
      },
      mode: {
        type: 'radio-group',
        label: 'Mode',
        options: ['default', 'banner'],
      },
      type: {
        type: 'radio-group',
        label: 'Type',
        options: ['info', 'success', 'warning', 'error', 'disabled', 'transparent'],
      },
      body: {
        type: 'rich-text-editor',
        label: 'Body',
      },
      collapsed: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Collapsed',
        opposite: true,
        bindingKey: 'expand',
      },
      closable: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Closable',
      },
    },
  },
  'sc-badge': {
    type: 'status',
    icon: 'badge',
    label: 'Badge',
    id: 'badge',
    properties: {
      type: {
        type: 'string',
        defaultValue: 'number',
      },
      color: {
        type: 'string',
        defaultValue: 'red',
      },
      number: {
        type: 'number',
        mappingValue: true,
      },
      label: {
        type: 'string',
        mappingValue: true,
      },
      outlined: {
        type: 'boolean',
        defaultValue: false,
      },
    },
    settings: {
      type: {
        type: 'radio-group',
        label: 'Type',
        options: ['number', 'text'],
      },
      color: {
        type: 'radio-group',
        label: 'Color',
        options: ['red', 'amber', 'green', 'blue', 'grey', 'transparent'],
        category: PropertyCategories.STYLINGLAYOUT,
      },
      value: {
        category: PropertyCategories.DATABINDING,
      },
      outlined: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Outline',
      },
    },
  },
  'sc-dot-status': {
    type: 'status',
    icon: 'dot-status',
    label: 'Dot status',
    id: 'dot-status',
    properties: {
      label: {
        type: 'string',
        mappingValue: true,
      },
      mode: {
        type: 'string',
        defaultValue: 'default',
      },
      type: {
        type: 'string',
        defaultValue: 'success',
      },
      status: {
        type: 'string',
        defaultValue: 'draft',
      },
      compact: {
        type: 'boolean',
        defaultValue: false,
      },
      outline: {
        type: 'boolean',
        defaultValue: false,
      },
    },
    settings: {
      label: {
        category: PropertyCategories.DATABINDING,
      },
      mode: {
        type: 'radio-group',
        label: 'Mode',
        options: ['default', 'icon'],
      },
      type: {
        type: 'radio-group',
        label: 'Type',
        options: ['info', 'neutral', 'error', 'warning', 'success', 'minor-error', 'pending', 'draft', 'urgent-error'],
        optionsLabel: ['Info', 'Neutral', 'Error', 'Warning', 'Success', 'Minor error', 'Pending', 'Draft', 'Urgent error'],
        limiter: { arg: 'mode', eq: 'default' },
      },
      status: {
        type: 'radio-group',
        label: 'Status',
        options: ['error', 'warning', 'minor-error', 'success', 'info', 'pending', 'pending-approval', 
          'draft', 'missing-info', 'rejected', 'on-hold', 'not-started'],
        optionsLabel: ['Error', 'Warning', 'Minor error', 'Success', 'Info', 'Pending', 'Pending approval', 
          'Draft', 'Missing info', 'Rejected', 'On hold', 'Not started'],
        limiter: { arg: 'mode', eq: 'icon' },
      },
      compact: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Compact',
      },
      outline: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Outline',
        limiter: { arg: 'mode', eq: 'icon' },
      },
    },
  },
  // 'sc-timer': {
  //   type: 'status',
  //   icon: 'timer',
  //   label: 'Timer',
  //   id: 'timer',
  //   properties: {
  //     label: {
  //       type: 'string',
  //     },
  //     size: {
  //       type: 'string',
  //     },
  //     stateIntervalTime: {
  //       type: 'number',
  //     },
  //     durationValue: {
  //       type: 'string',
  //     },
  //     durationUnit: {
  //       type: 'string',
  //       defaultValue: 'second',
  //     },
  //     needHourDigit: {
  //       type: 'boolean',
  //     },
  //     noBackground: {
  //       type: 'boolean',
  //     },
  //     timeOutMessage: {
  //       type: 'string',
  //     },
  //   },
  //   settings: {
  //     label: {
  //       type: 'text-input',
  //       label: 'Label',
  //     },
  //     size: {
  //       type: 'radio-group',
  //       category: PropertyCategories.STYLINGLAYOUT,
  //       label: 'Size',
  //       className: 'text-uppercase',
  //       options: ['sm', 'md', 'lg'],
  //     },
  //     durationValue: {
  //       type: 'number-input',
  //       label: 'Value',
  //     },
  //     durationUnit: {
  //       type: 'radio-group',
  //       label: 'Unit',
  //       options: ['hour', 'minute', 'second'],
  //     },
  //     needHourDigit: {
  //       type: 'switch',
  //       category: PropertyCategories.BEHAVIOR,
  //       label: 'Show hour',
  //     },
  //     noBackground: {
  //       type: 'switch',
  //       category: PropertyCategories.BEHAVIOR,
  //       label: 'Hide background',
  //     },
  //     stateIntervalTime: {
  //       type: 'number-input',
  //       label: 'State interval time',
  //     },
  //     timeOutMessage: {
  //       type: 'text-input',
  //       label: 'Timeout message',
  //     },
  //   },
  // },
};

const ActionComponentsMapping: COMPONENT_TYPE = {
  'sc-rating': {
    type: 'action',
    icon: 'rating',
    label: 'Rating',
    id: 'rating',
  },
  'sc-button-group': {
    type: 'action',
    icon: 'button-group',
    label: 'Button group',
    id: 'button-group',
  },
};

const BusinessComponentsMapping: COMPONENT_TYPE = {
  'sc-employee-avatar': {
    type: 'business',
    icon: 'employee-avatar',
    label: 'Employee avatar',
    id: 'employee-avatar',
    properties: {
      id: {
        type: 'string',
        defaultValue: '',
        mappingValue: true,
      },
      avatarSize: {
        type: 'string',
        defaultValue: 'lg',
      },
      'sc-loaded': {
        type: 'event',
      },
    },
    settings: {
      id: {
        category: PropertyCategories.DATABINDING,
      },
      avatarSize: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Size',
        className: 'text-uppercase',
        options: ['sm', 'md', 'lg', 'xl'],
      },
    },
  },
  'sc-employee-name': {
    type: 'business',
    icon: 'employee-name',
    label: 'Employee name',
    id: 'employee-name',
    properties: {
      label: {
        type: 'string',
        defaultValue: '',
      },
      id: {
        type: 'string',
        defaultValue: '',
        mappingValue: true,
      },
      'sc-loaded': {
        type: 'event',
      },
    },
    settings: {
      label: {
        type: 'text-input',
        label: 'Label',
      },
      id: {
        category: PropertyCategories.DATABINDING,
      },
    },
  },
  'sc-employee-card': {
    type: 'business',
    icon: 'employee-card',
    label: 'Employee card',
    id: 'employee-card',
    properties: {
      noActions: {
        type: 'boolean',
        defaultValue: false,
        unchanging: true,
      },
      id: {
        type: 'text-input',
        defaultValue: '',
        mappingValue: true,
      },
      avatarSize: {
        type: 'string',
        defaultValue: 'lg',
      },
      mode: {
        type: 'string',
        defaultValue: 'normal',
      },
      'sc-loaded': {
        type: 'event',
      },
      nonClickable: {
        defaultValue: true,
      },
    },
    settings: {
      id: {
        category: PropertyCategories.DATABINDING,
      },
      avatarSize: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Size',
        className: 'text-uppercase',
        options: ['sm', 'md', 'lg', 'xl'],
        limiter: { arg: 'mode', eq: ['normal', 'compact'] },
      },
      mode: {
        type: 'radio-group',
        label: 'Mode',
        options: ['normal', 'compact', 'tag'],
        oldOptions: ['default', 'compact', 'tag'],
      },
    },
  },
};

const ContentComponentsMapping: COMPONENT_TYPE = {
  'sc-avatar': {
    type: 'content',
    icon: 'avatar',
    label: 'Avatar',
    id: 'avatar',
    properties: {
      image: {
        type: 'string',
        defaultValue: 'URL',
      },
      size: {
        type: 'string',
        defaultValue: 'lg',
      },
      background: {
        type: 'string',
        defaultValue: 'default',
      },
      src: {
        type: 'string',
        defaultValue: '',
      },
    },
    settings: {
      image: {
        type: 'dropdown-input',
        label: 'Image',
        options: ['Upload', 'URL'],
      },
      src: {
        type: 'text-input',
        limiter: { arg: 'image', eq: 'URL' },
      },
      upload: {
        type: 'upload-input',
        bindingKey: 'src',
        limiter: { arg: 'image', eq: 'Upload' },
      },
      size: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Size',
        className: 'text-uppercase',
        options: ['sm', 'md', 'lg', 'xl'],
      },
      background: {
        type: 'radio-group',
        category: PropertyCategories.STYLINGLAYOUT,
        label: 'Background',
        options: ['default', 'red', 'green', 'blue', 'yellow'],
      },
    },
  },
  'sc-copy': {
    type: 'content',
    icon: 'copy',
    label: 'Copy',
    id: 'copy',
    properties: {
      mode: {
        type: 'string',
        defaultValue: 'default',
      },
      value: {
        type: 'string',
        mappingValue: true,
      },
      label: {
        type: 'string',
        mappingValue: true,
      },
      helpText: {
        type: 'string',
      },
      disabled: {
        type: 'boolean',
      },
    },
    settings: {
      mode: {
        type: 'radio-group',
        label: 'Mode',
        options: ['default', 'text'],
      },
      value: {
        category: PropertyCategories.DATABINDING,
      },
      helpText: {
        type: 'text-input',
        label: 'Tooltip',
        limiter: { arg: 'mode', eq: 'default' },
      },
      disabled: {
        type: 'switch',
        category: PropertyCategories.BEHAVIOR,
        label: 'Disabled',
      },
    },
  },
};

const DataVisComponentsMapping: COMPONENT_TYPE = {
  'sc-data-view': {
    type: 'data visualisation',
    icon: 'data-view',
    label: 'Data view',
    id: 'data-view',
  },
};

const InputComponentsMapping: COMPONENT_TYPE = {
  'sc-card-number-input': {
    type: 'input',
    icon: 'card-number',
    label: 'Card number',
    id: 'card-number-input',
  },
  'sc-password-input': {
    type: 'input',
    icon: 'shield--line',
    label: 'Password',
    id: 'password-input',
  },
  'sc-toggle': {
    type: 'input',
    icon: 'toggle',
    label: 'Toggle',
    id: 'toggle',
  },
};

export const WebkitComponentsMapping: COMPONENT_TYPE = {
  ...InputComponentsMapping,
  ...ContentComponentsMapping,
  ...CardComponentsMapping,
  ...StatusComponentsMapping,
  ...BusinessComponentsMapping,
  ...DataVisComponentsMapping,
  ...ActionComponentsMapping,
};

export const getComponentTypes = () => {
  const types: string[] = [];
  Object.values(WebkitComponentsMapping).map((value: COMPONENT_ITEM_TYPE) => {
    let t;
    if (value.type) {
      const arr = value.type?.split('');
      arr[0] = arr[0].toUpperCase();
      const index = arr.findIndex((a: string) => a === '/');
      if (index > -1) {
        if (arr[index + 1]) {
          arr[index + 1] = arr[index + 1].toUpperCase();
        }
      }
      t = arr.join('');
    } else {
      t = 'Basic components';
    }
    if (!types.includes(t)) {
      types.push(t);
    }
  });
  return types;
};