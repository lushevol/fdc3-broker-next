import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../utils/watch.js';
import { BaseToolbar } from './BaseToolbar.js';
import { ScribbleDataSource } from './ScScriber.js';
import {
  Color,
  ETools,
  Size,
  StyleBase,
  Thickness,
} from './ScScriber.toolbar.util.js';
import ScScriberToolbarStyle from './ScScriberToolbar.style.js';

const SETTING_IDS = {
  color: 'color-setting',
  thickness: 'thickness-setting',
  size: 'size-setting',
  shape: 'shape-setting',
};

@customElement('sc-scriber-toolbar')
export class ScScriberToolbar extends BaseToolbar {
  static styles = [...BaseToolbar.styles, ScScriberToolbarStyle];

  toolbarStyles: StyleBase<any>[];
  constructor() {
    super();
    const thickness = new Thickness(this.handleToolbarStyleChange);
    const color = new Color(this.handleToolbarStyleChange);
    const size = new Size(this.handleToolbarStyleChange);
    this.toolbarStyles = [thickness, color, size];
    this.activeColor = color.getDefaultValue();
    this.activeThickness = thickness.getDefaultValue();
  }

  @property({ type: Array, attribute: false }) dataSource: ScribbleDataSource[];
  @state() showColorSetting = false;
  @state() showThicknessSetting = false;
  @state() showShapeSetting = false;
  @state() showSizeSetting = false;
  @state() activeTool?: ETools;
  @state() lastActiveShapeTool: ETools = ETools.rectangle;
  @state() activeToolForToolbarStyles: ETools = ETools.pen;
  @state() activeColor: string;
  @state() activeThickness: number;
  @state() activeSize: number;
  @state() highlightIndex = -1;

  highlights: { x: number; y: number; page: number }[] = [];

  toggleState(
    state:
      | 'showColorSetting'
      | 'showThicknessSetting'
      | 'showShapeSetting'
      | 'showSizeSetting',
    value?: boolean
  ) {
    this[state] = value ?? !this[state];
  }

  switchTool(tool: ETools) {
    if (this.activeTool === tool) {
      this.activeTool = undefined;
    } else {
      this.activeTool = tool;
      this.toolbarStyles.forEach(style => {
        this.handleToolbarStyleChange(style);
      });
      if (Object.keys(shapOptions).includes(tool)) {
        this.lastActiveShapeTool = tool;
      }
    }

    this.emit('scriber-toolbar', {
      detail: {
        type: 'tool-change',
        info: {
          value: this.activeTool,
        },
      },
    });
  }

