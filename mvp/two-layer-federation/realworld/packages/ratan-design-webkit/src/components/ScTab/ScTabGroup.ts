import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { watch } from '../../shared/watch.js';
import ScTabGroupStyle from './ScTabGroup.style.js';
import { ScTab, ANIMATE_INDICATOR } from './ScTab.js';
import type { ScTabPanel } from './ScTabPanel.js';
import { ScIcon } from '../ScIcon/ScIcon.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import '../../../elements/sc-icon.js';


/**
 * @summary Tab groups organize content into a container that shows one section at a time.
 *
 * @dependency sc-icon
 *
 * @slot - Used for grouping tab panels in the tab group. Must be `<sc-tab-panel>` elements.
 * @slot nav - Used for grouping tabs in the tab group. Must be `<sc-tab>` or `<sc-tab-divider>` elements.
 *
 * @event {{ name: String }} sc-tab-show - Emitted when a tab is shown.
 * @event {{ name: String }} sc-tab-hide - Emitted when a tab is hidden.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The tab group's navigation container where tabs are slotted in.
 * @csspart tabs - The container that wraps the tabs.
 * @csspart body - The tab group's body where tab panels are slotted in.
 * @csspart scroll-button - The previous/next scroll buttons that show when tabs are scrollable, an `<sc-icon>`.
 * @csspart scroll-button--start - The starting scroll button.
 * @csspart scroll-button--end - The ending scroll button.
 * @csspart scroll-button__base - The scroll button's exported `base` part.
 *
 */
export class ScTabGroup extends ScElement {
  static styles = ScTheme.getStyles().concat([ScTabGroupStyle]);

  static dependencies = { 'sc-icon': ScIcon };

  private activeTab?: ScTab;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserver;
  private tabs: ScTab[] = [];
  private panels: ScTabPanel[] = [];

  private showPreArrow = false;
  private showNextArrow = true;

  @query('.tab-group') tabGroup: HTMLElement;
  @query('.tab-group__body') body: HTMLSlotElement;
  @query('.tab-group__nav') nav: HTMLElement;

  @state() private hasScrollControls = false;

  /**
   * When set to auto, navigating tabs with the arrow keys will instantly show the corresponding tab panel. When set to
   * manual, the tab will receive focus but will not show until the user presses spacebar or enter.
   */
  @property() activation: 'auto' | 'manual' = 'auto';

  @property({ reflect: true }) alignment: 'left' | 'center' = 'left';

  /** Disables the scroll arrows that appear when tabs overflow. */
  @property({ attribute: 'no-scroll-controls', type: Boolean })
  // eslint-disable-next-line indent
  noScrollControls = false;

  @property({ attribute: 'no-active-bottom-line', type: Boolean })
  // eslint-disable-next-line indent
  noActiveBottomLine = false;

  /** Change Tab styles as per type. */
  @property({ type: String, reflect: true }) type:
    | 'filled'
    | 'outline'
    | 'segmented' = 'outline';
  
  @property({ type: Boolean, attribute: 'show-tabs-bottom-line' }) showTabsBottomLine = false;

