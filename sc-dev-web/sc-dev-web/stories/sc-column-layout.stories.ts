import { html, TemplateResult, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

export default {
  title: 'Layout/Column Layout',
  component: 'sc-column-layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Column layout is a generic layout to show grouping of info in grid',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Sets page title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    layout: {
      control: 'inline-radio',
      options: [
        'Main Content Right',
        'Main Content Left',
        'Main Content Middle',
        'Main Content Full',
      ],
      description: 'Sets the preferred page layout.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Main Content Right' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'inline-radio',
      options: ['cover', 'auto'],
      description:
        'Set if layout height = page height - header offset - breadcrumb offset - additional offset.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
    },
    unfloatable: {
      control: 'boolean',
      description: 'Sets if rendering the header in float mode. if true, the header will render inline with column content.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    compact: {
      control: 'boolean',
      description: 'Forces the layout to render in compact (tablet/portrait) mode regardless of screen width.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      options: ['page', 'component'],
      description:
        'Sets the layout type. "component" mode always keeps the sticky bar fixed and removes the window scroll listener, making it suitable for embedding inside other components rather than full-page usage.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'page' },
        category: 'Attributes',
      },
    },
    'hide-zoom': {
      control: 'boolean',
      description: 'Sets if hide the default zoom in/out icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'left-column-collapsible': {
      control: 'boolean',
      description: 'Sets if left grid can be collapsible.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Left' },
    },
    'left-column-collapse': {
      control: 'boolean',
      description: 'Sets if left grid collapse by default.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'left-column-collapsible', eq: true },
    },
    'left-divider-invisible': {
      control: 'boolean',
      description: 'Sets if hide the divider between left and main part.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Left' },
    },
    'left-column-resizable': {
      control: 'boolean',
      description: 'Enables mouse drag resizing for the left divider in PC mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Left' },
    },
    'left-column-width': {
      control: 'text',
      description: 'Sets the initial width of the left panel.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '18.75rem' },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Left' },
    },
    'left-header-divider': {
      control: 'boolean',
      description: 'Sets if show the divider between left header and left slot part.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'right-column-collapsible': {
      control: 'boolean',
      description: 'Sets if right grid can be collapsible.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Right' },
    },
    'right-column-collapse': {
      control: 'boolean',
      description: 'Sets if right grid collapse by default.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'right-column-collapsible', eq: true },
    },
    'disable-auto-collapse': {
      control: 'boolean',
      description: 'When enabled, columns will not auto-collapse when the screen size changes. Collapse can only be triggered manually.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'right-divider-invisible': {
      control: 'boolean',
      description: 'Sets if hide the divider between right and main part.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Right' },
    },
    'right-column-resizable': {
      control: 'boolean',
      description: 'Enables mouse drag resizing for the right divider in PC mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Right' },
    },
    'right-column-width': {
      control: 'text',
      description: 'Sets the initial width of the right panel.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '18.75rem' },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Right' },
    },
    'right-header-divider': {
      control: 'boolean',
      description: 'Sets if show the divider between right header and right slot part.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'layout', neq: 'Main Content Full' },
    },
    'auto-process-spacing-value': {
      control: 'boolean',
      description:
        'When enabled, the component will automatically normalize unitless CSS length variables (such as 0) to valid CSS units (0rem) for all spacing-related custom properties. This prevents browser rendering issues in calc() expressions and ensures consistent layout spacing. Disable only if you want to manage all CSS variable units yourself.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'standard-spacing': {
      control: 'boolean',
      description:
        'If enabled, applies a standard spacing class to the root layout container for consistent and predictable spacing between columns and content. Useful for enforcing design system spacing rules across all layouts.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'right-column-size': {
      control: 'inline-radio',
      options: [
        'sm',
        'md',
        'lg',
      ],
      description: 'Sets to adjust the width of right column.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    'fix-sticky-bar': {
      control: 'boolean',
      description: 'Sets if sticky breadcrumb and buttons fix at top.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'custom-icons': {
      control: 'array',
      description:
        'Sets if want to add some customized user actions by configuring icons.',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: undefined },
        category: 'Attributes',
      },
    },
    'additional-height': {
      control: 'text',
      description: 'Sets if more space needed besides title and breadcrumb (only support number with px unit or number only).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
        category: 'Attributes',
      },
    },
    'additional-slot-height': {
      control: 'text',
      description: 'Sets if more space needed besides title and breadcrumb, support all kinds of units (px, rem, em, %) and unit is required.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Sets to customize the title.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'breadcrumb\']': {
      control: 'text',
      description:
        'Sets to customize the breadcrumb, it does not work if there is sticky-breadcrumb or sticky-button.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'sticky-breadcrumb\']': {
      control: 'text',
      description:
        'Sets to customize the breadcrumb which will be sticky when scrolling.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'sticky-button\']': {
      control: 'text',
      description: 'Sets to sticky the button when scrolling.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'additional\']': {
      control: 'text',
      description:
        'Sets to customize additional content below title and breadcrumb.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'left-header\']': {
      control: 'text',
      description:
        'Sets to customize additional content in the top of left column.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'right-header\']': {
      control: 'text',
      description:
        'Sets to customize additional content in the top of right column.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'layout', neq: 'Main Content Full' },
    },
    'slot[name=\'content\']': {
      control: 'text',
      description:
        'Sets to customize main content when using "Full" layout.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'layout', eq: 'Main Content Full' },
    },
    'slot[name=\'left\']': {
      control: 'text',
      description:
        'Sets to customize left content when not using "Full" layout.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'layout', neq: 'Main Content Full' },
    },
    'slot[name=\'right\']': {
      control: 'text',
      description:
        'Sets to customize right content when not using "Full" layout.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'layout', neq: 'Main Content Full' },
    },
    'slot[name=\'middle\']': {
      control: 'text',
      description:
        'Sets to customize right content when not using "Full" layout.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'layout', eq: 'Main Content Middle' },
    },
    'sc-action': {
      description: 'Emitted when collapse/expand the left and right column. Get the value by event.detail.action and event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    // ================= CSS Variables =================
    '--sc-layout-top-offset': {
      control: 'text',
      description: 'Overall top offset for the content area, usually combined with header/breadcrumb.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '1.5rem' },
      },
    },
    '--sc-layout-bottom-offset': {
      control: 'text',
      description: 'Overall bottom offset for the content area, often for global safe area.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '1.5rem' },
      },
    },
    '--sc-column-extra-top-offset': {
      control: 'text',
      description: 'Extra top offset, useful for multi-level navigation or custom top space.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0rem' },
      },
    },
    '--sc-layout-header-offset': {
      control: 'text',
      description: 'Main header bar height. Affects the title area and content layout.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '3.625rem' },
      },
    },
    '--sc-layout-breadcrumb-offset': {
      control: 'text',
      description: 'Breadcrumb bar height. Affects content top offset.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '2.5rem' },
      },
    },
    '--sc-layout-breadcrumb-padding-top': {
      control: 'text',
      description: 'Breadcrumb bar top padding.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0rem' },
      },
    },
    '--sc-layout-sticky-bar-left-offset': {
      control: 'text',
      description: 'Sticky bar left offset, for layouts with sidebars or special cases.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
    '--sc-layout-sticky-bar-right-offset': {
      control: 'text',
      description: 'Sticky bar right offset, for layouts with sidebars or special cases.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
    '--sc-layout-main-content-padding-x': {
      control: 'text',
      description: 'Horizontal padding for the main content area.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0.625rem' },
      },
    },
    '--sc-layout-main-content-padding-top': {
      control: 'text',
      description: 'Top padding for the main content area.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0rem' },
      },
    },
    '--sc-layout-main-content-padding-bottom': {
      control: 'text',
      description: 'Bottom padding for the main content area.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0rem' },
      },
    },
    '--sc-layout-left-header-height': {
      control: 'text',
      description: 'Left column header height.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '3.5rem' },
      },
    },
    '--sc-layout-left-header-padding-x': {
      control: 'text',
      description: 'Horizontal padding for the left column header.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0.75rem' },
      },
    },
    '--sc-layout-right-header-height': {
      control: 'text',
      description: 'Right column header height.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '3.5rem' },
      },
    },
    '--sc-layout-right-header-padding-x': {
      control: 'text',
      description: 'Horizontal padding for the right column header.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0.75rem' },
      },
    },
    '--sc-layout-left-panel-padding-x': {
      control: 'text',      
      description: 'Horizontal padding for the left column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0.75rem' },
      },
    },
    '--sc-layout-left-panel-padding-top': {
      control: 'text',
      description: 'Top padding for the left column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
    '--sc-layout-left-panel-padding-bottom': {
      control: 'text',
      description: 'Bottom padding for the left column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
    '--sc-layout-right-panel-padding-x': {
      control: 'text',
      description: 'Horizontal padding for the right column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0.75rem' },
      },
    },
    '--sc-layout-right-panel-padding-top': {
      control: 'text',
      description: 'Top padding for the right column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
    '--sc-layout-right-panel-padding-bottom': {
      control: 'text',
      description: 'Bottom padding for the right column.',
      table: {
        category: 'CSS variables',
        type: { summary: 'string' },
        defaultValue: { summary: '0px' },
      },
    },
  },
  args: {
    title: '',
    layout: 'Main Content Right',
    height: 'auto',
    unfloatable: true,
    compact: false,
    type: 'page',
    'right-column-collapsible': false,
    'right-column-collapse': false,
    'fix-sticky-bar': false,
    'additional-height': '0px',
    'additional-slot-height': '0rem',
    'left-column-width': '18.75rem',
    'right-column-width': '18.75rem',
    'slot[name=\'title\']': '',
    'slot[name=\'breadcrumb\']': '',
    'slot[name=\'sticky-breadcrumb\']': '',
    'slot[name=\'sticky-button\']': '',
    'slot[name=\'additional\']': '',
    'auto-process-spacing-value': false,
    'standard-spacing': false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  layout: string;
  height?: string;
  unfloatable?: boolean;
  compact?: boolean;
  type?: 'page' | 'component';
  'left-column-collapsible'?: boolean;
  'left-column-collapse'?: boolean;
  'left-divider-invisible'?: boolean;
  'left-column-resizable'?: boolean;
  'left-column-width'?: string;
  'left-header-divider'?: boolean;
  'right-column-collapsible'?: boolean;
  'right-column-collapse'?: boolean;
  'right-divider-invisible'?: boolean;
  'right-column-resizable'?: boolean;
  'right-column-width'?: string;
  'right-header-divider'?: boolean;
  'right-column-size'?: 'sm' | 'md' | 'lg';
  'hide-zoom'?: boolean;
  'disable-auto-collapse'?: boolean;
  'custom-icons'?: NonNullable<unknown>;
  'fix-sticky-bar'?: boolean;
  'additional-height'?: string;
  'additional-slot-height'?: string;
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'breadcrumb\']'?: TemplateResult;
  'slot[name=\'sticky-breadcrumb\']'?: TemplateResult;
  'slot[name=\'sticky-button\']'?: TemplateResult;
  'slot[name=\'additional\']'?: TemplateResult;
  'slot[name=\'left-header\']'?: TemplateResult;
  'slot[name=\'right-header\']'?: TemplateResult;
  'standard-spacing'?: boolean;
  'auto-process-spacing-value'?: boolean;
  style?: string;
  // CSS variables for layout customization
  '--toggle-left-column-panel-width'?: string;
  '--toggle-right-column-panel-width'?: string;
  '--column-layout-main-content-padding-x'?: string;
  '--column-layout-main-content-padding-top'?: string;
  '--column-layout-main-content-padding-bottom'?: string;
  '--column-layout-left-panel-padding-x'?: string;
  '--column-layout-left-panel-padding-y'?: string;
  '--column-layout-left-panel-padding-top'?: string;
  '--column-layout-left-panel-padding-bottom'?: string;
  '--column-layout-right-panel-padding-x'?: string;
  '--column-layout-right-panel-padding-y'?: string;
  '--column-layout-right-panel-padding-top'?: string;
  '--column-layout-right-panel-padding-bottom'?: string;
  '--column-layout-left-header-padding-x'?: string;
  '--column-layout-right-header-padding-x'?: string;
  '--column-layout-max-container-height'?: string;
  '--column-layout-sticky-bar-height'?: string;
  '--column-layout-additional-offset'?: string;
  '--column-layout-border-color'?: string;
  '--grid-column-padding-x'?: string;
  '--grid-column-padding-y'?: string;
  '--grid-column-border'?: string;
  '--min-scrollbar-padding-x'?: string;
  '--sc-spacing-20'?: string;
  '--sc-spacing-24'?: string;
  '--sc-layout-header-bar-background-color'?: string;
  '--sc-layout-border-bottom-color'?: string;
  '--sc-sticky-header-border-bottom-width'?: string;
  '--left-column-width'?: string;
  '--right-column-width'?: string;
  
}

