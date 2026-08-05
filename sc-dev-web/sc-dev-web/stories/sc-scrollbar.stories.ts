import { html, nothing, TemplateResult } from 'lit';
import { FormArgTypes, removeUndefined } from './utils/FormArg.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

const description = `
ScScrollbar is a decorator component that can apply design compliant scrollbar styles and behaviour to scrollable elements.

There are 3 strategies to integrate with a scrollable element:
1. [Scrollable Child](#scrollable-child) — using the default slot to wrap a scrollable element. Recommended when starting fresh. \`sc-scrollbar\` becomes display:block and can be styled.
2. [Scrollable Sibling](#scrollable-sibling) — leaving the \`selector\` attribute blank to select the next sibling element. Recommended when updating existing work.
3. [Scrollable Selector](#scrollable-selector) — using the \`selector\` attribute to query select a scrollable element. Recommended when the scrollable element cannot be a sibling. *Ensure \`sc-scrollbar\` is before the scrollable element in the DOM*.
3. [Multiple Sync](#multiple-sync) — using the \`sync-selector-all\` attribute to query select multiple scrollable element. Does not attach custom scrollbars on the element. This is an advanced implementation, use with caution.


*Note*: The scrollable element can only have css \`position:static\` and will attach custom css classes. 

CSS classes \`-sc-scroll-target\`, \`-sc-scroll-no-y\`, \`-sc-scroll-no-x\`, \`-sc-scroll-gutter-none\`, \`-sc-scroll-gutter-auto\`, \`-sc-scroll-gutter-stable\`, \`-sc-scroll-gutter-stable-both\`, \`-sc-scroll-xs\`, \`-sc-scroll-sm\`, \`-sc-scroll-lg\`, \`-sc-scroll-xl\`

*Out of scope*: selecting \`body\` is not supported, wrap in a scrollable div instead.`;

