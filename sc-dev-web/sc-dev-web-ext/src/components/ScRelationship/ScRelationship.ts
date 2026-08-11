import type { ScDropdownInput, ScModal, ScSearchField } from '@scdevkit/webkit';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import { css } from 'lit';
import { html, nothing, TemplateResult } from 'lit-html';
import { property, query, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { deepMerge } from '../../shared/object.js';
import { CUSTOM_EVENTS_TYPE } from '../../shared/sc-custom-events.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { debounce } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import { ScEmployeeCard } from '../ScEmployee/ScEmployeeCard.js';
import { ScRelationshipDepthDropdown } from './ScRelationshipDepthDropdown.js';
import { ScRelationshipDiagram } from './ScRelationshipDiagram.js';
import { ScRelationshipMiniMap } from './ScRelationshipMiniMap.js';
import {
  RelationshipConfig,
  RelData,
  RelEmployeeData,
  RelLinkData,
  RelLinkSymbol,
  RelNodeData,
  RelNodeSymbol,
} from './utils/types.js';

export class ScRelationship extends ScExtElement {
  static get scopedElements() {
    return {
      'sc-relationship-diagram': ScRelationshipDiagram,
      'sc-relationship-mini-map': ScRelationshipMiniMap,
      'sc-employee-card': ScEmployeeCard,
      'sl-popup': SlPopup,
    };
  }
  static styles = css`
    :host {
      position: relative;
      display: block;
      overflow: hidden;
    }

    sl-popup[part='hover-popup'] {
      --arrow-color: var(--sc-employee-background-color, var(--sc-color-white));

      &::part(popup),
      &::part(arrow) {
        box-shadow: var(--sc-card-box-shadow-color) 0px 1px 4px 0px;
      }
    }
    sc-employee-card[part='employee-card'] {
      display: block;
      min-width: 20rem;
      --sc-card-box-shadow-color: transparent;
      --sc-card-hover-border-color: transparent;
    }

    div[part='legend'] {
      ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;

        li::before {
          content: '';
          display: inline-block;
          font-size: 1rem;
          width: 0.875rem;
          height: 0.875rem;
          color: var(--sc-relationship-node-font-color);
          margin-right: 0.25rem;
        }

        &.disc li::before {
          background-color: currentColor;
          border-radius: 50%;
        }
        &.square li::before {
          background-color: currentColor;
        }
        &.dash li::before {
          border-top: 0.25rem solid currentColor;
          height: 0.5rem;
          vertical-align: middle;
        }
      }
    }

    slot[part='hover'] {
      display: block;
    }
  `;
  static #defaultConfig: RelationshipConfig = {
    zoom: {
      min: 1,
      max: 8,
    },
    animate: false,
    nodeImageGetter: async node =>
      node.type !== 'entity'
        ? `/_data/profile/pics/${node.id}/photo_lg.jpg`
        : undefined,
    node: {
      color: {
        custom: {
          // person: '--sc-color-blue-500',
          // personSelected: '--sc-color-blue-600',
        },
      },
      shape: {
        default: 'circle',
        custom: {
          entity: 'rectRounded',
        },
      },
      borderColor: {
        default: '--sc-relationship-node-border-color',
        selected: '--sc-relationship-node-border-selected-color',
        hover: '--sc-relationship-node-border-hover-color',
      },
      borderWidth: {
        default: 0,
        selected: 2,
        hover: 2,
      },
      placeholder: {
        default: 'icon',
        custom: {
          entity: 'icon',
        },
      },
      icon: {
        default: 'person--line',
        custom: {
          entity: 'building',
        },
      },
      rescale: {
        default: 0.8,
      },
      rescaleText: {
        default: 0.5,
      },
    },
    link: {
      showText: {
        default: ['selected', 'x2'],
      },
      color: {
        // default: '--sc-color-yellow-400',
        // selected: '--sc-color-red-400',
        custom: {
          // entity: '--sc-color-grey-650',
        },
      },
      width: {
        default: 1,
        selected: 2,
      },
      rescale: {
        default: 0.5,
      },
      rescaleText: {
        default: 0.5,
      },
    },
  };

  @property({ type: Array }) data: RelEmployeeData[] = [];
  @property({ type: String }) size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
  @property({ type: Boolean, attribute: 'auto-size' }) autoSize = false;
  @property({ type: Boolean }) search = false;
  @property({ type: Boolean }) minimap = false;
  @property({ type: Boolean }) export = false;
  @property({ type: Boolean }) legend = false;
  @property({ type: Boolean, attribute: 'depth-dropdown' })
  depthDropdown = false;
  @property({ type: Number, reflect: true }) depth = 2;
  @property({ type: Array, attribute: false }) selectIds = <string[]>[];
  @property({ type: Object, attribute: false })
  hoverFn?: (
    node?: RelNodeData | RelLinkData
  ) => TemplateResult | HTMLElement | string;
  @property({ type: Object }) config: RelationshipConfig = {};
  @property({ type: Array }) fields?: string[];
  @property({ type: Object, attribute: false })
  onSearch?: (s: string) => Promise<RelEmployeeData[]>;

  @query('sc-relationship-diagram') $diagram: ScRelationshipDiagram;
  @query('sc-relationship-mini-map') $minimap?: ScRelationshipMiniMap;
  @query('sc-relationship-depth-dropdown')
  $depthDropdown?: ScRelationshipDepthDropdown;
  @query('sc-search-field[part="search"]') $search?: ScSearchField;
  @query('sl-popup[part="hover-popup"]') $cardPopup?: SlPopup;
  @query('sc-employee-card[part="employee-card"]') $card?: ScEmployeeCard;
  @query('sc-modal[part="export-modal"]') $exportModal?: ScModal;

  @state() $data = {
    nodes: <RelNodeData[]>[],
    links: <RelLinkData[]>[],
    byId: <Record<string, RelNodeData | RelLinkData>>{},
  };

  @state() hovered?: RelNodeData | RelLinkData;

  #parsedData = this.$data;
  #config: RelationshipConfig;
  #hoverHideId?: number;
  #hoveredOver = false;

  @watch('data')
  async whenDataChanged() {
    await this.updateComplete;
    this._parseData(this.data);
    this._limitDataDepth();
  }

  @watch('selectIds', { waitUntilFirstUpdate: true })
  async whenSelectChanged() {
    await this.updateComplete;
    if (
      this.selectIds.join(',') !==
      this.$diagram.selection.map(i => i.id).join(',')
    )
      this.$diagram.select(this.selectIds);
  }

  @watch('config')
  async whenConfigChanged() {
    this.#config = deepMerge({}, ScRelationship.#defaultConfig, this.config);
    await this.updateComplete;
  }

  @watch('depth', { waitUntilFirstUpdate: true })
  async whenDepthChanged() {
    this._limitDataDepth();
  }

  private _limitDataDepth() {
    if (this.$depthDropdown && this.selectIds.length) {
      const selected = this.selectIds
        .map(id => this.#parsedData.byId[id])
        .filter(v => !!v);
      this.$data = this.$depthDropdown.filter(
        this.#parsedData.nodes,
        this.#parsedData.links,
        selected
      );
      this.$diagram.addEventListener(
        'sc-rel-update',
        async () => {
          await this.$diagram.updateComplete;
          this.$diagram.select(this.selectIds);
        },
        { once: true }
      );
    } else {
      this.$data = this.#parsedData;
    }
    // sort for consistent layout postions
    // this.$data.nodes.sort((a, b) => a.id.localeCompare(b.id));
    // this.$data.links.sort((a, b) => a.id.localeCompare(b.id));
  }

  private _parseData(data: RelData[]) {
    const byId = <Record<string, RelNodeData | RelLinkData>>{};
    const nodes = data.map(
      item =>
        <RelNodeData & { $original: RelData }>{
          ...item,
          $original: item,
          [RelNodeSymbol]: true,
        }
    );
    const links = <RelLinkData[]>[];
    nodes.forEach(node =>
      (byId[node.id] = node).$original.links?.map(link =>
        links.push(<RelLinkData>{
          ...link,
          source: node.id,
          target: link.id,
          id: `${node.id}:::${link.id}`,
          $original: link,
          [RelLinkSymbol]: true,
        })
      )
    );
    links.forEach(link => (byId[link.id] = link));

    this.#parsedData = { nodes, links, byId };
  }

  clearHoverHideId() {
    if (this.#hoverHideId) {
      clearTimeout(this.#hoverHideId);
      this.#hoverHideId = undefined;
    }
  }
  hideHoverDelayed() {
    if (!this.$cardPopup?.active) return;
    const id = (this.#hoverHideId = window.setTimeout(() => {
      if (id === this.#hoverHideId) this.hideHover();
    }, 150));
  }
  hideHover() {
    if (this.$cardPopup?.active) this.$cardPopup.active = false;
    if (this.$card) {
      this.$card.data = {} as typeof this.$card.data;
    }
    this.hovered = undefined;
    this.#hoveredOver = false;
    this.clearHoverHideId();
  }

  highlightSelection(): void {
    // highlight if any link is selected
    this.$diagram.highlight = !!this.$diagram.selection.find(
      item => RelLinkSymbol in item
    );
    this.$diagram.addEventListener(
      'sc-change',
      () =>
        this.$diagram.addEventListener(
          'sc-rel-animated',
          () => requestAnimationFrame(() => this.$diagram.centerSelected()),
          { once: true }
        ),
      { once: true }
    );
  }

  handleReEmitEvent(event: CustomEvent) {
    this.emit(event.type as keyof CUSTOM_EVENTS_TYPE, {
      detail: event.detail,
    });
  }

  handleSelect(
    event: CustomEvent<{ selection: (RelNodeData | RelLinkData)[] }>
  ) {
    const { selection } = event.detail;
    this.selectIds = selection.map(i => i.id);
    this._limitDataDepth();
    this.emit('sc-select', { detail: event.detail });

    if (selection.length) {
      this.highlightSelection();
    } else {
      this.$diagram.highlight = false;
      this.$diagram.resetZoom(this.$diagram.zoomLevel);
    }
    this.hideHover();
  }

  handleHover(
    event?: CustomEvent<{ hover?: RelNodeData | RelLinkData; rect?: DOMRect }>
  ) {
    if (event) this.handleReEmitEvent(event);

    this.clearHoverHideId();
    if (!event?.detail.hover) {
      if (!this.#hoveredOver) this.hideHoverDelayed();
      return;
    }

    const { hover: node, rect } = event.detail;
    if (node && RelNodeSymbol in node && this.$cardPopup) {
      if (node && rect) {
        const thisRect = this.getBoundingClientRect();
        const effectiveRect = new DOMRect(
          rect.x + thisRect.x,
          rect.y + thisRect.y,
          rect.width,
          rect.height
        );
        this.$cardPopup.anchor = { getBoundingClientRect: () => effectiveRect };
        this.hovered = this.$data.byId[node.id];
        if (this.$card) {
          this.$card.data = node as any;
          this.$card.requestUpdate();
          this.$card.updateComplete.then(() => {
            if (this.$card?.data.id === node.id && this.$cardPopup) {
              this.$cardPopup.active = true;
              this.$cardPopup.requestUpdate();
            }
          });
        } else {
          this.updateComplete.then(() => {
            if (this.$cardPopup)
              this.$cardPopup.active = true;
          });
        }
      }
    }
  }
  handleHoverOver() {
    // ensure hover is kept, sometimes sc-hover event is only emitted after mouseover
    this.#hoveredOver = true;
    this.clearHoverHideId();
  }

  handleZoomPan(event: CustomEvent) {
    this.handleReEmitEvent(event);
    !this.$diagram?.isAnimating && this.hideHoverDelayed();
  }

  handleDepthChange(event: CustomEvent<{ value: number }>) {
    this.depth = event.detail.value;
    this._limitDataDepth();
    this.emit('sc-rel-depth', { detail: { depth: this.depth } });

    if (this.selectIds.length) this.highlightSelection();
  }

  handleSearchInput(event: CustomEvent<{ value: string }>) {
    const { value } = event.detail;

    const fn: NonNullable<typeof this.onSearch> = async (str: string) => {
      const lower = str.toLowerCase();
      return this.data.filter(
        item => item.id.includes(str) || item.name.toLowerCase().includes(lower)
      );
    };

    const list = (this.onSearch ?? fn)(value);
    list &&
      Promise.resolve(list)
        .then(list =>
          list.map(item => ({
            value: item.id,
            text: html`<sc-employee-card
              mode="tag"
              compact
              no-actions
              transparent
              .data=${item as ScEmployeeCard['data']}
              .fields=${['avatar', 'name']}
              style="pointer-events:none"
            ></sc-employee-card>`,
            displayValue: item.name,
          }))
        )
        .then(results => this.$search?.updateSuggestion(results));
  }
  handleSearchSelect(event: CustomEvent<{ value: string }>) {
    const { value: id } = event.detail;

    this.emit('sc-rel-search-select', { detail: { id } });
    if (this.$data.byId[id]) {
      // found in current data
      this.$diagram?.select([id]);
    } else {
      this.selectIds = [id];
      this._limitDataDepth();
      this.$diagram?.addEventListener(
        'sc-change',
        () => this.$diagram?.select([id]),
        { once: true }
      );
    }
  }

  handleExportClick() {
    this.$exportModal?.setAttribute('open', '');
  }

  handleModalAction(event: CustomEvent<{ type: 'primary' }>) {
    if (event.detail.type === 'primary') {
      const dropdown = this.shadowRoot?.querySelector<ScDropdownInput>(
        'sc-dropdown-input[part="export-modal-dropdown"]'
      );
      if (dropdown?.value === 'png') {
        this.$diagram.resetZoom();
        const save = (blob: Blob | null) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Diagram-export.png';
          this.appendChild(a);
          a.click();
          this.removeChild(a);
          URL.revokeObjectURL(url);
        };
        this.$diagram.canvas.toBlob(save, 'image/png', 1);
      }
      this.emit('sc-export', {
        detail: { type: dropdown?.value ?? 'csv', data: this.$data },
      });
    }
    this.$exportModal?.removeAttribute('open');
  }

  #renderMinimap() {
    return this.minimap
      ? html`<sc-relationship-mini-map
            part="mini-map"
            slot="bottom-right"
            @sc-collapse=${this.handleHover}
            @sc-expand=${this.handleHover}
          ></sc-relationship-mini-map>
          <sc-tooltip
            class="fullscreen-only"
            slot="top-right"
            content="Exit presenting mode"
            trigger="hover"
            hover-delay="1000"
          >
            <sc-icon-button
              type="secondary"
              state="default"
              size="md"
              name="logout"
              @click=${() => this.$minimap?.toggleFullscreen()}
            ></sc-icon-button>
          </sc-tooltip>`
      : nothing;
  }
  #renderDepthDropdown() {
    return this.depth > 0
      ? html`<sc-relationship-depth-dropdown
          part="depth-dropdown"
          slot="top-left"
          .value=${this.depth}
          @sc-select=${this.handleDepthChange}
          style="${this.depthDropdown ? '' : 'display:none'}"
        ></sc-relationship-depth-dropdown>`
      : nothing;
  }
  #renderSearch() {
    return this.search
      ? html`<sc-search-field
          part="search"
          slot="top-left"
          show-suggestion
          size="md"
          placeholder="Search"
          threshold="2"
          @sc-input=${debounce(this.handleSearchInput, 500)}
          @sc-search=${this.handleSearchSelect}
        ></sc-search-field>`
      : nothing;
  }
  #renderExport() {
    return this.export
      ? html`<div slot="top-right">
          <sc-button
            type="secondary"
            size="sm"
            part="export-button"
            left-icon="newwindow"
            @click=${this.handleExportClick}
            >Export</sc-button
          >
          <sc-modal
            part="export-modal"
            header="Export"
            side="md"
            footer-type="button"
            button-text-primary="Export"
            button-text-secondary="Cancel"
            @sc-action=${this.handleModalAction}
          >
            <sc-dropdown-input
              part="export-modal-dropdown"
              value="png"
              label="Select the file that you want to export"
              hoist
            >
              <sc-dropdown-option value="csv"
                >Diagram-export.csv</sc-dropdown-option
              >
              <sc-dropdown-option value="png"
                >Diagram-export.png</sc-dropdown-option
              >
            </sc-dropdown-input>
          </sc-modal>
        </div>`
      : nothing;
  }
  #renderLegend() {
    return this.legend
      ? html`<div part="legend" slot="bottom-left">
          <ul class="disc">
            <li>Person</li>
          </ul>
          <ul class="square">
            <li>Entity</li>
          </ul>
          <ul class="dash">
            <li>Relations</li>
          </ul>
        </div>`
      : nothing;
  }

  protected firstUpdated(): void {
    // force a re-render/relayout (TODO: try to improve)
    setTimeout(() => (this.$data = { ...this.$data }), 1000);
  }

  protected render() {
    return html`
      <sc-relationship-diagram
        .data=${this.$data}
        .config=${this.#config}
        part="diagram"
        size=${this.size}
        zoomable
        selectable
        hoverable
        @sc-select=${this.handleSelect}
        @sc-hover=${this.handleHover}
        @sc-pan=${this.handleZoomPan}
        @sc-zoom=${this.handleZoomPan}
      >
        ${this.#renderMinimap()} ${this.#renderDepthDropdown()}
        ${this.#renderSearch()} ${this.#renderExport()} ${this.#renderLegend()}
      </sc-relationship-diagram>

      <sl-popup
        part="hover-popup"
        placement="top"
        arrow
        distance="8"
        shift
        flip
      >
        <slot
          name="hover"
          part="hover"
          @mouseleave=${this.hideHover}
          @mouseover=${this.handleHoverOver}
        >
          ${guard(
            [this.hoverFn, this.hovered],
            () =>
              html`${this.hoverFn?.(this.hovered) ??
              html`<sc-employee-card
                part="employee-card"
                no-actions
                selected-on-click
                avatar-size=${this.size === 'xxl' ? 'xl' : this.size}
                .fields=${ifDefined(this.fields) as any}
              ></sc-employee-card>`}`
          )}
        </slot>
      </sl-popup>
      <!-- <sc-relationship-panel></sc-relationship-panel> -->
    `;
  }
}