const Template: Story<ArgTypes> = ({
    title = '',
    layout = 'Main Content Right',
    height = 'auto',
    ...props
  }: ArgTypes) => {
  
  const key = Object.entries(props).reduce((acc, cur) => {
    if (cur[0].startsWith('slot')) {
      return `${acc}${cur[0]}:${!!cur[1]};`;
    }
    return acc;
  }, ''); // to force re-render when args change, especially for slots content which will not trigger re-render by default

  const slotOptions = {
    hasTitle: !!title || !!props['slot[name=\'title\']'],
    hasBreadCrumb: !!props['slot[name=\'breadcrumb\']'],
    hasAdditional: !!props['slot[name=\'additional\']'],
    hasStickyButton: !!props['slot[name=\'sticky-button\']'],
    hasStickyHeader: !!props['slot[name=\'sticky-breadcrumb\']'],
    hasLeftTitle: !!props['slot[name=\'left-header\']'],
    hasRightTitle: !!props['slot[name=\'right-header\']'],
  };
  // Compose style string from CSS variable args for demo
  const cssVars = [
    '--toggle-left-column-panel-width',
    '--toggle-right-column-panel-width',
    '--column-layout-main-content-padding-x',
    '--column-layout-main-content-padding-top',
    '--column-layout-main-content-padding-bottom',
    '--column-layout-left-panel-padding-x',
    '--column-layout-left-panel-padding-y',
    '--column-layout-left-panel-padding-top',
    '--column-layout-left-panel-padding-bottom',
    '--column-layout-right-panel-padding-x',
    '--column-layout-right-panel-padding-y',
    '--column-layout-right-panel-padding-top',
    '--column-layout-right-panel-padding-bottom',
    '--column-layout-left-header-padding-x',
    '--column-layout-right-header-padding-x',
    '--column-layout-max-container-height',
    '--column-layout-sticky-bar-height',
    '--column-layout-additional-offset',
    '--column-layout-border-color',
    '--grid-column-padding-x',
    '--grid-column-padding-y',
    '--grid-column-border',
    '--min-scrollbar-padding-x',
    '--sc-spacing-20',
    '--sc-spacing-24',
    '--sc-layout-header-bar-background-color',
    '--sc-layout-border-bottom-color',
    '--sc-sticky-header-border-bottom-width',
    '--left-column-width',
    '--right-column-width',
  ];
  const styleString = cssVars
    .map(v => ((props as Record<string, any>)[v] ? `${v}: ${(props as Record<string, any>)[v]};` : ''))
    .filter(Boolean)
    .join('\n');

  return html`
    ${keyed(`${key}`, html`
      <sc-column-layout
        layout=${layout}
        height=${height}
        ?unfloatable=${props['unfloatable']}
        ?compact=${props['compact']}
        type=${props['type'] || 'page'}
        ?left-column-collapsible=${props['left-column-collapsible']}
        ?left-column-collapse=${props['left-column-collapse']}
        ?left-divider-invisible=${props['left-divider-invisible']}
        ?left-column-resizable=${props['left-column-resizable']}
        left-column-width=${props['left-column-width']}
        ?left-header-divider=${props['left-header-divider']}
        ?hide-zoom=${props['hide-zoom']}
        ?right-column-collapsible=${props['right-column-collapsible']}
        ?right-column-collapse=${props['right-column-collapse']}
        ?disable-auto-collapse=${props['disable-auto-collapse']}
        ?right-divider-invisible=${props['right-divider-invisible']}
        ?right-column-resizable=${props['right-column-resizable']}
        right-column-width=${props['right-column-width']}
        ?right-header-divider=${props['right-header-divider']}
        right-column-size=${props['right-column-size']}
        ?fix-sticky-bar=${props['fix-sticky-bar']}
        ?standard-spacing=${props['standard-spacing']}
        ?auto-process-spacing-value=${props['auto-process-spacing-value']}
        additional-height=${props['additional-height']}
        additional-slot-height=${props['additional-slot-height']}
        style=${`${styleString} ${props['style'] || ''}`}         
        
      >
        ${
          slotOptions.hasTitle ? html`
            <div slot="title">${title ? title : props['slot[name=\'title\']']}</div>
          ` : nothing
        }
        ${
          slotOptions.hasBreadCrumb ? html`
            <div slot="breadcrumb">${props['slot[name=\'breadcrumb\']']}</div>
          ` : nothing
        }
        ${
          slotOptions.hasAdditional ? html`
            <div slot="additional">${props['slot[name=\'additional\']']}</div>
          ` : nothing
        }
        ${
          slotOptions.hasStickyButton ? html`
            <div slot="sticky-button">${props['slot[name=\'sticky-button\']']}</div>
          ` : nothing
        }
        ${
          slotOptions.hasStickyHeader ? html`
            <div slot="sticky-breadcrumb">${props['slot[name=\'sticky-breadcrumb\']']}</div>
          ` : nothing
        }
        <div
          slot="${layout === 'Main Content Middle' ||
          layout === 'Main Content Right'
            ? 'left'
            : 'middle'}"
        >
          <sc-list-navigation>
            <sc-list-navigation-item
              title="Client information"
              selected
            ></sc-list-navigation-item>
            <sc-list-navigation-item title="Services"></sc-list-navigation-item>
          </sc-list-navigation>
        </div>
        <div slot="${layout === 'Main Content Right' ? 'middle' : 'right'}" style="padding: 12px;">
          <sc-box>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi
            ultrices massa, consectetur mi ullamcorper sed cras aliquam. Et
            phasellus varius nisl et cras sagittis.
          </sc-box>
        </div>
        ${slotOptions.hasLeftTitle
          ? html`
            <div slot="left-header">${props['slot[name=\'left-header\']']}</div>
          ` : nothing
        }
        ${slotOptions.hasRightTitle
          ? html`
            <div slot="right-header">${props['slot[name=\'right-header\']']}</div>
          ` : nothing
        }
        
        <div
          slot="${layout === 'Main Content Left'
            ? 'left'
            : layout === 'Main Content Right'
            ? 'right'
            : layout === 'Main Content Full'
            ? 'content'
            : 'middle'}"
          style="${layout === 'Main Content Right' && height === 'cover' ? 'margin-top: 20px;' : ''}"
        >
          <sc-box height="100%" style="margin-top: 12px;">
            <h3>Client information</h3>
            <sc-spacer vertical size="md"></sc-spacer>
            <div>
              <sc-grid-row>
                <sc-grid-column xs="3">Legal entity name</sc-grid-column>
                <sc-grid-column xs="9">BR Advisors HK Ltd</sc-grid-column>
              </sc-grid-row>
              <sc-spacer vertical size="sm"></sc-spacer>
              <sc-grid-row>
                <sc-grid-column xs="3">Registered address</sc-grid-column>
                <sc-grid-column xs="9">Hong Kong</sc-grid-column>
              </sc-grid-row>
              <sc-spacer vertical size="sm"></sc-spacer>
              <sc-grid-row>
                <sc-grid-column xs="3">Operational address</sc-grid-column>
                <sc-grid-column xs="9">-</sc-grid-column>
              </sc-grid-row>
              <sc-spacer vertical size="sm"></sc-spacer>
              <sc-grid-row>
                <sc-grid-column xs="3">Incorporation number</sc-grid-column>
                <sc-grid-column xs="9">-</sc-grid-column>
              </sc-grid-row>
              <sc-spacer vertical size="xs"></sc-spacer>
            </div>
          </sc-box>
        </div>
      </sc-column-layout>
    `)
    }
  `;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Default',
  'slot[name=\'sticky-breadcrumb\']': html`
    <sc-title level="4"><strong>Column Layout</strong></sc-title>
  `,
  'slot[name=\'sticky-button\']': html` <sc-button fill>Save</sc-button> `,
};