  @watch('dataSource')
  handleDataSourceChange() {
    this.highlights =
      this.dataSource
        ?.map(
          (d, page) =>
            d.history
              .filter(d => d.type === ETools.highlightRect)
              .map(({ id, data }) => ({
                x: data.startX,
                y: data.startY,
                page,
                id,
              })) ?? []
        )
        .flat()
        .sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x) ?? [];
    this.highlightIndex = -1;
  }

  handleNextClick() {
    if (this.highlightIndex < this.highlights.length - 1) {
      this.highlightIndex++;
      this.emit('scriber-toolbar', {
        detail: {
          type: 'jump-highlight',
          info: {
            index: this.highlightIndex,
            value: this.highlights[this.highlightIndex],
          },
        },
      });
    }
  }
  handlePreviousClick() {
    if (this.highlightIndex > 0) {
      this.highlightIndex--;
      this.emit('scriber-toolbar', {
        detail: {
          type: 'jump-highlight',
          info: {
            index: this.highlightIndex,
            value: this.highlights[this.highlightIndex],
          },
        },
      });
    }
  }

  handleToolbarStyleChange = (value: StyleBase<any>) => {
    this.emit('scriber-toolbar', {
      detail: {
        type: 'tool-style-change',
        info: {
          value,
        },
      },
    });

    if (value instanceof Color) {
      this.activeColor =
        value.configurations.get(ETools.pen) ?? value.getDefaultValue();
    }
    if (value instanceof Thickness) {
      this.activeThickness =
        value.configurations.get(ETools.pen) ?? value.getDefaultValue();
    }
    if (value instanceof Size) {
      this.activeSize =
        value.configurations.get(ETools.pen) ?? value.getDefaultValue();
    }
  };
  closeColorSetting = (e: Event) => {
    const paths = e.composedPath() as HTMLElement[];
    const hasColorTooltip = paths.some(path => {
      return path.id === SETTING_IDS.color;
    });
    const hasThicknessTooltip = paths.some(path => {
      return path.id === SETTING_IDS.thickness;
    });
    const hasShapeTooltip = paths.some(path => {
      return path.id === SETTING_IDS.shape;
    });
    const hasSizeTooltip = paths.some(path => {
      return path.id === SETTING_IDS.size;
    });
    if (!hasColorTooltip) {
      this.toggleState('showColorSetting', false);
    }
    if (!hasShapeTooltip) {
      this.toggleState('showShapeSetting', false);
    }
    if (!hasThicknessTooltip) {
      this.toggleState('showThicknessSetting', false);
    }
    if (!hasSizeTooltip) {
      this.toggleState('showSizeSetting', false);
    }
  };
  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('click', this.closeColorSetting);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('click', this.closeColorSetting);
  }
  render() {
    let disableThickness = false;
    let disableColor = false;
    if (this.activeTool) {
      disableThickness = [ETools.eraser, ETools.text].includes(this.activeTool);
      disableColor = [ETools.eraser].includes(this.activeTool);
    }
    return html`
      <div class="toolbar main-toolbar">
        <div class="set common-tools">
          <!-- pen -->
          <sc-file-tool-icon
            class="tool"
            label="Pen"
            @click=${() => this.switchTool(ETools.pen)}
            ?active=${this.activeTool === ETools.pen}
          >
            ${renderPen()}
          </sc-file-tool-icon>

          <!-- eraser -->
          <div class="tool icon-wrapper">
            <sc-file-tool-icon
              label="Eraser"
              @click=${() => this.switchTool(ETools.eraser)}
              ?active=${this.activeTool === ETools.eraser}
            >
              ${renderEraser()}
            </sc-file-tool-icon>
            <sc-tooltip
              content-max-width="auto"
              mode="light"
              placement="bottom"
              trigger="manual"
              .open=${this.showSizeSetting}
              id=${SETTING_IDS.size}
            >
              <sc-icon
                name="chevron-down"
                @click=${() => this.toggleState('showSizeSetting')}
                size="xxs"
              ></sc-icon>
              <div slot="content">
                ${this.toolbarStyles[2].setup(ETools.pen)}
              </div>
            </sc-tooltip>
          </div>
          <!-- text -->
          <sc-file-tool-icon
            class="tool"
            label="Textbox"
            @click=${() => this.switchTool(ETools.text)}
            ?active=${this.activeTool === ETools.text}
          >
            ${renderText()}
          </sc-file-tool-icon>

          <!-- shape -->
          <div class="tool icon-wrapper divider-after">
            <sc-file-tool-icon
              label="Shape"
              @click=${() => this.switchTool(this.lastActiveShapeTool)}
              ?active=${Object.keys(shapOptions).includes(this.activeTool as ETools)}
            >
              ${shapOptions[this.lastActiveShapeTool ?? ETools.rectangle]()}
            </sc-file-tool-icon>
            <sc-tooltip
              content-max-width="auto"
              mode="light"
              placement="bottom"
              trigger="manual"
              .open=${this.showShapeSetting}
              id=${SETTING_IDS.shape}
            >
              <sc-icon
                name="chevron-down"
                @click=${() => this.toggleState('showShapeSetting')}
                size="xxs"
              ></sc-icon>

              <div slot="content">
                <div class="selectable-items">
                  ${Object.entries(shapOptions).map(([tool, renderFn]) => {
                    return html`
                      <div
                        class=${classMap({
                          'selectable-item': true,
                          'selectable-item-active':
                            this.lastActiveShapeTool === tool,
                        })}
                        @click=${() => this.switchTool(tool as ETools)}
                      >
                        <div class="selectable-item-content">
                          ${renderFn()} ${tool}
                        </div>
                        <sc-icon name="tick" size="md"></sc-icon>
                      </div>
                    `;
                  })}
                </div>
              </div>
            </sc-tooltip>
          </div>

          <!-- second part -->
          <!-- color setting -->

          <sc-tooltip
            class="tool"
            content-max-width="auto"
            mode="light"
            placement="bottom"
            trigger="manual"
            .open=${this.showColorSetting}
            id=${SETTING_IDS.color}
            ?disabled=${disableColor}
          >
            <div
              class=${classMap({
                'disabled-setting': disableColor,
                'icon-wrapper': true,
              })}
              @click=${() => this.toggleState('showColorSetting')}
            >
              <sc-file-tool-icon label="Color" ?disabled=${disableColor}>
                <div
                  class="color-block"
                  style="background: ${this.activeColor}"
                ></div>
              </sc-file-tool-icon>
              <sc-icon name="chevron-down" size="xxs"></sc-icon>
            </div>
            <div slot="content">${this.toolbarStyles[1].setup(ETools.pen)}</div>
          </sc-tooltip>

          <!-- thickness setting -->

          <sc-tooltip
            class="tool divider-after"
            content-max-width="auto"
            mode="light"
            placement="bottom"
            trigger="manual"
            .open=${this.showThicknessSetting}
            id=${SETTING_IDS.thickness}
            ?disabled=${disableThickness}
          >
            <div
              class=${classMap({
                'disabled-setting': disableThickness,
                'icon-wrapper': true,
              })}
              @click=${() => this.toggleState('showThicknessSetting')}
            >
              <sc-file-tool-icon label="Thickness" ?disabled=${disableThickness}>
                ${renderThickness()}
              </sc-file-tool-icon>
              <sc-icon name="chevron-down" size="xxs"></sc-icon>
            </div>
            <div slot="content" @click=${(e: Event) => e.stopPropagation()}>
              ${this.toolbarStyles[0].setup(ETools.pen)}
            </div>
          </sc-tooltip>
        </div>
        <div class="set right-set tool">
          <sc-button
            type="link"
            size="sm"
            left-icon="chevron-left"
            ?disabled=${this.highlightIndex <= 0}
            @click=${this.handlePreviousClick}
            >Previous</sc-button
          >
          <sc-button
            type="link"
            size="sm"
            right-icon="chevron-right"
            ?disabled=${this.highlightIndex >= this.highlights.length - 1}
            @click=${this.handleNextClick}
            >Next</sc-button
          >
        </div>
        ${this.renderMoreTool()}
      </div>
    `;
  }
}
const shapOptions = {
  [ETools.line]: renderLine,
  [ETools.arrow]: renderArrow,
  [ETools.circle]: renderCircle,
  [ETools.rectangle]: renderRectangle,
} as Record<ETools, () => any>;
function renderThickness() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path d="M14 2V3H2V2H14Z" fill="currentColor" />
    <path d="M14 6V8H2V6H14Z" fill="currentColor" />
    <path d="M14 11V14H2V11H14Z" fill="currentColor" />
  </svg>`;
}
function renderPen() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.2164 2.90025C16.4166 1.70007 18.3628 1.70009 19.563 2.90025L21.1001 4.43736C22.3 5.6376 22.3002 7.58393 21.1001 8.78404L9.04253 20.8407C8.59614 21.2869 8.02424 21.5845 7.40679 21.6942L7.13921 21.7294L4.16167 21.9921C2.92999 22.1009 1.8988 21.0703 2.00737 19.8387L2.27104 16.8602C2.33462 16.1416 2.64878 15.468 3.15874 14.9579L15.2164 2.90025ZM4.43218 16.2303C4.2208 16.4418 4.09031 16.7217 4.06401 17.0194L3.80034 19.9969C3.79029 20.1125 3.8879 20.2092 4.00347 20.1991L6.98101 19.9364C7.27857 19.9101 7.55763 19.7795 7.76909 19.5682L17.5816 9.75475L14.2447 6.41783L4.43218 16.2303ZM18.2906 4.17369C17.7932 3.67638 16.9862 3.67638 16.4888 4.17369L15.5171 5.14439L18.855 8.48228L19.8267 7.5106C20.3239 7.01335 20.3239 6.2071 19.8267 5.70982L18.2906 4.17369Z"
      fill="currentColor"
    />
  </svg>`;
}
function renderEraser() {
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0009 2.89199C13.1192 1.98003 14.7691 2.04498 15.8114 3.0873L20.6308 7.90664L20.8261 8.12344C21.6771 9.16717 21.6771 10.6735 20.8261 11.7172L20.6308 11.934L12.6181 19.9467H21.1005L21.1923 19.9516C21.6461 19.9977 21.9999 20.3811 21.9999 20.8471C21.9996 21.3127 21.6459 21.6955 21.1923 21.7416L21.1005 21.7465H9.41591C9.2993 21.7464 9.18808 21.7234 9.08583 21.683C8.56606 21.5717 8.08374 21.3147 7.70204 20.933L2.83388 16.0648C1.72199 14.9529 1.72209 13.1494 2.83388 12.0375L11.7841 3.0873L12.0009 2.89199ZM4.10732 13.3109C3.69836 13.72 3.69843 14.3825 4.10732 14.7914L8.97548 19.6605L9.04677 19.725C9.22078 19.8676 9.43985 19.9467 9.66689 19.9467C9.92615 19.9467 10.175 19.8437 10.3583 19.6605L14.9862 15.0316L8.68642 8.73183L4.10732 13.3109ZM14.538 4.36074C14.1546 3.97734 13.5479 3.95292 13.1366 4.28847L13.0575 4.36074L9.95888 7.4584L16.2587 13.7592L19.3573 10.6605L19.4296 10.5814C19.7651 10.1701 19.7406 9.56353 19.3573 9.18008L14.538 4.36074Z"
      fill="currentColor"
    />
  </svg>`;
}
function renderLine() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M18.3632 5.36326C18.7147 5.01181 19.2852 5.0118 19.6366 5.36326C19.9881 5.71473 19.9881 6.28523 19.6366 6.6367L6.63664 19.6367C6.28517 19.9882 5.71468 19.9882 5.3632 19.6367C5.01175 19.2852 5.01174 18.7147 5.3632 18.3633L18.3632 5.36326Z"
      fill="currentColor"
    />
  </svg>`;
}

