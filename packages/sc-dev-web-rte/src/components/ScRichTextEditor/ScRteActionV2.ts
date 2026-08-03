/* eslint-disable indent */
import { html, css, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js';

import ScTheme from '../../styles/ScTheme.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { watch } from '../../shared/watch.js';
import ScRteElement from '../../shared/sc-rte-element.js';
import { aiShortcuts, fontBackColor, fontSize, fontTextColor } from './constant.js';
import { ToolMixin } from '../../mixins/tool-mixin.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';

class TooltipCoordinator {
  private static currentTooltip: ScRteActionV2 | null = null;

  static requestShow(action: ScRteActionV2) {
    // Hide current tooltip immediately if it's different
    if (this.currentTooltip && this.currentTooltip !== action) {
      this.currentTooltip._forceHideTooltip();
      this.currentTooltip._forceRemoveHover();
    }
    this.currentTooltip = action;
  }

  static requestHide(action: ScRteActionV2) {
    if (this.currentTooltip === action) {
      this.currentTooltip = null;
    }
  }

  static hideAll() {
    if (this.currentTooltip) {
      this.currentTooltip._forceHideTooltip();
      this.currentTooltip._forceRemoveHover();
      this.currentTooltip = null;
    }
  }
}

class DropdownCoordinator {
  private static currentDropdown: ScRteActionV2 | null = null;

  static isShown(action: ScRteActionV2) {
    return this.currentDropdown === action;
  }

  static requestShow(action: ScRteActionV2) {
    if (this.currentDropdown && this.currentDropdown !== action) {
      if (this.currentDropdown.dropdown) {
        this.currentDropdown.dropdown.open = false;
      }
    }
    this.currentDropdown = action;
  }

  static requestHide(action: ScRteActionV2) {
    if (this.currentDropdown === action) {
      this.currentDropdown = null;
    }
  }

  static hideAll() {
    if (this.currentDropdown && this.currentDropdown.dropdown) {
      this.currentDropdown.dropdown.open = false;
      this.currentDropdown = null;
    }
  }
}

export class ScRteActionV2 extends ToolMixin(ScRteElement) {
  static styles = ScTheme.getStyles().concat([
    css`
      :host {
        --sl-spacing-medium: 0px;
        --sc-icon-color: var(--sc-rich-text-editor-icon-color);
        --sc-icon-hover-color: var(--sc-rich-text-editor-icon-hover-color);
        --sc-icon-active-color: var(--sc-rich-text-editor-icon-color-active);
      }
      .rte-sl-button-active {
        --sc-icon-color: var(--sc-rich-text-editor-icon-color-active);
        --sc-icon-bg-color: var(--sc-rich-text-editor-active-bg-color);
      }
      /* reset sl-button style */
      sl-button::part(base) {
        border: none;
        width: 24px;
        height: 100%;
        line-height: inherit;
        /* make icon vertical align center */
        /* vertical-align: unset; */
        min-height: 100%;
      }

      sl-button::part(label) {
        display: flex;
      }

      .rte-sl-button::part(base) {
        background-color: transparent;
      }
      .rte-action-container {
        height: 1rem;
        display: flex;
        align-items: center;
      }
      :host::part(rte-action-dropdown) {
        height: 24px;
        display: flex;
        align-items: center;
      }
      :host([type='backcolor'])::part(rte-action-dropdown),
      :host([type='textcolor'])::part(rte-action-dropdown) {
        height: 1rem;
      }

      /* for icon type below */
      .rte-sl-button {
        display: flex;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background-color: var(--sc-icon-bg-color, transparent);
        
        sc-icon {
          color: var(--sc-icon-color);
        }
        &:hover {
          --sc-icon-color: var(--sc-icon-hover-color);
        }
      }

      .separate {
        background-color: var(--sc-rich-text-editor-separate-color);
      }

      /* dropdown part below */
      .rte-action-container [part="rte-action-dropdown"]:not(.rte-font-style-dropdown) sc-dropdown-input {
        height: 1.5rem;
      }
      .rte-action-container sl-menu {
        border-radius: 8px;
        border: 1px solid
          var(--sc-dropdown-border-color, var(--sc-color-grey-150));
        background: var(--sc-dropdown-background-color, var(--sc-color-white));
        box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
      }

      /* scrollbar style */
      .rte-action-container sl-menu::-webkit-scrollbar {
        width: 0.25rem;
        height: 0.25rem;
      }
      .rte-action-container sl-menu::-webkit-scrollbar-thumb {
        background: var(--sc-color-grey-500);
        border-radius: 0.25rem;
      }
      .rte-action-container sl-menu::-webkit-scrollbar-button {
        background-color: transparent;
        border-radius: 0.5rem;
      }
      .rte-action-container .dropdown-item::part(label) {
        font-size: 1rem;
        color: var(--sc-dropdown-color, var(--sc-color-blue-900));
        margin-left: 1rem;
        font-family: var(--sc-font-family);
      }

      .rte-action-container .dropdown-item::part(base):hover {
        background: var(
          --sc-dropdown-item-background-hover-color,
          var(--sc-color-blue-100)
        );
      }

      .rte-action-container .trigger-button::part(base) {
        width: auto;
        justify-content: start;
        background-color: transparent;
        margin-top: -6px;
      }
      .rte-action-container .trigger-button::part(label) {
        flex: 1;
        width: auto;
        min-width: 4rem;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        text-align: left;
        color: var(--sc-icon-color);
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5rem;
      }
      .rte-action-container .trigger-button::part(caret),
      .rte-action-container .aishortcuts-trigger-button::part(caret) {
        font-size: 1rem;
      }

      .rte-action-container .aishortcuts-dropdown-item::part(label) {
        font-size: 0.875rem;
        color: var(--sc-dropdown-color, var(--sc-color-blue-900));
        font-family: var(--sc-font-family);
      }

      .rte-action-container .aishortcuts-dropdown-item::part(base):hover {
        background: var(
          --sc-dropdown-item-background-hover-color,
          var(--sc-color-blue-100)
        );
      }
      .rte-action-container .aishortcuts-trigger-button {
        display: flex;
        align-items: center;
      }
      .rte-action-container .aishortcuts-trigger-button::part(base) {
        width: auto;
        justify-content: start;
        background-color: transparent;
        margin-top: 0px;
        color: var(--sc-icon-color);
      }
      .rte-action-container .aishortcuts-trigger-button::part(label) {
        flex: 1;
        width: auto;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        text-align: left;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5rem;
      }
      .aishortcuts-trigger-button:hover::part(caret),
      .aishortcuts-trigger-button:hover sc-icon {
        color: var(--sl-color-primary-700);
      }
      /* for font size on dropdown menu list */
      /* .rte-action-container .dropdown-item.h1::part(label) {
        line-height: 1.6;
        font-size: 2.1875rem;
      }
      .rte-action-container .dropdown-item.h2::part(label) {
        line-height: 1.35;
        font-size: 1.75rem;
      }
      .rte-action-container .dropdown-item.h3::part(label) {
        line-height: 1.33;
        font-size: 1.3125rem;
      }
      .rte-action-container .dropdown-item.h4::part(label) {
        line-height: 1.4;
        font-size: 1.09375rem;
        font-weight: 700;
      }
      .rte-action-container .dropdown-item.h5::part(label) {
        line-height: 1.4;
        font-size: 1.09375rem;
      }
      .rte-action-container .dropdown-item.h6::part(label) {
        font-size: 0.875rem;
      }
      .rte-action-container .dropdown-item.div::part(label) {
        font-size: 1rem;
      }
      .rte-action-container .dropdown-item.p::part(label) {
        font-size: 0.875rem;
      }
      .rte-action-container .dropdown-item.aside::part(label) {
        font-size: 0.75rem;
      }
      .rte-action-container .dropdown-item.section::part(label) {
        font-size: 0.625rem;
      } */

      /* Font size previews in the dropdown menu */
      .rte-font-style-dropdown {
        --sc-dropdown-min-width: 11rem;

        --item-line-height-h1: 1.6;
        --item-font-size-h1: 2.1875rem;

        --item-line-height-h2: 1.35;
        --item-font-size-h2: 1.75rem;

        --item-line-height-h3: 1.33;
        --item-font-size-h3: 1.3125rem;

        --item-line-height-h4: 1.4;
        --item-font-size-h4: 1.09375rem;
        --item-font-weight-h4: 700;

        --item-line-height-h5: 1.4;
        --item-font-size-h5: 1.09375rem;

        --item-font-size-h6: 0.875rem;
        --item-font-size-div: 1rem;
        --item-font-size-p: 0.875rem;
        --item-font-size-aside: 0.75rem;
        --item-font-size-section: 0.625rem;

        sc-dropdown-input {
          min-width: 87px;
        }
      }

      /* Font style trigger button */
      .font-style-trigger {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        justify-content: space-between;
        background-color: transparent;
      }

      .font-style-trigger span {
        font-size: 0.875rem;
        font-weight: 400;
        line-height: 1.5rem;
        color: var(--sc-icon-color);
        white-space: nowrap;
      }

      .font-style-trigger sc-icon {
        color: var(--sc-icon-color);
      }
    `,
  ]);

  static get scopedElements() {
    return {
      'sl-button': SlButton,
      'sl-menu': SlMenu,
      'sl-menu-item': SlMenuItem,
      'sl-dropdown': SlDropdown,
    };
  }

  @query('sl-menu') menu: SlMenu;
  @query('sl-dropdown') dropdown: SlDropdown;
  @query('sc-tooltip') _tooltip!: SlTooltip;

  private _showTimer: number | null = null;
  private _hideTimer: number | null = null;
  @state() private _isMouseOver = false;

  @property({ type: String }) command = '';
  @property({ type: String }) hintText: string;
  @property({ type: String }) value?: string;
  @property({ type: String }) icon = 'info';
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) disable = false;
  @property({ type: Array }) values: Option[] = [];
  @property({ type: Array }) aiShortcutValues: AIShortcutOptions = [];
  @property({
    type: Array,
  })
  activeTags: string[] | undefined = [];
  @property({ type: String }) activeBgColor: string | number | undefined = '';
  @property({ type: String }) activeTextColor: string | number | undefined = '';
  @property({ type: String }) type?: string = 'icon'; // icon font color

  @state() selectedItem: string;
  @state() fontText: string | undefined;
  @state() iconStateSuffix: '' | '--hover' | '--selected' = '';
  @state() shouldRenderMenu = false;

  connectedCallback() {
    super.connectedCallback();
    this.selectedItem = this.getDefaultSelectItem();
    this.fontText = this.values?.find(v => v.value === this.selectedItem)?.name;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimers();
    TooltipCoordinator.hideAll();
    DropdownCoordinator.hideAll();
  }

  private _clearTimers() {
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
    if (this._hideTimer) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }

  private _handleMouseEnter() {
    this._isMouseOver = true;
    this._clearTimers();

    // Set hover state immediately
    this.toggleButtonState('--hover');

    if (this.hintText) {
      // Coordinate with other tooltips
      TooltipCoordinator.requestShow(this);

      // Show after a brief delay to prevent flashing
      this._showTimer = setTimeout(() => {
        if (this._isMouseOver && this._tooltip) {
          this._tooltip.show();
        }
      }, 100) as any;
    }
  }

  private _handleMouseLeave() {
    this._isMouseOver = false;
    this._clearTimers();

    // Remove hover state immediately
    this.toggleButtonState('');
    this.removeHoverState();

    if (this.hintText) {
      TooltipCoordinator.requestHide(this);

      // Small delay allows moving between adjacent elements
      this._hideTimer = setTimeout(() => {
        this._forceHideTooltip();
      }, 50) as any;
    }
  }

  public _forceHideTooltip() {
    this._clearTimers();
    if (this._tooltip) {
      this._tooltip.hide();
    }
  }

  public _forceRemoveHover() {
    this.toggleButtonState('');
    this.removeHoverState();
  }

  public hideTooltip(): void {
    TooltipCoordinator.hideAll();
  }

  public removeHoverState(): void {
    if (this.iconStateSuffix === '--hover') {
      this.iconStateSuffix = '';
    }
  }

  private _handleColorDropdownShow(event: Event) {
    DropdownCoordinator.requestShow(this);

    if (this.actionType.is('backcolor')) {
      const bgColor = this.activeBgColor?.toString();
      // Default to transparent if undefined or empty
      this.selectedItem = bgColor || 'transparent';
    }

    if (this.actionType.is('textcolor')) {
      const textColor = this.activeTextColor?.toString();
      // Default to black if undefined or empty
      this.selectedItem = textColor || '#000000';
    }

    this.shouldRenderMenu = true;
    this.toggleButtonState('--selected', false);
  }

  private _handleColorDropdownHide(event: Event) {
    DropdownCoordinator.requestHide(this);
    this.toggleButtonState(this.active ? '--selected' : '', false);
  }

  private getIconSecondaryColor(): string {
    if (this.actionType.is('textcolor')) {
      const color = this.activeTextColor?.toString();
      if (
        color &&
        color !== 'transparent' &&
        color.toLowerCase() !== 'windowtext'
      )
        return color;
    } else if (this.actionType.is('backcolor')) {
      const color = this.activeBgColor?.toString();
      if (color && color !== 'transparent') return color;
    }

    return 'currentColor';
  }

  getDefaultSelectItem() {
    if (this.actionType.is('font')) {
      return fontSize[7].value;
    } else if (this.actionType.is('backcolor')) {
      return 'transparent';
    } else if (this.actionType.is('textcolor')) {
      return '#000000';
    }
    return '';
  }

  show() {
    this.dropdown?.show();
  }

  hide() {
    this.dropdown?.hide();
  }

  private get actionType() {
    return {
      is: (whichType: string): boolean => {
        return this.type === whichType;
      },
    };
  }
  @watch('active')
  onActiveChange() {
    this.updateComplete;
    this.toggleButtonState(this.active ? '--selected' : '', false);
  }

  // @ts-ignore
  @watch('activeTags')
  onActiveTagsChange(oldValue: string[] | undefined) {
    const newTags = this.activeTags || [];
    const oldTags = oldValue || [];
    // Only update if the tags have changed
    if (newTags.join(',') === oldTags.join(',')) {
      return;
    }
    // Find the first active tag that matches our font list
    const activeStyle = this.activeTags?.find(tag =>
      this.values.some(f => f.value === tag)
    );
    // Update the selected item and trigger text
    this.selectedItem = activeStyle || 'p';
    this.fontText = this.values.find(v => v.value === this.selectedItem)?.name;
  }

  @watch('activeBgColor')
  onActiveBgColorChange() {
    if (this.actionType.is('backcolor')) {
      const bgColor = this.activeBgColor?.toString();
      this.selectedItem = bgColor && bgColor !== '' ? bgColor : 'transparent';
    }
  }

  @watch('activeTextColor')
  onActiveTextColorChange() {
    if (this.actionType.is('textcolor')) {
      const textColor = this.activeTextColor?.toString();
      this.selectedItem = textColor && textColor !== '' ? textColor : '#000000';
    }
  }

  invoke(namespace: string, ...args: any) {
    this.emit(INTERNAL_EVENTS['sc-context-trigger'] as any, {
      bubbles: true,
      composed: true,
      detail: {
        namespace,
        args,
      },
    });
  }

  toggleButtonState(state: '' | '--hover' | '--selected', isMouseEvent = true) {
    if (this.disable || this.icon?.includes('--disabled')) {
      return;
    }
    if (this.command === 'custom') return;
    if (!isMouseEvent || this.iconStateSuffix !== '--selected') {
      this.iconStateSuffix = state;
    }
  }

  renderColor(value: string) {
    const isWhite = value.toLowerCase() === '#ffffff';
    const isTransparent = value.toLowerCase() === 'transparent';
    const isWindowtext = value.toLowerCase() === 'windowtext';
    return html`<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <rect
        width="20"
        height="20"
        style="${isWindowtext
          ? 'fill: var(--sc-rte-color, var(--sc-color-black))'
          : ''}"
        fill="${value}"
      />
      ${isTransparent
        ? html`<line
            x1="20"
            y1="0"
            x2="0"
            y2="20"
            stroke="var(--sc-color-red-150)"
            stroke-width="1.5"
          />`
        : nothing}
      ${isWindowtext
        ? html`<polygon
            points="0,20 20,20 20,0"
            fill="var(--sc-rich-text-editor-main-bg-color)"
          />`
        : nothing}
      ${isWhite || isTransparent || isWindowtext
        ? html`<rect
            width="20"
            height="20"
            fill="none"
            stroke="var(--sc-color-grey-200)"
            stroke-width="1"
          />`
        : nothing}
    </svg>`;
  }

  render() {
    const { icon, iconStateSuffix, command, active, values, selectedItem, fontText, value, disable, hintText } =
      this;

    const iconStyles = {
      '--sc-icon-secondary-color': this.getIconSecondaryColor(),
    };

    return html`<sc-tooltip
      .content=${hintText}
      ?disabled=${!Boolean(hintText) || DropdownCoordinator.isShown(this)}
      mode="dark"
      trigger="manual"
      @mouseenter=${this._handleMouseEnter}
      @mouseleave=${this._handleMouseLeave}
    >
      <div class="rte-action-container">
        ${this.actionType.is('font')
          ? html`
              <div part="rte-action-dropdown" class="rte-font-style-dropdown">
                <sc-dropdown-input
                  .data=${this.values.map(v => ({
                    label: () => html`
                      <div
                        style="
                        display: flex;
                        align-items: center;
                        width: 100%;
                        "
                      >
                        <span
                          class="${classMap({
                            [v.className || v.value]: true,
                          })}"
                          style="
                          font-size: var(--item-font-size-${v.value});
                          line-height: var(--item-line-height-${v.value});
                          font-weight: var(--item-font-weight-${v.value}, 400);
                          "
                          >${v.name}</span
                        >
                      </div>
                    `,
                    value: v.value,
                    children: undefined as undefined,
                    displayValue: v.name,
                  })) as any}
                  .value=${this.selectedItem}
                  hoist
                  size="sm"
                  border-type="line"
                  @sc-select=${(event: CustomEvent) => {
                    const selectedValue = event.detail?.value;
                    if (!selectedValue) return;
                    // Only invoke command if value is different from current
                    if (selectedValue !== this.selectedItem) {
                      this.selectedItem = selectedValue;
                      this.fontText = this.values.find(
                        v => v.value === selectedValue
                      )?.name;
                      this.invoke(`editor.${this.command}`, selectedValue);
                    }
                  }}
                >
                  <div slot="trigger" class="font-style-trigger">
                    <span>${this.fontText}</span>
                    <sc-icon name="arrow-ios-downward" size="xs"></sc-icon>
                  </div>
                </sc-dropdown-input>
              </div>
            `
          : null}
        ${this.actionType.is('backcolor') || this.actionType.is('textcolor')
          ? html`<div part="rte-action-dropdown">
              <sc-dropdown-input
                hoist
                @sc-show=${this._handleColorDropdownShow}
                @sc-hide=${this._handleColorDropdownHide}
                @sc-select=${(event: CustomEvent) => {
                  const selectedValue = event.detail.value;
                  this.selectedItem = selectedValue;
                  this.invoke(`editor.${command}`, selectedValue);
                }}
                .value=${this.selectedItem}
              >
                <sl-button
                  slot="trigger"
                  class=${classMap({
                    'rte-sl-button': true,
                    'rte-sl-button-active': active,
                  })}
                >
                  <sc-icon
                    size="sm"
                    .name="${icon}"
                    style=${styleMap(iconStyles)}
                  >
                  </sc-icon>
                </sl-button>
                ${repeat(
                  this.values,
                  v => v.value,
                  v => html`
                    <sc-dropdown-option value=${v.value}>
                      <div style="display: flex; align-items: center;">
                        ${this.renderColor(v.value)}
                        <span style="margin-left: 0.5rem">${v.name}</span>
                      </div>
                    </sc-dropdown-option>
                  `
                )}
              </sc-dropdown-input>
            </div>`
          : null}
        ${this.actionType.is('aishortcuts')
          ? html`<div part="rte-action-dropdown">
              <sl-dropdown
                hoist
                distance="8"
                @sl-hide=${this.stopDefaultEvent}
                @sl-show=${(event: Event) => {
                  this.shouldRenderMenu = true;
                  this.stopDefaultEvent(event);
                }}
              >
                <sl-button
                  class="aishortcuts-trigger-button"
                  slot="trigger"
                  caret
                  size="small"
                >
                  <sc-icon size="sm" .name="${icon}"></sc-icon>
                </sl-button>
                ${this.shouldRenderMenu
                  ? html`
                      <sl-menu
                        @sl-select=${(event: CustomEvent) => {
                          const selectedValue = event.detail?.item?.value;
                          this.selectedItem = selectedValue;
                          this.invoke(`editor.${command}`, {
                            data: selectedValue,
                          });
                        }}
                      >
                        ${this.aiShortcutValues.map((v: any) =>
                          v.subprompts
                            ? html`
                                <sl-menu-item class="aishortcuts-dropdown-item">
                                  ${v.title}
                                  <sl-menu slot="submenu">
                                    ${v.subprompts.map(
                                      (subV: any) =>
                                        html`<sl-menu-item
                                          value=${JSON.stringify({
                                            prompt: subV.prompt,
                                          })}
                                          class="aishortcuts-dropdown-item"
                                        >
                                          ${subV.title}
                                        </sl-menu-item>`
                                    )}
                                  </sl-menu>
                                </sl-menu-item>
                              `
                            : html`<sl-menu-item
                                value=${JSON.stringify({
                                  prompt: v.prompt,
                                  action: v.action || '',
                                })}
                                class="aishortcuts-dropdown-item"
                              >
                                ${v.title}
                              </sl-menu-item>`
                        )}
                      </sl-menu>
                    `
                  : nothing}
              </sl-dropdown>
            </div>`
          : null}
        ${this.actionType.is('icon')
          ? html`
              <div part="rte-action-icon">
                <sl-button
                  ?disabled=${disable}
                  class=${classMap({
                    'rte-sl-button': true,
                    'rte-sl-button-active': active,
                  })}
                  @mousedown=${(e: MouseEvent) => {
                    // Prevent focus change on editor when clicking the button
                    e.preventDefault();
                  }}
                  @click=${() => {
                    if (command) {
                      this.invoke(`editor.${command}`, value);
                    } else {
                      this.emit('sc-action', {
                        bubbles: true,
                        composed: true,
                        detail: {
                          moduleInvoke: this.invoke.bind(this),
                        },
                      });
                    }
                  }}
                >
                  <sc-icon size="sm" .name="${icon}">
                  </sc-icon>
                </sl-button>
              </div>
            `
          : null}
        ${this.actionType.is('separate')
          ? html`
              <div class="separate" style="width: 1px; height: 100%;"></div>
            `
          : null}
        ${this.actionType.is('table')
          ? html`
              <div part="rte-action-table">
                <sl-button
                  class=${classMap({
                    'rte-sl-button': true,
                    'rte-sl-button-active': active,
                  })}
                >
                  <sc-rte-action-table-v2
                    ?disable=${disable}
                    @sc-select=${(e: CustomEvent) => {
                      const tableId = `tab-id-${this.generateId()}`;
                      this.invoke(`editor.${command}`, {
                        ...e.detail,
                        tableId,
                      });
                    }}
                    .icon="${this.icon}"
                    .size=${'sm'}
                  ></sc-rte-action-table-v2>
                </sl-button>
              </div>
            `
          : null}
        <div class="slot"><slot></slot></div>
      </div>
    </sc-tooltip>`;
  }
}

interface Option {
  name: string;
  value: string;
  className?: string;
}

type AIShortcutOptions = typeof aiShortcuts;