export const MainContentRightWithLinedLayout = Template.bind({});
MainContentRightWithLinedLayout.args = {
  height: 'cover',
  'slot[name=\'left-header\']': html`
    Left Navigation
  `,
  'left-column-collapsible': true,
  'left-header-divider': true,
  'slot[name=\'right-header\']': html`
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <sc-title>Page with left navigation - cover</sc-title>
      <sc-button>Create</sc-button>
    </div>
  `,
  'right-header-divider': true,
  style: `
    --sc-layout-top-offset: 0rem;
    --sc-layout-bottom-offset: 0rem;
    --sc-layout-left-offset: 0.75rem;
    --sc-layout-right-offset: 0.75rem;
  `,
};

// ---------------------------------------------------------------------------
// Complex left navigation + case list (based on BPMN-Online case list view)
// ---------------------------------------------------------------------------
const CaseListTemplate: Story<ArgTypes> = () => html`
  <sc-column-layout
    layout="Main Content Right"
    height="cover"
    unfloatable
    left-column-collapsible
    left-header-divider
    right-header-divider
    style="
      --sc-layout-top-offset: 0rem;
      --sc-layout-bottom-offset: 0rem;
    "
  >
    <!-- Left header: search box -->
    <div slot="left-header" style="display: flex; align-items: center; gap: 6px; width: 100%;">
      <sc-search-field
        size="md"
        class="sc-search-field"
        threshold="3"
        style="flex: 1; --sc-form-group-help-margin-top: 0;"
      ></sc-search-field>
    </div>

    <!-- Left: scrollable workflow navigation list -->
    <div slot="left" style="padding-top: 12px;">
      <sc-list-navigation 
        no-border 
        spacing-size="none"
        style="--sc-list-navigation-margin: var(--sc-spacing-8)">
        <sc-list-navigation-item title="Type 1" selected></sc-list-navigation-item>
        <sc-list-navigation-item title="Type 2"></sc-list-navigation-item>
        <sc-list-navigation-item title="Type 3"></sc-list-navigation-item>
        <sc-list-navigation-item title="Type 4"></sc-list-navigation-item>
      </sc-list-navigation>
    </div>

    <!-- Right header: selected workflow name + primary action -->
    <div slot="right-header" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <sc-title level="4" style="margin: 0;">Type 1</sc-title>
      <sc-button fill size="sm">Create new case</sc-button>
    </div>

    <!-- Right: case list content area -->
    <div slot="right" style="padding: 16px 12px;">

      <!-- Summary stat cards -->
      <sc-grid-row style="margin-bottom: 20px;">
        <sc-grid-column xs="4">
          <div
            style="border: 1px solid #e8e8e8; border-radius: 8px;
              padding: 20px; text-align: center;"
          >
            <sc-paragraph
              style="margin-bottom: 8px;
                color: var(--sc-color-neutral-500, #595959);"
            >Submitted</sc-paragraph>
            <sc-title level="2" style="margin: 0; line-height: 1;">1</sc-title>
          </div>
        </sc-grid-column>
        <sc-grid-column xs="4">
          <div
            style="border: 1px solid #e8e8e8; border-radius: 8px;
              padding: 20px; text-align: center;"
          >
            <sc-paragraph
              style="margin-bottom: 8px;
                color: var(--sc-color-neutral-500, #595959);"
            >Approved</sc-paragraph>
            <sc-title level="2" style="margin: 0; line-height: 1;">0</sc-title>
          </div>
        </sc-grid-column>
        <sc-grid-column xs="4">
          <div
            style="border: 1px solid #e8e8e8; border-radius: 8px;
              padding: 20px; text-align: center;"
          >
            <sc-paragraph
              style="margin-bottom: 8px;
                color: var(--sc-color-neutral-500, #595959);"
            >Rejected</sc-paragraph>
            <sc-title level="2" style="margin: 0; line-height: 1;">0</sc-title>
          </div>
        </sc-grid-column>
      </sc-grid-row>

      <!-- Case number search bar -->
      <div style="margin-bottom: 16px;">
        <sc-paragraph style="margin: 0 0 4px; font-weight: 500;">Case no.</sc-paragraph>
        <div style="display: flex; gap: 8px; align-items: center;">
          <sc-formatted-input placeholder="Input here" style="width: 220px;"></sc-formatted-input>
          <sc-button type="outline" size="sm">Clear</sc-button>
          <sc-button fill size="sm">Search</sc-button>
        </div>
      </div>

      <!-- Action toolbar -->
      <div style="display: flex; justify-content: flex-end; align-items: center; gap: 4px; margin-bottom: 8px;">
        <sc-button type="text" size="sm">Bulk actions</sc-button>
        <sc-button type="text" size="sm">Export</sc-button>
        <sc-icon-button name="list-unordered" type="text" size="sm"></sc-icon-button>
        <sc-icon-button name="layout-grid" type="text" size="sm"></sc-icon-button>
      </div>

      <!-- Case table -->
      <div style="border: 1px solid #e8e8e8; border-radius: 8px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="background: #fafafa;">
              <th style="padding: 10px 12px; text-align: left;
                border-bottom: 1px solid #e8e8e8; width: 32px;"></th>
              <th style="padding: 10px 12px; font-weight: 600; text-align: left;
                border-bottom: 1px solid #e8e8e8;">Case no.</th>
              <th style="padding: 10px 12px; font-weight: 600; text-align: left;
                border-bottom: 1px solid #e8e8e8;">State</th>
              <th style="padding: 10px 12px; font-weight: 600; text-align: left;
                border-bottom: 1px solid #e8e8e8;">Requested by</th>
              <th style="padding: 10px 12px; font-weight: 600; text-align: left;
                border-bottom: 1px solid #e8e8e8;">Last updated</th>
              <th style="padding: 10px 12px; font-weight: 600; text-align: left;
                border-bottom: 1px solid #e8e8e8;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px;"><input type="checkbox" /></td>
              <td style="padding: 12px;">
                <a href="#"
                  style="color: var(--sc-color-primary-500, #1677ff);
                    text-decoration: none; font-weight: 500;"
                >BNO-PUR6E7WX</a>
              </td>
              <td style="padding: 12px;">
                <sc-dot-status type="info">Submitted</sc-dot-status>
              </td>
              <td style="padding: 12px; color: var(--sc-color-primary-500, #1677ff);">Masked, Jaden</td>
              <td style="padding: 12px;">09 May 2026</td>
              <td style="padding: 12px;">
                <sc-icon-button name="more-horizontal" type="text" size="sm"></sc-icon-button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div
          style="display: flex; justify-content: flex-end; align-items: center;
            gap: 6px; padding: 10px 12px; border-top: 1px solid #e8e8e8;
            font-size: 0.875rem; color: #666;"
        >
          <sc-icon-button name="skip-back" type="text" size="sm" disabled></sc-icon-button>
          <sc-icon-button name="arrow-ios-back" type="text" size="sm" disabled></sc-icon-button>
          <span
            style="background: var(--sc-color-primary-500, #1677ff);
              color: white; border-radius: 4px; padding: 2px 8px;
              font-size: 0.75rem;"
          >1</span>
          <sc-icon-button name="arrow-ios-forward" type="text" size="sm"></sc-icon-button>
          <sc-icon-button name="skip-forward" type="text" size="sm"></sc-icon-button>
          <span>10 / page</span>
          <span>Go to</span>
        </div>
      </div>
    </div>
  </sc-column-layout>
`;