export default {
  title: 'Components/Scrollbar',
  component: 'sc-scrollbar',
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: removeUndefined({
    selector: {
      control: 'text',
      description: `Only when slot is not used. Query selector for which element is scrollable. 
        Must query-able from the same root DOM (shadowDOM).
        If blank string, selects next sibling element.`,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'sync-selector-all': {
      control: 'text',
      description: `Additional selector for elements to only sync scrolls with.
        If **selector** is not set, you will have to be manually position this element.`,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'no-y': {
      control: 'boolean',
      description: 'No vertical scrollbar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'no-x': {
      control: 'boolean',
      description: 'No horizontal scrollbar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'xs', 'default', 'lg', 'xl'],
      description: 'Type of the slider.',
      table: {
        type: { summary: '"xs" | "sm" | "lg" | "xl"' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    opaque: {
      control: 'boolean',
      description: 'Make the scrollbar background not transparent. Required for **border** or **round**.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    border: {
      control: 'boolean',
      description: 'Show border around scrollbar',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'opaque', eq: true },
    },
    round: {
      control: 'boolean',
      description: 'Show scrollbar with rounded corners',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'opaque', eq: true },
    },
    gutter: {
      control: 'inline-radio',
      options: ['none', 'auto', 'stable', 'stable-both'],
      description: `Shows gutter on scrollable element.

- **none** — scrollbar appears above content. 
- **auto** — keeps space only when content overflows. 
- **stable** — always keeps space regardless of content overflows.
- **stable-both** — always keeps space on both sides regardless of content overflows.

<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter" target="_blank">mdn</a>`,
      table: {
        type: { summary: '"none" | "auto" | "stable" | "stable-both"' },
        defaultValue: { summary: '"auto"' },
        category: 'Attributes',
      },
    },
    'always-visible': {
      control: 'boolean',
      description: `Always shows the scrollbar.
        **false** will only show scrollbar when scrolling or hovering then automatically hides after some delay.`,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    block: {
      control: 'boolean',
      description: `**true** will \`display:block\`.
        **false** will \`display:contents\`. Otherwise you can also style or set class as needed.`,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'object',
      description:
        'The slotted element will be used as the scrollable target.',
      table: {
        category: 'Slots',
      },
    },
  }),
  args: {
    selector: '',
    'sync-selector-all': undefined,
    'no-y': false,
    'no-x': false,
    size: undefined,
    opaque: false,
    border: false,
    round: false,
    gutter: 'auto',
    'always-visible': false,
    block: false,
    slot: nothing,
  },
};


interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
  parameters?: { docs?: { description?: { story?: string } } };
}

interface ArgTypes extends FormArgTypes {
  id?: string;
  selector?: string;
  'sync-selector-all'?: string;
  'no-y': boolean;
  'no-x': boolean;
  size: 'sm' | 'xs' | 'lg' | 'xl' | 'default';
  opaque: boolean;
  border: boolean;
  round: boolean;
  gutter: '' | 'none' | 'auto' | 'stable' | 'stable-both';
  'always-visible': boolean;
  block: boolean;
}

const ScrollbarTemplate: Story<ArgTypes> = (args: ArgTypes): TemplateResult => html`
  <sc-scrollbar
    selector=${ifDefined(args.selector)}
    sync-selector-all=${ifDefined(args['sync-selector-all'] || undefined)}
    ?no-y=${args['no-y']}
    ?no-x=${args['no-x']}
    size=${ifDefined(args.size === 'default' ? undefined : args.size)}
    ?opaque=${args.opaque}
    ?border=${args.border}
    ?round=${args.round}
    gutter=${ifDefined(args.gutter || undefined)}
    ?always-visible=${args['always-visible']}
    ?block=${args.block}
  >${
    ifDefined(args.slot) === nothing ? ScrollableTemplate(args) : args.slot
  }</sc-scrollbar>
`;
function ScrollableTemplate(args?: ArgTypes) {
  const styles = styleMap({
            'min-width': !args?.['no-x'] ? '100dvw' : undefined,
            'white-space': args?.['no-y'] ? 'nowrap' : undefined,
          });
  return html`
    <div
      id=${ifDefined(args?.selector?.substring(1) || undefined)}
      class="scrollable"
    >
      ${repeat(
        description.split(/[\n\r]/).filter(p => !!p.trim()),
        p => html`<p style=${styles}>${p}</p> `
      )}
    </div>

    <style>.scrollable{max-height:200px;overflow:auto;}</style>
  `;
}

export const ScrollableChild = ScrollbarTemplate.bind({});
(((ScrollableChild.parameters ??= {}).docs ??= {}).description ??=
  {}).story = `Use \`sc-scrollbar\` to wrap a scrollable element. 

By default \`sc-scrollbar\` has \`display:contents\`, use \`block\` attribute or style as needed. Ensure this has \`position:relative\`.`;

const Template2: Story<ArgTypes> = (args: ArgTypes): TemplateResult => {
  args.slot = html``;
  return html`
    ${ScrollbarTemplate(args)}
    ${ScrollableTemplate(args)}
  `;
};

export const ScrollableSibling = Template2.bind({});
(((ScrollableSibling.parameters ??= {}).docs ??= {}).description ??=
  {}).story = `Selects the next sibling element as scrollable target.

  Note: The offset parent will be attached with css styling \`position:absolute\`.
`;

export const ScrollableSelector = Template2.bind({});
ScrollableSelector.args = {
  selector: '#scrollable',
};
(((ScrollableSelector.parameters ??= {}).docs ??= {}).description ??= {}).story =
  `Query select the element as scrollable target. Element must be query-able from the same root DOM (shadowDOM). 

*Ensure \`sc-scrollbar\` is before the scrollable element in the DOM*.

Note: The offset parent will be attached with css styling \`position:absolute\`.
`;

export const MultipleSync: Story<ArgTypes> = (args: ArgTypes): TemplateResult => {
  args.slot = html``;
  return html`<div style="display:flex;flex-direction:row;gap:.5rem;">
    ${ScrollbarTemplate(args)} ${ScrollableTemplate(args)}
    <sc-scrollbar selector="#description"></sc-scrollbar>
    <textarea id="description" class="scrollable">
This is a basic textarea.
      ${description}
    </textarea
    >
    ${ScrollableTemplate({ ...args, selector: '#no-scroll' })}
    <style>
      .scrollable {
        flex: 1;
        height: 200px;
        white-space: nowrap;
      }
      #no-scroll {
        overflow: hidden;
      }
    </style>
  </div>`;
};
MultipleSync.args = {
  selector: '#target',
  'sync-selector-all': '#description, #no-scroll',
  'always-visible': true,
  opaque: true,
  border: true,
};
(((MultipleSync.parameters ??= {}).docs ??= {}).description ??= {}).story =
  `Advanced implementation where you want to sync scroll position of multiple elements.
The \`sync-selector-all\` attribute accepts a CSS selector to specify which elements to sync.

Without selector or slot, \`<sc-scrollbar>\` needs to be positioned manually.
`;

export const RightToLeft: Story<ArgTypes> = (args: ArgTypes): TemplateResult => {
  args.slot = html``;
  return html`<div dir="rtl">
    ${ScrollbarTemplate(args)}
    ${ScrollableTemplate(args)}
  </div>`;
};
(((RightToLeft.parameters ??= {}).docs ??= {}).description ??=
  {}).story = 'RTL is automatically supported';

