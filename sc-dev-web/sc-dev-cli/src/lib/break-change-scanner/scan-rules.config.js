import chalk from 'chalk';

export const RuleList = [
  {
    version: '2.0',
    name: 'Table',
    compName: 'sc-table',
    message: `
${chalk.yellow(
  '[DEPRECATION',
)}: The "sc-table" component is scheduled for deprecation in future releases.
Please refer to the latest documentation for new one: sc-data-grid.

`,
    attrs: [
      // different name but same feature
      {
        type: 'changed-attr',
        name: 'select-all-rows',
        changeToAttr: 'row-selection-strategy',
      },
      {
        type: 'changed-attr',
        name: 'column-chooser',
        changeToAttr: 'row-selection',
      },
      {
        type: 'changed-attr',
        name: 'rowExpandRender',
        changeToAttr: 'masterCellRenderer',
      },
      {
        type: 'changed-attr',
        name: 'select-scope',
        changeToAttr: 'row-selection-mode',
        changeTo: [
          ['all', 'all'],
          ['page', 'currentPage'],
        ],
      },
      // totally deprecated
      {
        type: 'removed',
        name: 'expandable',
        message: `There are two way to show nested content in new table. Please check ${chalk.blue(
          'Master Cell',
        )} and ${chalk.blue('Row Grouping')}`,
      },
      { type: 'removed', name: 'sticky-header' },
      { type: 'removed', name: 'sort' },
      { type: 'removed', name: 'sc-tr-create' },
      { type: 'removed', name: 'sc-tr-mouseover' },
      { type: 'removed', name: 'sc-tr-mouseout' },
      { type: 'removed', name: 'sc-tr-expanded' },
      {
        type: 'removed',
        name: 'selectedRows',
        message: `Please check ${chalk.blue('Row Selection')} part of Webkit documentation.`,
      },
      {
        type: 'removed',
        name: 'rowExpandable',
        message: `Currently you can access table api to manually opreate this behaviours. like scDatagridElement.table.xx`,
      },
      {
        type: 'removed',
        name: 'expand-mode',
        message: `Currently you can access table api to manually opreate this behaviours. like scDatagridElement.table.xx`,
      },
    ],
  },
  {
    version: '2.0',
    name: 'Alert',
    compName: 'sc-alert',
    attrs: [
      {
        type: 'removed',
        name: 'type',
        removeValue: ['disabled', 'transparent'],
        changeTo: [
          ['disabled', 'default'],
          ['disabled', 'default'],
        ],
        defaultVal: 'info',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Avatar',
    compName: 'sc-avatar',
    attrs: [
      {
        type: 'changed-removed',
        name: 'size',
        removeValue: ['xl'],
        changeTo: [['xl', 'lg']],
        defaultVal: 'md',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Banner',
    compName: 'sc-banner',
    attrs: [{ type: 'removed', name: 'round-corner' }],
  },
  {
    version: '2.0',
    name: 'Button',
    compName: 'sc-button',
    attrs: [
      {
        type: 'changed-attr',
        name: 'icon',
        changeToAttr: 'left-icon',
        tip: 'Remove icon attribute and replace it by left-icon attribute',
      },
      // TBD: still exists in dev storybook
      // directly
      { type: 'removed', name: 'inverse' },
      // non var
      { type: 'removed', name: 'fill', delete: true },
      {
        type: 'changed-attr',
        name: 'type',
        changeToAttr: 'state',
        changeTo: [['error', 'error']],
        tip: 'Remove warning and error from type and replace it by state attribute',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Icon Button',
    compName: 'sc-icon-button',
    attrs: [
      { type: 'removed', name: 'loading' },
      { type: 'removed', name: 'inverse' },
      { type: 'changed-attr', name: 'type', changeToAttr: 'state', changeTo: [['error', 'error']] },
    ],
  },
  {
    version: '2.0',
    name: 'Card',
    compName: 'sc-card',
    attrs: [{ type: 'removed', name: 'sub-title-size' }],
  },
  {
    version: '2.0',
    name: 'Spinner',
    compName: 'sc-spinner',
    attrs: [
      {
        type: 'changed-removed',
        name: 'size',
        removeValue: ['xxs', 'xs', 'xl', 'xxl'],
        defaultVal: 'sm',
        changeTo: [
          ['xxs', 'sm'],
          ['xs', 'sm'],
          ['xl', 'lg'],
          ['xxl', 'lg'],
        ],
      },
    ],
  },
  {
    version: '2.0',
    name: 'Stepper',
    compName: 'sc-stepper',
    // TBD: typo in dev storybook (bottom\right)
    attrs: [
      {
        type: 'removed',
        name: 'title-position',
        removeValue: ['left', 'right'],
        defaultVal: 'bottom',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Tag',
    compName: 'sc-tag',
    attrs: [{ type: 'removed', name: 'fill' }],
  },
  {
    version: '2.0',
    name: 'Spacer',
    compName: 'sc-spacer',
    attrs: [
      {
        type: 'changed-removed',
        name: 'size',
        removeValue: ['xxs', 'xs', 'sm', 'md', 'lg'],
        changeTo: [
          ['xxs', '04'],
          ['xs', '08'],
          ['sm', '24'],
          ['md', '32'],
          ['lg', '48'],
        ],
      },
    ],
  },
  {
    version: '2.0',
    name: 'Badge',
    compName: 'sc-badge',
    attrs: [
      // TBD: typo in dev storybook (still red)
      {
        type: 'changed-default',
        name: 'color',
        defaultVal: 'blue',
        tip: 'the default color is blue',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Icon Card',
    compName: 'sc-icon-card',
    attrs: [
      {
        type: 'changed-default',
        name: 'image-align',
        defaultVal: 'left',
        tip: 'the default value is left',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Dot Status',
    compName: 'sc-dot-status',
    attrs: [
      // TBD: typo in dev storybook (still default disabled)
      {
        type: 'changed-removed',
        name: 'type',
        removeValue: ['disabled'],
        changeTo: [['disabled', 'neutral']],
        defaultVal: 'neutral',
        tip: 'Replace the disabled type by neutral type',
      },
    ],
  },
  {
    version: '2.0',
    name: 'Timer',
    compName: 'sc-timer',
    attrs: [
      {
        type: 'changed-removed',
        name: 'size',
        removeValue: ['small', 'large'],
        changeTo: [
          ['small', 'sm'],
          ['large', 'lg'],
        ],
        defaultVal: 'sm',
        tip: 'Rename the size value([small | large] → [sm | md | lg])',
      },
    ],
  },
];

export const IconList = [
  {
    name: 'stop-circle--fill',
    type: 'changed',
    newValue: 'stop--fill',
  },
  {
    name: 'stop-circle--line',
    type: 'changed',
    newValue: 'stop--line',
  },
];

export const ColorVarMap = {
  changed: [
    {
      name: '--sc-color-grey-100',
      value: '#525355',
      changeTo: '#E5E5E5',
      replaceBy: '--sc-color-blue-900',
    },
  ],
  removed: [
    // grey start
    { name: '--sc-color-grey-5', value: '#FAFAFA', replaceBy: '--sc-color-grey-50' },
    { name: '--sc-color-grey-10', value: '#F2F2F2', replaceBy: '--sc-color-grey-100' },
    { name: '--sc-color-grey-15', value: '#E5E5E5', replaceBy: '--sc-color-grey-100' },
    { name: '--sc-color-grey-25', value: '#D4D4D4', replaceBy: '--sc-color-grey-150' },
    { name: '--sc-color-grey-30', value: '#CCCCCC', replaceBy: '--sc-color-grey-200' },
    { name: '--sc-color-grey-40', value: '#B2B2B2', replaceBy: '--sc-color-grey-300' },
    { name: '--sc-color-grey-50', value: '#A8A9AA', replaceBy: '--sc-color-grey-350' },
    { name: '--sc-color-grey-70', value: '#858687', replaceBy: '--sc-color-grey-500' },
    { name: '--sc-color-grey-80', value: '#666666', replaceBy: '--sc-color-grey-600' },
    { name: '--sc-color-grey-black', value: '#212121', replaceBy: '--sc-color-grey-850' },

    { name: '--sc-color-grey-dm-10', value: '#3A3A3A', replaceBy: '--sc-color-grey-850' },
    { name: '--sc-color-grey-dm-30', value: '#2E2E2E', replaceBy: '--sc-color-grey-900' },
    { name: '--sc-color-grey-dm-50', value: '#252525', replaceBy: '--sc-color-grey-150-dark' },
    { name: '--sc-color-grey-dm-70', value: '#1F1F1F', replaceBy: '--sc-color-grey-900' },
    { name: '--sc-color-grey-dm-90', value: '#181818', replaceBy: '--sc-color-grey-900' },
    { name: '--sc-color-grey-dm-100', value: '#111111', replaceBy: '--sc-color-grey-950' },
    /* grey end */

    /* blue start */
    { name: '--sc-color-blue-lightest', value: '#E7F1FD', replaceBy: '--sc-color-blue-50' },
    { name: '--sc-color-blue-lighter', value: '#C3DEFA', replaceBy: '--sc-color-blue-100' },
    { name: '--sc-color-blue-light', value: '#7BB6F5', replaceBy: '--sc-color-blue-250' },
    { name: '--sc-color-blue', value: '#0473EA', replaceBy: '--sc-color-blue-500' },
    { name: '--sc-color-blue-dark', value: '#0B56A8', replaceBy: '--sc-color-blue-650' },
    { name: '--sc-color-blue-darker', value: '#0C3A66', replaceBy: '--sc-color-blue-800' },
    { name: '--sc-color-blue-darkest', value: '#061D33', replaceBy: '--sc-color-blue-900' },

    { name: '--sc-color-blue-dm', value: '#007AFF', replaceBy: '--sc-color-blue-460' },
    /* blue end */

    /* green start */
    { name: '--sc-color-green-lightest', value: '#EBFAE5', replaceBy: '--sc-color-green-50' },
    { name: '--sc-color-green-lighter', value: '#CDF4BF', replaceBy: '--sc-color-green-100' },
    { name: '--sc-color-green-light', value: '#92E773', replaceBy: '--sc-color-green-250' },
    { name: '--sc-color-green', value: '#38D200', replaceBy: '--sc-color-green-500' },
    { name: '--sc-color-green-dark', value: '#238500', replaceBy: '--sc-color-green-650' },
    { name: '--sc-color-green-darker', value: '#1B6600', replaceBy: '--sc-color-green-800' },
    { name: '--sc-color-green-darkest', value: '#0B2900', replaceBy: '--sc-color-green-900' },
    /* green end */

    /* red start */
    { name: '--sc-color-red-lighter', value: '#FBE5E5', replaceBy: '--sc-color-red-50' },
    { name: '--sc-color-red-light', value: '#FBCCD1', replaceBy: '--sc-color-red-100' },
    { name: '--sc-color-red', value: '#D50000', replaceBy: '--sc-color-red-500' },
    { name: '--sc-color-red-dark', value: '#C30303', replaceBy: '--sc-color-red-550' },
    { name: '--sc-color-red-darker', value: '#880000', replaceBy: '--sc-color-red-700' },
    { name: '--sc-color-red-dm', value: '#FF2E22', replaceBy: '--sc-color-red-450' },
    /* red end */

    /* yellow start */
    { name: '--sc-color-yellow-lightest', value: '#FDEFBF', replaceBy: '--sc-color-amber-50' },
    { name: '--sc-color-yellow-lighter', value: '#FFECBC', replaceBy: '--sc-color-amber-150' },
    { name: '--sc-color-yellow-light', value: '#FFD463', replaceBy: '--sc-color-amber-350' },
    { name: '--sc-color-yellow', value: '#FFC120', replaceBy: '--sc-color-amber-500' },
    { name: '--sc-color-yellow-dark', value: '#DBA121', replaceBy: '--sc-color-amber-550' },
    { name: '--sc-color-yellow-darker', value: '#BA861E', replaceBy: '--sc-color-amber-650' },
    /* yellow end */

    /* purple end */
    { name: '--sc-color-purple-50', value: '#4848BD', replaceBy: '--sc-color-purple-500' },
    { name: '--sc-color-purple-dm-50', value: '#7a7ae7', replaceBy: '--sc-color-purple-650-dark' },
    /* purple end */

    /* status colors */
    {
      name: '--sc-color-error-80',
      value: 'var(--sc-color-red-dark)',
      replaceBy: '--sc-color-red-550',
    },
    { name: '--sc-color-error-50', value: 'var(--sc-color-red)', replaceBy: '--sc-color-red-500' },
    {
      name: '--sc-color-error-20',
      value: 'var(--sc-color-red-light)',
      replaceBy: '--sc-color-red-100',
    },
    {
      name: '--sc-color-error-dm',
      value: 'var(--sc-color-red-dm)',
      replaceBy: '--sc-color-red-450',
    },

    { name: '--sc-color-warning-80', value: '#E4B300', replaceBy: '--sc-color-amber-550' },
    { name: '--sc-color-warning-50', value: '#F5C000', replaceBy: '--sc-color-amber-400' },
    { name: '--sc-color-warning-20', value: '#FCECB3', replaceBy: '--sc-color-amber-200' },

    {
      name: '--sc-color-success',
      value: 'var(--sc-color-green)',
      replaceBy: '--sc-color-green-500',
    },
    { name: '--sc-color-info', value: 'var(--sc-color-grey-25)', replaceBy: '--sc-color-grey-150' },
    {
      name: '--sc-color-disabled',
      value: 'var(--sc-color-grey-50)',
      replaceBy: '--sc-color-grey-350',
    },

    { name: '--sc-color-amber', value: '#ef6923', replaceBy: '--sc-color-orange-500' },
    { name: '--sc-color-pending', value: '#00859b', replaceBy: '--sc-color-teal-500' },
    { name: '--sc-color-pending-dm', value: '#d9f8fd', replaceBy: '--sc-color-teal-100' },

    // /* Interaction colors */
    { name: '--sc-color-blue-hover', value: '#1586FF', replaceBy: '--sc-color-blue-400' },
    { name: '--sc-color-red-hover', value: '#D91919', replaceBy: '--sc-color-red-400' },
    { name: '--sc-color-yellow-hover', value: '#FFC736', replaceBy: '--sc-color-amber-400' },

    {
      name: '--sc-color-blue-press',
      value: 'var(--sc-color-blue-dark)',
      replaceBy: '--sc-color-blue-650',
    },
    { name: '--sc-color-red-press', value: '#AA0000', replaceBy: '--sc-color-red-500' },
    {
      name: '--sc-color-yellow-press',
      value: 'var(--sc-color-yellow-dark)',
      replaceBy: '--sc-color-amber-550',
    },
  ],
  'computed-spacing': [
    {
      name: '--sc-spacing-',
      changeTo: '--sc-spacing-',
      step: 4,
    },
  ],
};

const RuleTypeMap = {
  attr: {
    showTxt: 'ATTRIBUTE',
    color: 'blue',
  },
};

export const RuleChangedTypeMap = {
  removed: {
    prefix: 'DANGEROUS',
    color: 'red',
  },
  tips: {
    prefix: 'WARNING',
    color: 'yellow',
  },
  changed: {
    prefix: 'WARNING',
    color: 'blue',
  },
  deprecated: {
    prefix: 'WARNING',
    color: 'yellow',
  },
};

export const showRuleTips = (ruleType, compName, ruleItem, loc) => {
  if (!ruleType || !compName || !ruleItem?.name) {
    return;
  }
  const { type, name, removeValue, defaultVal, tip } = ruleItem || {};
  const ruleTypeCfg = RuleTypeMap[ruleType];
  const changedTypeCfg = RuleChangedTypeMap[type] || {};

  return [
    chalk[changedTypeCfg.color]?.(`[${changedTypeCfg.prefix} - ${type}]`),
    removeValue?.length
      ? 'The values: ' + chalk.red([].concat(removeValue).join(', ')) + ' of'
      : '',
    `${ruleTypeCfg.showTxt}: ${chalk[ruleTypeCfg.color]?.(name)} has been`,
    chalk[changedTypeCfg.color](type),
    `. (COMPONENT: ${chalk.blue(compName)}).`,
    tip ? chalk.bgCyan(tip) + `${tip.endsWith('.') ? '' : '.'}` : '',
    'Please check carefully~',
    loc ? `(${chalk.underline(loc)})` : '',
  ].join(' ');
};
