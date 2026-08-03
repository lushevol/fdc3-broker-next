/* eslint-disable indent */
import { html, css, LitElement, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import * as allFormatting from './formatsv2.js';
import { TViewContext, TConfiguration } from './typeUtils.js';
import { watch } from '../../shared/watch.js';
import { fontBackColor, fontTextColor } from './constant.js';
import { rgb2hex } from './core/utils.js';
import { Editor } from 'hugerte';
import { CustomToolbarButton, customToolbarButton } from './CustomToolbarButton.js';
import { ScRteActionV2 } from './ScRteActionV2.js';
import ScTheme from '../../styles/ScTheme.js';

const TOOLBAR_GROUPS = {
  history: ['undo', 'redo', 'revisionhistory'],
  ai: ['askai', 'aishortcuts'],
  fontstyle: ['fontstyle'],
  clipboard: ['copy', 'paste'],
  textFormat: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'subscript',
    'superscript',
    'backcolor',
    'forecolor',
    'clear',
  ],
  alignment: [
    'alignleft',
    'aligncenter',
    'alignright',
    'orderedlist',
    'unorderedlist',
    'outdent',
    'indent',
  ],
  insert: ['addlink', 'insertimage', 'unlink', 'quote', 'table'],
} as const;

export class ScRteToolbarV2 extends LitElement {
  static styles = [
    ...ScTheme.getStyles(),
    css`
      :host {
        --sc-icon-color: var(--sc-rich-text-editor-icon-color);
      }

      .rte-toolbar-container {
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        border: 1px solid var(--sc-rte-border-color);
        background: var(--sc-rte-bg-color);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }

      sc-rte-action-v2 {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .separator {
        width: 1px;
        height: 16px;
        background-color: var(--sc-rich-text-editor-separate-color, #d9d9d9);
        margin: 0 0.25rem;
      }

      :host([disabled]) .rte-toolbar-container {
        pointer-events: none;
        user-select: none;
      }

      /* Dropdown styles for grouped toolbar actions */
      .rte-action-dropdown {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
      }

      /* Raise z-index for the active/open dropdown */
      .rte-action-dropdown:has(sl-dropdown[open]) {
        z-index: 1001;
      }

      /* Dropdown panels should be high enough to overlay text area */
      .rte-action-dropdown sl-dropdown::part(panel) {
        z-index: 1000 !important;
      }

      .trigger-button {
        display: flex;
        align-items: center;
      }

      .trigger-button::part(base) {
        color: var(--sc-icon-color);
        width: auto;
        justify-content: start;
        background-color: transparent;
        margin-top: 0;
        border: none;
        padding: 0.125rem 0.25rem;
        transition: background-color 0.2s ease;
      }

      .trigger-button::part(label) {
        flex: 1;
        width: auto;
        text-align: left;
        color: var(--sc-icon-color);
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding-left: 0;
        padding-right: 0;
      }

      .trigger-button::part(caret) {
        font-size: 1rem;
        margin-left: 0.75rem;
      }

      .trigger-button:hover::part(caret) {
        color: var(--sc-color-blue-700);
      }

      .dropdown-content {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid
          var(--sc-dropdown-border-color, var(--sc-color-grey-150));
        background: var(--sc-dropdown-background-color, var(--sc-color-white));
        box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
      }

      .more-tools-dropdown {
        margin-left: auto;
      }
    `,
  ];

  // Fixed breakpoints for consistency
  private readonly _breakpoints = {
    mobile: 500, // Below 500px = mobile view
    largeMobile: 660, // 500px - 659px = large mobile view
    tablet: 840, // 660px to 839px = tablet view
    largeTablet: 990, // 840px to 989px = large tablet view
  }; // Desktop mode will be anything above

  @query('#fg-color') fgColorInput!: HTMLInputElement;
  @query('#bd-color') bdColorInput!: HTMLInputElement;
  @query('.rte-toolbar-container') private _toolbarContainer!: HTMLElement;

  @state() private _currentMode:
    | 'mobile'
    | 'largeMobile'
    | 'tablet'
    | 'largeTablet'
    | 'desktop' = 'desktop';
  @state() private _openDropdown: any = null;

  @state()
  viewContext: TViewContext = {};

  @property({ type: Object })
  range: Range | null = null;

  @property({ type: Array })
  selectedNodes: Element[];