export const CaseListWithNavigation = CaseListTemplate.bind({});

export const MainContentFull = Template.bind({});
MainContentFull.args = {
  title: 'Main Content Full - cover',
  height: 'cover',
  layout: 'Main Content Full',
};

export const MainContentLeft = Template.bind({});
MainContentLeft.args = {
  title: 'Main Content Left - cover',
  height: 'cover',
  layout: 'Main Content Left',
};

// ---------------------------------------------------------------------------
// Case detail view: Main Content Left layout (large main area + right info panel)
// Based on case detail page: workflow stepper + right details panel
// ---------------------------------------------------------------------------
const CaseDetailTemplate: Story<ArgTypes> = () => html`
  <sc-column-layout
    layout="Main Content Left"
    height="cover"
    right-header-divider
    unfloatable
    right-column-collapsible
    style="
      --sc-layout-top-offset: 0rem;
      --sc-layout-bottom-offset: 0rem;
      --sc-layout-right-offset: 0rem;
      --sc-layout-left-offset: 0rem;
      --sc-layout-grid-column-padding-x: 0rem;
    "
  >
    <!-- Main (left) area: case header + workflow stepper + task content -->
    <div slot="left" style="display: flex; flex-direction: column;">

      <!-- Case header bar -->
      <div
        style="display: flex; align-items: center;
          justify-content: space-between;
          padding: 10px 16px; border-bottom: 1px solid #e8e8e8;"
      >
        <sc-title level="4" style="margin: 0;">Test detail</sc-title>
        <div style="display: flex; gap: 8px; align-items: center;">
          <sc-icon-button name="more-horizontal" type="text" size="sm"></sc-icon-button>
          <sc-icon-button name="refresh" type="text" size="sm"></sc-icon-button>
          <sc-button type="outline" size="sm">Failed</sc-button>
          <sc-button fill size="sm">Success</sc-button>
        </div>
      </div>

      <!-- Horizontal workflow stepper -->
      <div style="padding: 0 16px; border-bottom: 1px solid #e8e8e8;">
        <sc-stepper title-position="right" direction="horizontal" mode="compact">
          <sc-step status="finish" title="Step 1"></sc-step>
          <sc-step status="finish" title="Step 2"></sc-step>
          <sc-step active title="Step 3"></sc-step>
        </sc-stepper>
      </div>

      <!-- Active task content -->
      <div style="flex: 1; padding: 24px 16px;">
        <sc-box style="width: 100%;">
          <sc-paragraph>Passthru Component — Click to Continue</sc-paragraph>
          <sc-paragraph
            style="color: var(--sc-color-neutral-400, #8c8c8c);
              margin-top: 4px;"
          >updated 10:52 AM</sc-paragraph>
        </sc-box>
      </div>
    </div>

    <!-- Right panel header: "Details" title -->
    <div slot="right-header">
      <sc-title level="5" style="margin: 0;">Details</sc-title>
    </div>

    <!-- Right panel body: tabbed case info -->
    <div slot="right">
      <sc-tab-group>
        <sc-tab slot="nav" panel="info" active>Info</sc-tab>
        <sc-tab slot="nav" panel="comments">Comments</sc-tab>
        <sc-tab slot="nav" panel="links">Links</sc-tab>

        <div slot="body" panel="info" style="padding: 16px 12px;">
          <div style="display: flex; flex-direction: column; gap: 16px; font-size: 0.875rem;">

            <div>
              <sc-paragraph
                style="margin: 0 0 2px;
                  color: var(--sc-color-neutral-500, #595959); font-size: 0.75rem;"
              >Case no.</sc-paragraph>
              <sc-paragraph style="margin: 0; font-weight: 500;">AMF-PUBARZ11</sc-paragraph>
            </div>

            <div>
              <sc-paragraph
                style="margin: 0 0 4px;
                  color: var(--sc-color-neutral-500, #595959); font-size: 0.75rem;"
              >Status</sc-paragraph>
              <sc-dot-status type="info">Submitted</sc-dot-status>
            </div>

            <div>
              <sc-paragraph
                style="margin: 0 0 4px;
                  color: var(--sc-color-neutral-500, #595959); font-size: 0.75rem;"
              >Requested by</sc-paragraph>
              <div style="display: flex; align-items: center; gap: 8px;">
                <sc-avatar size="sm" initials="MP"></sc-avatar>
                <a href="#"
                  style="color: var(--sc-color-primary-500, #1677ff);
                    text-decoration: none; font-size: 0.875rem;"
                >Masked, Paxton</a>
              </div>
            </div>

            <div>
              <sc-paragraph
                style="margin: 0 0 2px;
                  color: var(--sc-color-neutral-500, #595959); font-size: 0.75rem;"
              >Requested on</sc-paragraph>
              <sc-paragraph style="margin: 0;">08 Sep 2025 15:40</sc-paragraph>
            </div>

            <div>
              <sc-paragraph
                style="margin: 0 0 2px;
                  color: var(--sc-color-neutral-500, #595959); font-size: 0.75rem;"
              >Due date</sc-paragraph>
              <sc-paragraph
                style="margin: 0; color: var(--sc-color-neutral-400, #8c8c8c);"
              >-</sc-paragraph>
            </div>

            <div>
              <a href="#"
                style="color: var(--sc-color-primary-500, #1677ff);
                  text-decoration: none; font-size: 0.875rem;
                  display: inline-flex; align-items: center; gap: 4px;"
              >
                <sc-icon name="expand" size="xs"></sc-icon>
                View more
              </a>
            </div>

          </div>
        </div>
      </sc-tab-group>
    </div>
  </sc-column-layout>
`;

