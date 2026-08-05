import { css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { ScRelationshipDiagram } from './ScRelationshipDiagram.js';
import { RelLinkData, RelLinkSymbol, RelNodeData, RelNodeSymbol } from './utils/types.js';
import { watch } from '../../shared/watch.js';


export class ScRelationshipDepthDropdown extends ScExtElement {
  static styles = css``;

  @property({ type: Number, reflect: true }) value = 2;

  @state() levels = Array.from({ length: 6 }, (_, i) => ({
    value: `${i + 1}`,
    label: `Level ${i + 1}`,
    displayValue: `Depth: Level ${i + 1}`,
  }));

  $diagram?: ScRelationshipDiagram;

  @watch('value')
  whenValueChanged() {
    this.handleChangeValue();
  }
  
  handleChangeValue(e?: CustomEvent) {
    const { value } = e?.detail ?? {};
    if (value)
      this.value = Math.min(Math.max(0, parseInt(`${value}`)), 6);
    this.emit('sc-select', { detail: { value: this.value } });
  }

  filter(nodes: RelNodeData[], links: RelLinkData[], selected: (RelNodeData | RelLinkData)[]) {
    const nodeById = Object.create(null);
    nodes.forEach(node => (nodeById[node.id] = node));

    const [nodeSet, linkSet] = selected.reduce(
      (res, item) => {
        const [nodeSet, linkSet] = res;
        if (RelNodeSymbol in item) {
          nodeSet.add(item);
          item.group = 1;
        } else if (RelLinkSymbol in item) {
          linkSet.add(item);
          item.value = 1;
          item.$source ??= nodeById[item.source];
          item.$target ??= nodeById[item.target];
          if (item.$source) nodeSet.add(item.$source);
          if (item.$target) nodeSet.add(item.$target);
        }
        return res;
      },
      [new Set<RelNodeData>(), new Set<RelLinkData>()]
    );

    const otherLinks = links.filter(link => !linkSet.has(link));

    const result = this._filter(nodeById, otherLinks, nodeSet, linkSet);
    const byId = [...result.nodeSet, ...result.linkSet].reduce((byId, item) => {
      byId[item.id] = item;
      return byId;
    }, {} as Record<string, RelNodeData | RelLinkData>);

    return { nodes: [...result.nodeSet], links: [...result.linkSet], byId };
  }
  _filter(
    nodeById: Record<string, RelNodeData>,
    links: RelLinkData[],
    nodeSet: Set<RelNodeData>,
    linkSet: Set<RelLinkData>,
    level = 1
  ): {
    nodeSet: Set<RelNodeData>;
    linkSet: Set<RelLinkData>;
  } {
    const foundNodes = new Set<RelNodeData>();

    const [foundLinks, otherLinks] = links.reduce(
      (res, link) => {
        const [found, other] = res;
        link.$target ??= nodeById[link.target];
        link.$source ??= nodeById[link.source];
        link.value = Math.random() * 1000 >> 0;
        if (
          (link.$source && nodeSet.has(link.$source)) ||
          (link.$target && nodeSet.has(link.$target))
        ) {
          if (!found.has(link)) {
            found.add(link);
            link.$source &&
              !nodeSet.has(link.$source) &&
              foundNodes.add(link.$source);
            link.$target &&
              !nodeSet.has(link.$target) &&
              foundNodes.add(link.$target);
          }
        } else {
          other.add(link);
        }
        return res;
      },
      <Set<RelLinkData>[]>[new Set(), new Set()]
    );

    foundNodes.forEach(node => node.group = level + 1);

    if (level < this.value) {
      return this._filter(
        nodeById,
        [...otherLinks],
        new Set([...nodeSet, ...foundNodes]),
        new Set([...linkSet, ...foundLinks]),
        level + 1
      );
    }

    return {
      nodeSet: new Set([...nodeSet, ...foundNodes]),
      linkSet: new Set([...linkSet, ...foundLinks]),
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.parentElement?.tagName === 'SC-RELATIONSHIP-DIAGRAM') {
      this.$diagram = this.parentElement as ScRelationshipDiagram;
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.$diagram = undefined;
  }

  protected render() {
    return html`
      <sc-dropdown-input
        .data=${this.levels}
        .value=${`${this.value}`}
        .onlyFilterByValue=${true}
        @sc-select=${this.handleChangeValue}
      >
      </sc-dropdown-input>
    `;
  }
}