function renderRectangle() {
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3.90039 20.0996H20.0996V3.90039H3.90039V20.0996ZM21.9004 20.4004C21.9002 21.2285 21.2285 21.9002 20.4004 21.9004H3.59961C2.77152 21.9002 2.09982 21.2286 2.09961 20.4004V3.59961C2.09982 2.77149 2.77149 2.09982 3.59961 2.09961H20.4004C21.2286 2.09982 21.9002 2.77152 21.9004 3.59961V20.4004Z"
      fill="currentColor"
    />
  </svg>`;
}
function renderCircle() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M21.0996 12C21.0996 6.97421 17.0257 2.90039 12 2.90039C6.97421 2.90039 2.90039 6.97421 2.90039 12C2.90039 17.0257 6.97421 21.0996 12 21.0996C17.0257 21.0996 21.0996 17.0257 21.0996 12ZM22.9004 12C22.9004 18.0199 18.0199 22.9004 12 22.9004C5.98009 22.9004 1.09961 18.0199 1.09961 12C1.09961 5.98009 5.98009 1.09961 12 1.09961C18.0199 1.09961 22.9004 5.98009 22.9004 12Z"
      fill="currentColor"
    />
  </svg>`;
}
function renderArrow() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19.9003 18.4804C19.9001 18.9773 19.4968 19.3798 18.9999 19.3798C18.503 19.3798 18.0998 18.9773 18.0995 18.4804V8.17377L6.63664 19.6367C6.28517 19.9881 5.71468 19.9881 5.3632 19.6367C5.01175 19.2852 5.01174 18.7147 5.3632 18.3632L16.8261 6.90033H6.51945C6.02261 6.90008 5.62004 6.49684 5.62004 5.99994C5.62004 5.50304 6.02261 5.0998 6.51945 5.09955H18.9999C19.497 5.09958 19.9003 5.5029 19.9003 5.99994V18.4804Z"
      fill="currentColor"
    />
  </svg>`;
}
function renderText() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M11.0996 16V8.90039H8C7.50294 8.90039 7.09961 8.49706 7.09961 8C7.09961 7.50294 7.50294 7.09961 8 7.09961H16C16.4971 7.09961 16.9004 7.50294 16.9004 8C16.9004 8.49706 16.4971 8.90039 16 8.90039H12.9004V16C12.9004 16.4971 12.4971 16.9004 12 16.9004C11.5029 16.9004 11.0996 16.4971 11.0996 16Z"
      fill="currentColor"
    />
    <path
      d="M2.09961 19V13.5H3.90039V19C3.90039 19.6075 4.39248 20.0996 5 20.0996H19C19.6075 20.0996 20.0996 19.6075 20.0996 19V13.5H21.9004V19C21.9004 20.6017 20.6017 21.9004 19 21.9004H5C3.39838 21.9004 2.09961 20.6017 2.09961 19ZM20.0996 5C20.0996 4.39248 19.6075 3.90039 19 3.90039H5C4.39249 3.90039 3.90039 4.39249 3.90039 5V10.5H2.09961V5C2.09961 3.39837 3.39837 2.09961 5 2.09961H19C20.6017 2.09961 21.9004 3.39838 21.9004 5V10.5H20.0996V5Z"
      fill="currentColor"
    />
    <path
      d="M22.5 9.59961C22.9971 9.59961 23.4004 10.0029 23.4004 10.5V13.5C23.4004 13.9971 22.9971 14.4004 22.5 14.4004H19.5C19.0029 14.4004 18.5996 13.9971 18.5996 13.5V10.5C18.5996 10.0029 19.0029 9.59961 19.5 9.59961H22.5ZM20.4004 12.5996H21.5996V11.4004H20.4004V12.5996Z"
      fill="currentColor"
    />
    <path
      d="M4.5 9.59961C4.99706 9.59961 5.40039 10.0029 5.40039 10.5V13.5C5.40039 13.9971 4.99706 14.4004 4.5 14.4004H1.5C1.00294 14.4004 0.599609 13.9971 0.599609 13.5V10.5C0.599609 10.0029 1.00294 9.59961 1.5 9.59961H4.5ZM2.40039 12.5996H3.59961V11.4004H2.40039V12.5996Z"
      fill="currentColor"
    />
  </svg>`;
}