export const CaseDetailLayout = CaseDetailTemplate.bind({});

export const MainContentMiddle = Template.bind({});
MainContentMiddle.args = {
  title: 'Main Content Middle - cover',
  height: 'cover',
  layout: 'Main Content Middle',
};

export const LeftColumnCollapsible = Template.bind({});
LeftColumnCollapsible.args = {
  title: 'Left Column Collapsible',
  layout: 'Main Content Middle',
  'left-column-collapsible': true,
};

export const RightColumnCollapsible = Template.bind({});
RightColumnCollapsible.args = {
  title: 'Right Column Collapsible',
  layout: 'Main Content Middle',
  'right-column-collapsible': true,
};

export const Custom = Template.bind({});
Custom.args = {
  title: 'Custom',
  height: 'cover',
  'slot[name=\'title\']': html`
    <div style="display: flex; justify-content: space-between;">
      <h2>Layout: with additional content</h2>
      <div>
        <sc-button fill size="md">Plugin level button</sc-button>
      </div>
    </div>
  `,
  'slot[name=\'breadcrumb\']': html`
    <sc-breadcrumb>
      <sc-breadcrumb-item href="#" target="_blank"> Home</sc-breadcrumb-item>
      <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
      <sc-breadcrumb-item>Color</sc-breadcrumb-item>
    </sc-breadcrumb>
  `,
  'slot[name=\'additional\']': html` Additional information here! `,
  'additional-height': '50px',
};

