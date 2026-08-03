/* eslint-disable indent */
import { html, css, nothing } from 'lit';
import { property, customElement, query, state } from 'lit/decorators.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';

import './ScRteAction.table.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-dropdown-input.js';
import ScTheme from '../../styles/ScTheme.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { watch } from '../../shared/watch.js';
import ScElement from '../../shared/sc-element.js';
import { MARKS, fontBackColor, fontSize, fontTextColor } from './constant.js';
import { ToolMixin } from '../../mixins/tool-mixin.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';

@customElement('sc-rte-action')
export class RTEAction extends ToolMixin(ScElement) {
  static styles = ScTheme.getStyles().concat([
    css`
      :host {
        --sl-spacing-medium: 0px;
        --sc-icon-color: var(--sc-rich-text-editor-icon-color);
        --sc-icon-hover-color: var(--sc-rich-text-editor-icon-hover-color);
        --sc-icon-bg-color: var(--sc-rich-text-editor-bg-color);
      }

      .rte-sl-button-active {
        --sc-icon-color: var(--sc-rich-text-editor-icon-color-active);
        --sc-icon-bg-color: var(--sc-rich-text-editor-active-bg-color);
        --sc-icon-hover-color: var(--sc-rich-text-editor-active-bg-color);
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

      .rte-sl-button::part(base) {
        background-color: transparent;
      }
      .rte-action-container {
        height: 24px;
        margin: 10px var(--sc-spacing-8);
      }
      :host::part(rte-action-dropdown) {
        height: 24px;
      }
      /* for icon type below */
      .rte-sl-button:hover {
        background-color: var(--sc-icon-hover-color);
      }
      .rte-sl-button {
        height: 24px;
        border-radius: 4px;
        background-color: var(--sc-icon-bg-color);
      }

      .rte-sl-button sc-icon {
        color: var(--sc-icon-color);
      }
      .separate {
        background-color: var(--sc-rich-text-editor-separate-color);
      }

      /* dropdown part below */
      .rte-action-container sl-menu {
        border-radius: 8px;
        border: 1px solid
          var(--sc-dropdown-border-color, var(--sc-color-grey-150));
        background: var(--sc-dropdown-background-color, var(--sc-color-white));
        box-shadow: 0px 2px 4px 0px rgba(82, 83, 85, 0.1);
      }

      .rte-action-container .dropdown-item::part(label) {
        font-size: 16px;
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
        /* padding-inline-end: 0; */
        /* padding: 0; */
        width: 120px;
        text-align: left;
        color: var(--sc-icon-color);
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
      }
      /* for color */
      .color-overview {
        width: 100%;
        height: 3px;
        margin-top: -4px;
      }
      .color-block {
        width: 20px;
        height: 20px;
      }
      .color-block-white {
        border: 1px solid var(--sc-color-grey-100);
        background-color: var(--sc-color-white);
      }
      .color-block-none {
        position: relative;
        border: 1px solid var(--sc-color-grey-100);
        background-color: var(--sc-color-white);
        overflow: hidden;
      }
      .color-block-none:before {
        content: '';
        position: absolute;
        width: 100px;
        height: 2px;
        background-color: var(--sc-color-red-dm);
        transform: translate3d(-31px, 0, 0) rotate(-45deg);
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

  @property({ type: String }) command = '';
  @property({ type: String }) hintText: string;
  @property({ type: String }) value?: string;
  @property({ type: String }) icon = 'info';
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) disable = false;
  @property({ type: Array }) values: Option[] = [];
  @property({
    type: Array,
  })
  activeTags: string[] | undefined = [];
  @property({ type: String }) activeBgColor: string | undefined = '';
  @property({ type: String }) activeTextColor: string | undefined = '';
  @property({ type: String }) type?: string = 'icon'; // icon font color

  @state() selectedItem: string;
  @state() fontText: string | undefined;
  @state() shouldRenderMenu = false;

  connectedCallback() {
    super.connectedCallback();
    this.selectedItem = this.getDefaultSelectItem();
    this.fontText = this.values?.find(v => v.value === this.selectedItem)?.name;
  }

  getDefaultSelectItem() {
    if (this.actionType.is('font')) {
      return fontSize[7].value;
    } else if (this.actionType.is('backcolor')) {
      return fontBackColor[0].value;
    } else if (this.actionType.is('textcolor')) {
      return fontTextColor[0].value;
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

  @watch('activeTags')
  onActiveTagsChange(oldValue: any) {
    if (oldValue && this.activeTags) {
      if (oldValue.join('') !== this.activeTags.join('')) {
        this.selectedItem =
          this.activeTags.find(tag => this.values.find(f => f.value === tag)) ||
          'p';
        this.fontText = this.values.find(
          v => v.value.toLowerCase() === this.selectedItem
        )?.name;
      }
    }
  }
  @watch('activeBgColor')
  onActiveBgColorChange() {
    this.selectedItem =
      fontBackColor.find(
        bg => bg.value.toLowerCase() === this.activeBgColor?.toLowerCase()
      )?.value || fontBackColor[0].value;
  }
  @watch('activeTextColor')
  onActiveTextColorChange() {
    this.selectedItem =
      fontTextColor.find(
        bg => bg.value.toLowerCase() === this.activeTextColor?.toLowerCase()
      )?.value || fontTextColor[0].value;
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

  render() {
    const { icon, command, active, values, selectedItem, fontText, value, disable, hintText } =
      this;
    return html`<sc-tooltip .content=${hintText} ?disabled=${!Boolean(hintText)} mode="light" trigger="hover">
    <div class="rte-action-container">
      ${this.actionType.is('font')
        ? html`<div part="rte-action-dropdown">
            <sl-dropdown
              @sl-hide=${this.stopDefaultEvent}
              @sl-show=${(event: Event)=>{ this.shouldRenderMenu = true; this.stopDefaultEvent(event); }}
            >
              <sl-button class="trigger-button" slot="trigger" caret>
                <span>${fontText}</span>
              </sl-button>
              ${
                  this.shouldRenderMenu ? 
                  html`
                  <sl-menu
                    @sl-select=${(event: CustomEvent) => {
                      const selectedValue = event.detail?.item?.value;
                      this.selectedItem = selectedValue;
                      this.invoke(`editor.${command}`, selectedValue);
                    }}
                  >
                    <div>
                      ${values.map(
                        v =>
                          html`<sl-menu-item
                            value=${v.value}
                            type="checkbox"
                            class="dropdown-item"
                            .checked=${selectedItem === v.value}
                          >
                            ${v.name}
                          </sl-menu-item>`
                      )}
                    </div>
                  </sl-menu>
                  ` : nothing
              }
            </sl-dropdown>
          </div>`
        : null}
      ${this.actionType.is('backcolor') || this.actionType.is('textcolor')
        ? html`<div part="rte-action-dropdown">
            <sl-dropdown
              @sl-hide=${this.stopDefaultEvent}
              @sl-show=${(event: Event)=>{ this.shouldRenderMenu = true; this.stopDefaultEvent(event); }}
            >
              <sl-button
                slot="trigger"
                class=${classMap({
                  'rte-sl-button': true,
                  'rte-sl-button-active': active,
                })}
              >
                <sc-icon size="md" .name=${icon}> </sc-icon>
                <div
                  class="color-overview"
                  style="${styleMap({
                    'background-color': selectedItem,
                  })}"
                ></div>
              </sl-button>
              ${
                  this.shouldRenderMenu ? 
                  html`
                  <sl-menu
                    @sl-select=${(event: CustomEvent) => {
                      const selectedValue = event.detail?.item?.value;
                      this.selectedItem = selectedValue;
                      this.invoke(`editor.${command}`, selectedValue);
                    }}
                  >
                    <div>
                      ${values.map(
                        v =>
                          html`<sl-menu-item
                            value=${v.value}
                            type="checkbox"
                            class="dropdown-item"
                            .checked=${selectedItem === v.value}
                          >
                            <div
                              slot="prefix"
                              class=${classMap({
                                'color-block': true,
                                'color-block-white':
                                  v.value.toLowerCase() === '#ffffff',
                                'color-block-none':
                                  v.value.toLowerCase() === '#fefefe',
                              })}
                              style="${styleMap({
                                'background-color': v.value,
                              })}"
                            ></div>
                            ${v.name}
                          </sl-menu-item>`
                      )}
                    </div>
                  </sl-menu>
                  ` : nothing
              }
              
            </sl-dropdown>
          </div>`
        : null}
      ${this.actionType.is('icon')
        ? html`
            <div part="rte-action-icon">
              <sl-button
                class=${classMap({
                  'rte-sl-button': true,
                  'rte-sl-button-active': active,
                })}
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
                <sc-icon size="md" .name=${icon}> </sc-icon>
              </sl-button>
            </div>
          `
        : null}
      ${this.actionType.is('separate')
        ? html` <div class="separate" style="width: 1px; height: 100%;"></div> `
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
                <sc-rte-action-table
                  ?disable=${disable}
                  @sc-select=${(e: CustomEvent) => {
                    const { rowCount, colCount } = e.detail;
                    const tableId = `tab-id-${this.generateId()}`;

                    this.invoke(
                      `editor.${command}`,
                      `<p
                        data-mark="${MARKS.injectedTablePlaceholder}"
                        id='${tableId}'
                        data-row-count=${rowCount}
                        data-col-count=${colCount}
                        ><br /></p>`
                    );
                    this.invoke('viewer.updateTable', {
                      elId: tableId,
                      rowCount,
                      colCount,
                    });
                  }}
                  .icon=${this.icon}
                  .size=${'md'}
                ></sc-rte-action-table>
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
}