  connectedCallback() {
    const whenAllDefined = Promise.all([
      customElements.whenDefined('sc-tab'),
      customElements.whenDefined('sc-tab-panel'),
    ]);

    super.connectedCallback();

    this.resizeObserver = new ResizeObserver(() => {
      this.updateScrollControls();
    });

    this.mutationObserver = new MutationObserver(mutations => {
      // Update aria labels when the DOM changes
      if (
        mutations.some(
          m =>
            ['aria-labelledby', 'aria-controls']?.includes(m.attributeName!) // eslint-disable-line
        )
      ) {
        // eslint-disable-line
        setTimeout(() => this.setAriaLabels());
      }

      // Sync tabs when disabled states change
      if (mutations.some(m => m.attributeName === 'disabled')) {
        this.syncTabsAndPanels();
      }
    });

    // After the first update...
    this.updateComplete.then(() => {
      this.syncTabsAndPanels();
      this.mutationObserver.observe(this, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      this.resizeObserver.observe(this.nav);

      // Wait for tabs and tab panels to be registered
      whenAllDefined.then(() => {
        // Set initial tab state when the tabs become visible
        const intersectionObserver = new IntersectionObserver(
          (entries, observer) => {
            if (entries[0].intersectionRatio > 0) {
              this.setAriaLabels();
              this.setActiveTab(this.getActiveTab() ?? this.tabs[0], {
                emitEvents: false,
              });
              observer.unobserve(entries[0].target);
            }
          }
        );
        intersectionObserver.observe(this.tabGroup);
      });
    });
  }

  updated() {
    this.syncTabsAndPanels();
    this.setAriaLabels();
    this.setActiveTab(this.getActiveTab() ?? this.tabs[0], {
      emitEvents: false,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.mutationObserver?.disconnect();
    this.resizeObserver?.unobserve(this.nav);
  }

  private getAllTabs(
    options: { includeDisabled: boolean } = { includeDisabled: true }
  ) {
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="nav"]');

    return [...(slot?.assignedElements() as ScTab[])].filter(el => {
      return options.includeDisabled
        ? el.tagName.toLowerCase() === 'sc-tab'
        : el.tagName.toLowerCase() === 'sc-tab' && !el.disabled;
    });
  }

  private getAllPanels() {
    return [...this.body.assignedElements()].filter(
      el => el.tagName.toLowerCase() === 'sc-tab-panel'
    ) as [ScTabPanel];
  }

  private getActiveTab() {
    return this.tabs.find(el => el.active);
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const tab: ScTab = target.closest('sc-tab')!; // eslint-disable-line
    const tabGroup = tab?.closest('sc-tab-group');

    // Ensure the target tab is in this tab group
    if (tabGroup !== this) {
      return;
    }

    if (tab !== null) {
      this.setActiveTab(tab, { scrollBehavior: 'smooth' });
    }

    this.emit('sc-tab-select', {
      detail: {
        name: tab.panel,
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const tab: ScTab = target.closest('sc-tab')!; // eslint-disable-line
    const tabGroup = tab?.closest('sc-tab-group');

    // Ensure the target tab is in this tab group
    if (tabGroup !== this) {
      return;
    }

    // Activate a tab
    if (['Enter', ' '].includes(event.key)) {
      if (tab !== null) {
        this.setActiveTab(tab, { scrollBehavior: 'smooth' });
        event.preventDefault();
      }
    }

    // Move focus left or right
    if (
      [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(event.key)
    ) {
      const activeEl = this.tabs.find(t => t.matches(':focus'));
      const isLeft = event.key === 'ArrowLeft';
      const isRight = event.key === 'ArrowRight';

      if (activeEl?.tagName.toLowerCase() === 'sc-tab') {
        let index = this.tabs.indexOf(activeEl);
        // Check if moving forwards or backwards
        const isRtl = getComputedStyle(this).direction === 'rtl'; // text direction right to left
        const forwards = isRtl ? isLeft : isRight;
        if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = this.tabs.length - 1;
        } else {
          index = forwards ? index + 1 : index - 1;
        }

        if (index < 0) {
          index = this.tabs.length - 1;
        }

        if (index > this.tabs.length - 1) {
          index = 0;
        }

        this.tabs[index].focus({ preventScroll: true });

        if (this.activation === 'auto') {
          this.setActiveTab(this.tabs[index], { scrollBehavior: 'smooth' });
        }

        event.preventDefault();
      }
    }
  }

  private onScroll() {
    this.showNextArrow = true;
    this.showPreArrow = true;
    if (this.nav.scrollLeft - 2 <= 0) {
      this.showPreArrow = false;
    }
    if (
      this.nav.scrollLeft + 2 >=
      this.nav.scrollWidth - this.nav.clientWidth
    ) {
      this.showNextArrow = false;
    }
    this.requestUpdate();
  }

  private handleScrollToStart() {
    this.nav.scroll({
      left: this.nav.scrollLeft - this.nav.clientWidth,
      behavior: 'smooth',
    });
  }

  private handleScrollToEnd() {
    this.nav.scroll({
      left: this.nav.scrollLeft + this.nav.clientWidth,
      behavior: 'smooth',
    });
  }

  private setActiveTab(
    tab: ScTab,
    config?: { emitEvents?: boolean; scrollBehavior?: 'auto' | 'smooth' }
  ) {
    const options = {
      emitEvents: true,
      scrollBehavior: 'auto',
      ...config,
    };

    if (tab !== this.activeTab && !tab.disabled) {
      const previousTab = this.activeTab;
      this.activeTab = tab;
      
      // Sync active tab and panel
      this.tabs.forEach(el => (el.active = el === this.activeTab));
      this.panels.forEach(
        el => (el.active = el.name === this.activeTab?.panel)
      );

      // Emit events
      if (options.emitEvents) {
        if (previousTab) {
          tab[ANIMATE_INDICATOR](previousTab as ScTab);
          this.emit('sc-tab-hide', { detail: { name: previousTab.panel } });
        }

        this.emit('sc-tab-show', { detail: { name: this.activeTab.panel } });
      }
    }
  }

  private setAriaLabels() {
    // Link each tab with its corresponding panel
    this.tabs.forEach(tab => {
      const panel = this.panels.find(el => el.name === tab.panel);
      if (panel) {
        tab.setAttribute('aria-controls', panel.getAttribute('id')!); // eslint-disable-line
        panel.setAttribute('aria-labelledby', tab.getAttribute('id')!); // eslint-disable-line
      }
    });
  }

  // This stores tabs and panels so we can refer to a cache instead of calling querySelectorAll() multiple times.
  private syncTabsAndPanels() {
    this.tabs = this.getAllTabs({ includeDisabled: true });

    this.panels = this.getAllPanels();

    this.tabs.forEach((tab, i) => {
      if (this.alignment === 'left') {
        if (i === this.tabs.length - 1) {
          tab.setAttribute('style', 'margin-right: 0');
        } else {
          tab.removeAttribute('style');
        }
      }
      tab.noActiveBottomLine = this.noActiveBottomLine;
      tab.type = this.type;
    });

    // After updating, show or hide scroll controls as needed
    this.updateComplete.then(() => this.updateScrollControls());
  }

  @watch('noScrollControls', { waitUntilFirstUpdate: true })
  updateScrollControls() {
    if (this.noScrollControls) {
      this.hasScrollControls = false;
    } else {
      this.hasScrollControls = this.nav.scrollWidth > this.nav.clientWidth;
    }
  }

  /** Shows the specified tab panel. */
  show(panel: string) {
    const tab = this.tabs.find(el => el.panel === panel);

    if (tab) {
      this.setActiveTab(tab, { scrollBehavior: 'smooth' });
    }
  }
  renderStartScroll() {
    return html` ${this.hasScrollControls && this.showPreArrow
      ? html`
          <sc-icon
            part="scroll-button scroll-button--start"
            exportparts="base:scroll-button__base"
            class="tab-group__scroll-button tab-group__scroll-button--start"
            name="chevron-left"
            label="scrollToStart"
            size="md"
            @click=${this.handleScrollToStart}
          ></sc-icon>
        `
      : ''}`;
  }
  renderEndScroll() {
    return html` ${this.hasScrollControls && this.showNextArrow
      ? html`
          <sc-icon
            part="scroll-button scroll-button--end"
            exportparts="base:scroll-button__base"
            class="tab-group__scroll-button tab-group__scroll-button--end"
            name="chevron-right"
            label="scrollToEnd"
            size="md"
            @click=${this.handleScrollToEnd}
          ></sc-icon>
        `
      : ''}`;
  }

  render() {
    const baseClass = classMap({
      'tab-group': true,
      'tab-group--has-scroll-controls': this.hasScrollControls,
      'tab-group--align-center': this.alignment === 'center',
      [this.type]: true,
    });
    return html`
      <div
        part="base"
        class=${baseClass}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div 
        class=${classMap({
          'tab-group__nav-container': true,
          'tab-group__bottom-line': this.showTabsBottomLine,
        })} 
        part="nav">
          ${this.renderStartScroll()}

          <div class="tab-group__nav" @scroll=${this.onScroll}>
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.renderEndScroll()}
        </div>

        <slot
          part="body"
          class="tab-group__body"
          @slotchange=${this.syncTabsAndPanels}
        ></slot>
      </div>
    `;
  }
}