const StickyTemplate: Story<ArgTypes> = ({
  title = '',
  layout = 'Main Content Right',
  height = 'auto',
  ...props
}: ArgTypes) => {
  return html`
    <sc-column-layout
      layout=${layout}
      height=${height}
      ?right-column-collapsible=${props['right-column-collapsible']}
      ?right-column-collapse=${props['right-column-collapse']}
      ?fix-sticky-bar=${props['fix-sticky-bar']}
      additional-height=${props['additional-height']}
      additional-slot-height=${props['additional-slot-height']}
    >
      <div slot="title">${title ? title : props['slot[name=\'title\']']}</div>
      <div slot="sticky-breadcrumb">
        ${props['slot[name=\'sticky-breadcrumb\']']}
      </div>
      <div slot="sticky-button">${props['slot[name=\'sticky-button\']']}</div>
      <div slot="additional">${props['slot[name=\'additional\']']}</div>
      <div
        slot="${layout === 'Main Content Middle' ||
        layout === 'Main Content Right'
          ? 'left'
          : 'middle'}"
      >
        <sc-list-navigation>
          <sc-list-navigation-item
            title="Client information"
            selected
          ></sc-list-navigation-item>
          <sc-list-navigation-item title="Services"></sc-list-navigation-item>
        </sc-list-navigation>
      </div>
      <div slot="${layout === 'Main Content Right' ? 'middle' : 'right'}">
        <sc-box>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi
          ultrices massa, consectetur mi ullamcorper sed cras aliquam. Et
          phasellus varius nisl et cras sagittis.
        </sc-box>
      </div>
      <div
        slot="${layout === 'Main Content Left'
          ? 'left'
          : layout === 'Main Content Right'
          ? 'right'
          : layout === 'Main Content Full'
          ? 'content'
          : 'middle'}"
      >
        <sc-box height="100%">
          <h3>Client information</h3>
          <sc-spacer vertical size="md"></sc-spacer>
          <div>
            <sc-grid-row>
              <sc-grid-column xs="3">Legal entity name</sc-grid-column>
              <sc-grid-column xs="9">BR Advisors HK Ltd</sc-grid-column>
            </sc-grid-row>
            <sc-spacer vertical size="sm"></sc-spacer>
            <sc-grid-row>
              <sc-grid-column xs="3">Registered address</sc-grid-column>
              <sc-grid-column xs="9">Hong Kong</sc-grid-column>
            </sc-grid-row>
            <sc-spacer vertical size="sm"></sc-spacer>
            <sc-grid-row>
              <sc-grid-column xs="3">Operational address</sc-grid-column>
              <sc-grid-column xs="9">-</sc-grid-column>
            </sc-grid-row>
            <sc-spacer vertical size="sm"></sc-spacer>
            <sc-grid-row>
              <sc-grid-column xs="3">Incorporation number</sc-grid-column>
              <sc-grid-column xs="9">-</sc-grid-column>
            </sc-grid-row>
            <sc-spacer vertical size="xs"></sc-spacer>
          </div>
        </sc-box>
      </div>
    </sc-column-layout>
  `;
};