  @property({ type: Object })
  focusedElOfViewer: HTMLElement;

  @property({ type: Boolean })
  replace = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Array }) toolbar: Array<
    Partial<keyof typeof allFormatting>
  > = [];
  @property({ type: Array }) customToolbarButtons: Array<CustomToolbarButton> =
    [];
  @property({ type: Object }) editorInstance: Editor | null = null;

  @property({ type: Object, attribute: 'configuration' })
  configuration: TConfiguration = {
    toolbar: {
      maxImageSize: 1024,
    },
  };

  private _resizeObserver: ResizeObserver | null = null;
  private _debounceTimer: number | null = null;
  private _mouseTarget?: HTMLElement;

  private get _hasAiTools(): boolean {
    return TOOLBAR_GROUPS.ai.some(item => this.toolbar.includes(item as any));
  }

  private get _hasClipboardTools(): boolean {
    return TOOLBAR_GROUPS.clipboard.some(item =>
      this.toolbar.includes(item as any)
    );
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    try {
      this.initialiseProperties();
      // Set initial selection state
      this.viewContext['is-selection-collapsed'] = true;

      // Setup after initial render
      this.updateComplete.then(() => {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => this._setupResizeObserver(), 100);
      });
    } catch (error) {
      console.error('Error initializing toolbar:', error);
    }
    window.addEventListener('mouseup', this._handleWindowMouseUp);
    this.addEventListener('focus', this._handleFocus);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    window.removeEventListener('mouseup', this._handleWindowMouseUp);
    this.removeEventListener('focus', this._handleFocus);
  }

  // Responsive Layout Manager
  private _setupResizeObserver(): void {
    if (!this._toolbarContainer) return;

    // Calculate the mode
    const calculateMode = (
      width: number
    ): 'mobile' | 'largeMobile' | 'tablet' | 'largeTablet' | 'desktop' => {
      if (width < this._breakpoints.mobile) return 'mobile';
      if (width < this._breakpoints.largeMobile) return 'largeMobile';
      if (width < this._breakpoints.tablet) return 'tablet';
      if (width < this._breakpoints.largeTablet) return 'largeTablet';
      return 'desktop';
    };

    this._resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries.length) return;
      if (this._debounceTimer) clearTimeout(this._debounceTimer);

      this._debounceTimer = setTimeout(() => {
        const borderBoxWidth = entries[0].borderBoxSize[0].inlineSize;
        const newMode = calculateMode(borderBoxWidth);

        if (newMode !== this._currentMode) {
          this._currentMode = newMode;
          this._closeOpenDropdown();
          this._hideAllTooltips();
        }
      }, 150) as any;
    });

    this._resizeObserver.observe(this._toolbarContainer);

    // Perform an initial check using the same logic
    const initialWidth = this._toolbarContainer.offsetWidth;
    if (initialWidth > 0) {
      const initialMode = calculateMode(initialWidth);
      if (initialMode !== this._currentMode) {
        this._currentMode = initialMode;
      }
    }
  }

  private _closeOpenDropdown(): void {
    if (this._openDropdown) {
      try {
        this._openDropdown.hide();
      } catch (e) {
        // Ignore errors from dropdowns that may already be destroyed
      }
      this._openDropdown = null;
    }
  }

  private _handleDropdownShow(event: Event): void {
    event.stopPropagation();

    const openingDropdown = event.target as HTMLElement;

    // Hide any lingering tooltips
    this._hideAllTooltips();

    // Close other dropdown but avoid closing parent dropdowns
    const allDropdowns = this.renderRoot.querySelectorAll('sl-dropdown');
    allDropdowns.forEach(dropdown => {
      if ((dropdown as any).open && !dropdown.contains(openingDropdown)) {
        (dropdown as any).hide();
      }
    });

    this._openDropdown = openingDropdown;
  }

  private _handleDropdownHide(event: Event): void {
    event.stopPropagation();
    this._openDropdown = null;
    this._hideAllTooltips();
  }

  private _hideAllTooltips(): void {
    const actions = this.renderRoot.querySelectorAll('sc-rte-action-v2');
    actions.forEach(action => {
      (action as ScRteActionV2).hideTooltip();
    });
  }

  private _handleToolbarMouseLeave(): void {
    const allActions = this.renderRoot.querySelectorAll('sc-rte-action-v2');
    allActions.forEach(action => {
      (action as ScRteActionV2).hideTooltip();
      (action as ScRteActionV2).removeHoverState();
    });
  }
  
  private _handleMouseDown(event: MouseEvent): void {
    // prevent focus change
    event.preventDefault();
    this._mouseTarget = event.target as HTMLElement;
  }
  private _handleWindowMouseUp = (): void => {
    setTimeout(() => 
    this._mouseTarget = undefined, 1);
  };
  private _handleFocus = (): void => {
    if (this._mouseTarget)
      this.editorInstance?.iframeElement?.focus();
  };


  // Rendering helpers
  private _renderItems(itemNames: readonly string[]): TemplateResult[] {
    return itemNames
      .filter(name => this.toolbar.includes(name as any))
      .map(name =>
        (allFormatting as any)[name]?.(this.viewContext, this.focusedElOfViewer)
      )
      .filter(Boolean);
  }

  private _renderDropdown(
    icon: string,
    label: string,
    itemNames: readonly string[]
  ): TemplateResult | null {
    const items = this._renderItems(itemNames);
    if (items.length === 0) return null;

    return html`
      <div class="rte-action-dropdown" part="rte-action-dropdown">
        <sl-dropdown
          distance="6"
          hoist
          placement="bottom-start"
          @sl-hide=${this._handleDropdownHide}
          @sl-show=${this._handleDropdownShow}
          @mousedown=${this._handleMouseDown}
        >
          <sl-button
            class="trigger-button"
            slot="trigger"
            caret
            size="small"
            title=""
            @mousedown=${this._handleMouseDown}
          >
            <sc-icon name="${icon}" size="sm"></sc-icon>
          </sl-button>
          <div class="dropdown-content">${items}</div>
        </sl-dropdown>
      </div>
    `;
  }

  private _renderMoreDropdownForMobile(
    content: TemplateResult[]
  ): TemplateResult {
    return html`
      <div
        class="rte-action-dropdown more-tools-dropdown"
        part="rte-action-dropdown"
      >
        <sl-dropdown
          distance="6"
          hoist
          placement="bottom-start"
          @sl-hide=${this._handleDropdownHide}
          @sl-show=${this._handleDropdownShow}
        >
          <sl-button
            class="trigger-button"
            slot="trigger"
            size="small"
            title=""
          >
            <sc-icon name="editor-more" size="sm"></sc-icon>
          </sl-button>
          <div class="dropdown-content">${content}</div>
        </sl-dropdown>
      </div>
    `;
  }

  private _renderCustomButtons(): TemplateResult[] {
    return this.customToolbarButtons.map(props =>
      customToolbarButton({
        ...props,
        handler: () => props.handler(this.editorInstance),
      })
    );
  }

  private _renderSeparator(): TemplateResult {
    return html`<div class="separator"></div>`;
  }

  private _assembleToolbar(sections: TemplateResult[][]): TemplateResult[] {
    return sections
      .filter(section => section.length > 0)
      .reduce(
        (acc, curr) =>
          acc.length === 0
            ? [...curr]
            : [...acc, this._renderSeparator(), ...curr],
        [] as TemplateResult[]
      );
  }

  // View layout methods
  private _renderDesktopView(): TemplateResult[] {
    // Group [Alignment] ONLY if BOTH [AI] and [Copy/Paste] is enabled
    const shouldGroupAlignment = this._hasAiTools && this._hasClipboardTools;
    // Group [Insert] if EITHER [AI] or [Copy/Paste] is enabled.
    const shouldGroupInsert = this._hasAiTools || this._hasClipboardTools;

    const allSections: TemplateResult[][] = [
      this._renderItems(TOOLBAR_GROUPS.history),
      this._renderItems(TOOLBAR_GROUPS.ai),
      this._renderItems(TOOLBAR_GROUPS.fontstyle),
      this._renderItems(TOOLBAR_GROUPS.clipboard),
      this._renderItems(TOOLBAR_GROUPS.textFormat),
    ];

    if (shouldGroupAlignment) {
      const alignDropdown = this._renderDropdown(
        'editor-aligncenter',
        'Text Alignment',
        TOOLBAR_GROUPS.alignment
      );
      if (alignDropdown) allSections.push([alignDropdown]);
    } else {
      allSections.push(this._renderItems(TOOLBAR_GROUPS.alignment));
    }

    if (shouldGroupInsert) {
      const insertDropdown = this._renderDropdown(
        'editor-image',
        'Insert Actions',
        TOOLBAR_GROUPS.insert
      );
      if (insertDropdown) allSections.push([insertDropdown]);
    } else {
      allSections.push(this._renderItems(TOOLBAR_GROUPS.insert));
    }

    const customButtons = this._renderCustomButtons();
    if (customButtons.length > 0) allSections.push(customButtons);

    return this._assembleToolbar(allSections.filter(s => s.length > 0));
  }

  private _renderLargeTabletView(): TemplateResult[] {
    // Group [Alignment] if EITHER [AI] or [Copy/Paste] is enabled.
    const shouldGroupAlignment = this._hasAiTools || this._hasClipboardTools;

    const insertDropdown = this._renderDropdown(
      'editor-image',
      'Insert Actions',
      TOOLBAR_GROUPS.insert
    );

    const allSections: TemplateResult[][] = [
      this._renderItems(TOOLBAR_GROUPS.history),
      this._renderItems(TOOLBAR_GROUPS.ai),
      this._renderItems(TOOLBAR_GROUPS.fontstyle),
      this._renderItems(TOOLBAR_GROUPS.clipboard),
      this._renderItems(TOOLBAR_GROUPS.textFormat), // Always expanded here
    ];

    if (shouldGroupAlignment) {
      const alignDropdown = this._renderDropdown(
        'editor-aligncenter',
        'Text Alignment',
        TOOLBAR_GROUPS.alignment
      );
      if (alignDropdown) allSections.push([alignDropdown]);
    } else {
      allSections.push(this._renderItems(TOOLBAR_GROUPS.alignment));
    }

    if (insertDropdown) allSections.push([insertDropdown]);

    const customButtons = this._renderCustomButtons();
    if (customButtons.length > 0) allSections.push(customButtons);

    return this._assembleToolbar(allSections.filter(s => s.length > 0));
  }

  private _renderTabletView(): TemplateResult[] {
    // Group [Text Formatting] ONLY if BOTH [AI] and [Copy/Paste] are enabled.
    const shouldGroupTextFormatting =
      this._hasAiTools && this._hasClipboardTools;

    const alignDropdown = this._renderDropdown(
      'editor-aligncenter',
      'Text Alignment',
      TOOLBAR_GROUPS.alignment
    );
    const insertDropdown = this._renderDropdown(
      'editor-image',
      'Insert Actions',
      TOOLBAR_GROUPS.insert
    );

    const allSections: TemplateResult[][] = [
      this._renderItems(TOOLBAR_GROUPS.history),
      this._renderItems(TOOLBAR_GROUPS.ai),
      this._renderItems(TOOLBAR_GROUPS.fontstyle),
      this._renderItems(TOOLBAR_GROUPS.clipboard),
    ];

    if (shouldGroupTextFormatting) {
      const textDropdown = this._renderDropdown(
        'editor-bold',
        'Text Formatting',
        TOOLBAR_GROUPS.textFormat
      );
      if (textDropdown) allSections.push([textDropdown]);
    } else {
      allSections.push(this._renderItems(TOOLBAR_GROUPS.textFormat));
    }

    if (alignDropdown) allSections.push([alignDropdown]);
    if (insertDropdown) allSections.push([insertDropdown]);

    const customButtons = this._renderCustomButtons();
    if (customButtons.length > 0) allSections.push(customButtons);

    return this._assembleToolbar(allSections.filter(s => s.length > 0));
  }

  private _renderLargeMobileView(): TemplateResult[] {
    const mainBarSections: TemplateResult[][] = [
      this._renderItems(TOOLBAR_GROUPS.history),
      this._renderItems(TOOLBAR_GROUPS.ai),
      this._renderItems(TOOLBAR_GROUPS.fontstyle),
      this._renderItems(TOOLBAR_GROUPS.clipboard),
    ];
    const moreDropdownContent: TemplateResult[] = [];

    // Define the conditions for the different layouts
    const showFullyExpandedLayout = !this._hasAiTools;
    const showPartiallyExpandedLayout =
      this._hasAiTools && !this._hasClipboardTools;

    const textDropdown = this._renderDropdown(
      'editor-bold',
      'Text Formatting',
      TOOLBAR_GROUPS.textFormat
    );
    const alignmentDropdown = this._renderDropdown(
      'editor-aligncenter',
      'Alignment',
      TOOLBAR_GROUPS.alignment
    );
    const insertDropdown = this._renderDropdown(
      'editor-image',
      'Insert Tools',
      TOOLBAR_GROUPS.insert
    );

    if (showFullyExpandedLayout) {
      // Case 1: [AI] is disabled, regardless of [Copy/Paste] = Show all on main bar
      if (textDropdown) mainBarSections.push([textDropdown]);
      if (alignmentDropdown) mainBarSections.push([alignmentDropdown]);
      if (insertDropdown) mainBarSections.push([insertDropdown]);
    } else if (showPartiallyExpandedLayout) {
      // Case 2: Only [AI] is enabled = Show [Text Formatting] and [Alignment] on main bar
      if (textDropdown) mainBarSections.push([textDropdown]);
      if (alignmentDropdown) mainBarSections.push([alignmentDropdown]);
      if (insertDropdown) moreDropdownContent.push(insertDropdown); // Insert goes to "More"
    } else {
      // Case 3: Both [AI] and [Copy/Paste] are enabled = Put all three in "More" dropdown
      if (textDropdown) moreDropdownContent.push(textDropdown);
      if (alignmentDropdown) moreDropdownContent.push(alignmentDropdown);
      if (insertDropdown) moreDropdownContent.push(insertDropdown);
    }

    // Custom buttons go inside the "More" dropdown
    const customButtons = this._renderCustomButtons();
    if (customButtons.length > 0) {
      if (moreDropdownContent.length > 0)
        moreDropdownContent.push(this._renderSeparator());
      moreDropdownContent.push(...customButtons);
    }

    const assembledToolbar = this._assembleToolbar(
      mainBarSections.filter(s => s.length > 0)
    );

    // "More" dropdown only appears if it has content
    if (moreDropdownContent.length > 0) {
      assembledToolbar.push(
        this._renderMoreDropdownForMobile(moreDropdownContent)
      );
    }

    return assembledToolbar;
  }

  private _renderMobileView(): TemplateResult[] {
    const moreDropdownContent: TemplateResult[] = [];
    const mainBarSections: TemplateResult[][] = [];

    // History actions goes first
    const historyItems = this._renderItems(TOOLBAR_GROUPS.history);
    if (historyItems.length > 0) {
      mainBarSections.push(historyItems);
    }

    // Check the next item on the main bar (AI or Font Style)
    const hasAiTools = TOOLBAR_GROUPS.ai.some(item =>
      this.toolbar.includes(item as any)
    );
    if (hasAiTools) {
      const aiItems = this._renderItems(TOOLBAR_GROUPS.ai);
      if (aiItems.length > 0) mainBarSections.push(aiItems);
      // Font style is pushed to "More" dropdown
      moreDropdownContent.push(...this._renderItems(TOOLBAR_GROUPS.fontstyle));
    } else {
      const fontItems = this._renderItems(TOOLBAR_GROUPS.fontstyle);
      if (fontItems.length > 0) mainBarSections.push(fontItems);
    }

    // Populate the rest of the "More" dropdown content
    const clipboardItems = this._renderItems(TOOLBAR_GROUPS.clipboard);
    if (clipboardItems.length > 0) {
      if (moreDropdownContent.length > 0)
        moreDropdownContent.push(this._renderSeparator());
      moreDropdownContent.push(...clipboardItems);
    }

    const nestedDropdowns = [
      this._renderDropdown(
        'editor-bold',
        'Text Formatting',
        TOOLBAR_GROUPS.textFormat
      ),
      this._renderDropdown(
        'editor-aligncenter',
        'Alignment',
        TOOLBAR_GROUPS.alignment
      ),
      this._renderDropdown(
        'editor-image',
        'Insert Tools',
        TOOLBAR_GROUPS.insert
      ),
    ].filter(Boolean) as TemplateResult[];

    if (nestedDropdowns.length > 0) {
      if (moreDropdownContent.length > 0)
        moreDropdownContent.push(this._renderSeparator());
      moreDropdownContent.push(...nestedDropdowns);
    }

    // Assemble the main toolbar without the More dropdown
    const assembledToolbar = this._assembleToolbar(mainBarSections);

    // Add the "More" dropdown at the end without a separator
    if (moreDropdownContent.length > 0) {
      assembledToolbar.push(
        this._renderMoreDropdownForMobile(moreDropdownContent)
      );
    }

    // Add custom toolbar buttons at the end
    const customButtons = this._renderCustomButtons();
    if (customButtons.length > 0) {
      if (assembledToolbar.length > 0) {
        assembledToolbar.push(this._renderSeparator());
      }
      assembledToolbar.push(...customButtons);
    }

    return assembledToolbar;
  }

  initialiseProperties() {
    const { toolbar } = this.configuration;
    this.viewContext['max-image-size'] = toolbar?.maxImageSize;
  }

  private getStyle(element: HTMLElement) {
    const bgcolor = 'background-color';
    const color = 'color';

    const styleInfo = {} as Record<any, any>;

    const styles = window.getComputedStyle(element);

    // Get computed background color
    const bgColorValue = styles.backgroundColor;
    const isBgTransparent =
      !bgColorValue ||
      bgColorValue === 'transparent' ||
      bgColorValue === 'rgba(0, 0, 0, 0)';

    // If transparent/no background, use 'transparent'
    // Otherwise, try to find matching color
    const foundBgColor = isBgTransparent
      ? 'transparent'
      : fontBackColor.find(
          defined =>
            defined.value.toLowerCase() ===
            rgb2hex(styles.backgroundColor)?.toLowerCase()
        )?.value;

    const foundTextColor =
      element.style.color === 'windowtext' ||
      rgb2hex(styles.color) === styles.getPropertyValue('--sc-rte-color')
        ? 'windowtext'
        : fontTextColor.find(
            defined =>
              defined.value.toLowerCase() ===
              rgb2hex(styles.color)?.toLowerCase()
          )?.value;

    // Always set background color even if it's transparent
    if (foundBgColor) {
      styleInfo[bgcolor] = foundBgColor;
    }

    if (foundTextColor) {
      styleInfo[color] = foundTextColor;
    }

    return styleInfo;
  }

  private getStyleInfo(elements: Element[]) {
    // Initialize with defaults
    const styleInfo: Record<string, any> = {
      'font-bold': 'normal',
      'font-italic': 'normal',
      'font-underline': 'normal',
      'font-subscript': 'normal',
      'font-superscript': 'normal',
      'font-strikethrough': 'normal',
      'background-color': 'transparent',
      color: '#000000',
    };

    // Filter out <body> and <html> nodes
    const validElements = elements.filter(
      el => el && el.nodeName !== 'BODY' && el.nodeName !== 'HTML'
    );

    // Return default styles if no valid elements
    if (validElements.length === 0) {
      return styleInfo;
    }

    let finalBgColor: string | undefined = undefined;

    // Iterate from the innermost element outwards
    for (const element of validElements) {
      const computed = window.getComputedStyle(element as HTMLElement);
      const computedBgColor = computed.backgroundColor;

      if (
        computedBgColor &&
        computedBgColor !== 'transparent' &&
        computedBgColor !== 'rgba(0, 0, 0, 0)'
      ) {
        const foundInPalette = fontBackColor.find(
          c => c.value.toLowerCase() === rgb2hex(computedBgColor)?.toLowerCase()
        );
        finalBgColor = foundInPalette
          ? foundInPalette.value
          : rgb2hex(computedBgColor);
        break;
      }
    }

    styleInfo['background-color'] = finalBgColor || 'transparent';

    validElements.forEach(element => {
      // Check for structural styles (bold, italic, etc.)
      switch (element.nodeName) {
        case 'STRONG':
        case 'B': {
          if (!styleInfo['font-bold-found']) {
            styleInfo['font-bold'] = 'bold';
            styleInfo['font-bold-found'] = true;
          }
          break;
        }
        case 'EM':
        case 'I': {
          if (!styleInfo['font-italic-found']) {
            styleInfo['font-italic'] = 'italic';
            styleInfo['font-italic-found'] = true;
          }
          break;
        }
        case 'S':
        case 'STRIKE':
        case 'DEL': {
          if (!styleInfo['font-strikethrough-found']) {
            styleInfo['font-strikethrough'] = 'strikethrough';
            styleInfo['font-strikethrough-found'] = true;
          }
          break;
        }
        case 'U': {
          if (!styleInfo['font-underline-found']) {
            styleInfo['font-underline'] = 'underline';
            styleInfo['font-underline-found'] = true;
          }
          break;
        }
        case 'SUB': {
          if (!styleInfo['font-subscript-found']) {
            styleInfo['font-subscript'] = 'subscript';
            styleInfo['font-subscript-found'] = true;
          }
          break;
        }
        case 'SUP': {
          if (!styleInfo['font-superscript-found']) {
            styleInfo['font-superscript'] = 'superscript';
            styleInfo['font-superscript-found'] = true;
          }
          break;
        }
      }

      // Check for CSS styles
      const elementStyles = (element as HTMLElement).style;
      if (elementStyles.textDecoration && !styleInfo['font-underline-found']) {
        styleInfo['font-underline'] = 'underline';
        styleInfo['font-underline-found'] = true;
      }

      const newStyleInfo = this.getStyle(element as HTMLElement);
      if (!styleInfo['color-found'] && newStyleInfo.color) {
        styleInfo.color = newStyleInfo.color;
        styleInfo['color-found'] = true;
      }
    });

    // Clean up temporary 'found' flags before returning
    for (const key in styleInfo) {
      if (key.endsWith('-found')) {
        delete styleInfo[key];
      }
    }

    return styleInfo;
  }

  /**
   * calculate style from conteneditable
   */
  attachStyleInfo() {
    if (this.selectedNodes) {
      const isCollapsed = this.range?.collapsed ?? true;
      this.viewContext = {
        ...this.viewContext,
        ...this.getStyleInfo(this.selectedNodes),
        'is-selection-collapsed': this.range?.collapsed ?? true,
      };
    } else {
      this.viewContext['is-selection-collapsed'] = true;
    }
  }

  attachActiveTag() {
    if (this.range) {
      const tags: string[] = [];
      let parentNode: Node | ParentNode | Element | null =
        this.range.startContainer;
      const checkNode = () => {
        const tag = (parentNode as Element)?.tagName?.toLowerCase()?.trim();
        if (tag) tags.push(tag);
      };
      while (parentNode) {
        checkNode();
        parentNode = parentNode?.parentNode;
      }

      this.viewContext = {
        ...this.viewContext,
        'active-tags': tags,
      };
    }
  }
  @state() showToast = false;
  @state() toastText = '';
  /**
   * show toast when don't support execCommand
   */
  notSupportLog(text: string) {
    this.toastText = text;
    this.showToast = true;
  }

  onToastHide() {
    this.toastText = '';
    this.showToast = false;
  }

  @watch('selectedNodes')
  onRangeChange(selectedNodes: any) {
    if (this.selectedNodes) {
      // Update dependencies accroding range
      this.attachStyleInfo();
      this.attachActiveTag();
    }
  }

  @watch('editorInstance')
  onEditorChange(): void {
    const editor = this.editorInstance;
    if (editor) {
      const fn = () => {
        if (editor.removed) return;
        this.viewContext['has-undo'] = editor.undoManager.hasUndo();
        this.viewContext['has-redo'] = editor.undoManager.hasRedo();
      };
      editor.on('AddUndo Undo Redo', fn);
      editor.once('remove', () => editor.off('AddUndo Undo Redo', fn));
    }
  }

  render() {
    let viewItems: TemplateResult[];

    switch (this._currentMode) {
      case 'mobile':
        viewItems = this._renderMobileView();
        break;
      case 'largeMobile':
        viewItems = this._renderLargeMobileView();
        break;
      case 'tablet':
        viewItems = this._renderTabletView();
        break;
      case 'largeTablet':
        viewItems = this._renderLargeTabletView();
        break;
      default:
        viewItems = this._renderDesktopView();
        break;
    }

    return html`
      <div
        class="rte-toolbar-container"
        @mousedown=${this._handleMouseDown}
        @mouseleave=${this._handleToolbarMouseLeave}
        @click=${(e: Event) => {
          const target = e.target as Element;
          // Hide tooltips on any click in the toolbar
          this._hideAllTooltips();
          // Close all dropdowns on any click in the toolbar
          // except clicks inside an open dropdown
          if (!target.closest('sl-dropdown')) {
            this._closeOpenDropdown();
          }
        }}
      >
        ${this.replace ? html`<slot name="replace"></slot>` : viewItems}
      </div>
      <sc-toast
        @sc-hide=${this.onToastHide}
        .open=${this.showToast}
        type="error"
        placement="top-right"
        duration="3000"
        title=""
      >
        ${this.toastText}
      </sc-toast>
    `;
  }
}