export const StickyHeader = StickyTemplate.bind({});
StickyHeader.args = {
  title: 'Sticky Header',
  'fix-sticky-bar': true,
  'slot[name=\'sticky-breadcrumb\']': html`
    <sc-breadcrumb>
      <sc-breadcrumb-item href="#" target="_blank"> Home</sc-breadcrumb-item>
      <sc-breadcrumb-item>Guideline</sc-breadcrumb-item>
      <sc-breadcrumb-item>Color</sc-breadcrumb-item>
    </sc-breadcrumb>
  `,
  'slot[name=\'sticky-button\']': html` <sc-button fill>Save</sc-button> `,
};

const ComponentTemplate: Story<ArgTypes> = ({
  layout = 'Main Content Right',
  ...props
}: ArgTypes) => html`
  <div style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; height: 480px;">
    <sc-column-layout
      type="component"
      layout=${layout}
      height="cover"
      ?left-column-collapsible=${props['left-column-collapsible']}
      ?left-header-divider=${props['left-header-divider']}
      ?right-column-collapsible=${props['right-column-collapsible']}
      ?right-header-divider=${props['right-header-divider']}
      right-column-size=${props['right-column-size'] || 'md'}
    >
      <sc-button slot="sticky-button" fill>Save</sc-button>
      <sc-button slot="sticky-button">Cancel</sc-button>
      <div slot="sticky-breadcrumb">
        <sc-title level="5"><strong>Embedded Component</strong></sc-title>
      </div>
      <div slot="left-header">Navigation</div>
      <div slot="left" style="padding: 12px;">
        <sc-list-navigation>
          <sc-list-navigation-item title="Item A" selected></sc-list-navigation-item>
          <sc-list-navigation-item title="Item B"></sc-list-navigation-item>
          <sc-list-navigation-item title="Item C"></sc-list-navigation-item>
        </sc-list-navigation>
      </div>
      <div slot="right-header">Details</div>
      <div slot="right" style="padding: 12px;">
        <sc-box>
          <p>This layout is rendered as <strong>type="component"</strong>.</p>
          <p>The sticky action bar is always fixed at the top regardless of
          scroll position, and no window scroll listener is attached.</p>
        </sc-box>
      </div>
    </sc-column-layout>
  </div>
`;

export const ComponentType = ComponentTemplate.bind({});
ComponentType.args = {
  title: 'Column Layout - Component Type',
  layout: 'Main Content Right',
  'left-column-collapsible': true,
  'left-header-divider': true,
  'right-header-divider': true,
};
