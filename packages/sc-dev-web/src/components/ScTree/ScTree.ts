import { html, nothing, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import SlTree from '@shoelace-style/shoelace/dist/components/tree/tree.component.js';
import SlTreeItem from '@shoelace-style/shoelace/dist/components/tree-item/tree-item.component.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-icon.js';
import { watch } from '../../shared/watch.js';
import ScTreeStyle from './ScTree.style.js';
import ScTheme from '../../styles/ScTheme.js';



type LabelRenderer = (context: LabelRenderContext) => string | TemplateResult;

interface TreeItem {
  value: string;
  label: string | LabelRenderer;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  children?: TreeItem[];
  prefixIcon?: string;
  hasChildren?: boolean;
  childrenLoaded?: boolean;
}

// private 
interface TreeNode extends TreeItem {
  childrenLoaded?: boolean;
  loading?: boolean;
  selected?: boolean;
  version?: number;
  isEditing?: boolean;
}

interface LabelRenderContext {
  item: TreeNode,
  selected?: boolean;
  tree: ScTree
}

export interface ActionsContext {
  currentNode: TreeItem;
  parentNode: TreeItem | null;
  tree: ScTree;
}

export interface EditSaveContext {
  /** The node being edited */
  currentNode: TreeItem;
  /** The new label value typed by the user */
  newLabel: string;
  /** Call this to abort the save — the item stays in editing mode */
  cancel: () => void;
}

export class ScTree extends ScElement {
  static styles = ScTheme.getStyles().concat([ScTreeStyle]);

  static get scopedElements() {
    return {
      'sl-tree': SlTree,
      'sl-tree-item': SlTreeItem,
    };
  }

  @property({ type: Array }) data: TreeItem[] = [];
  @property({ type: String }) selection: 'single' | 'multiple' = 'single';
  @property({ type: String }) selected?: string;
  @property({ type: Array }) selectedItems: string[] = [];
  @property({ type: Boolean, attribute: 'show-indent-lines' }) showIndentLines = false;
  @property({ type: Object }) loadChildren?: (item: TreeNode) => Promise<TreeNode[]>;
  @property({ type: Boolean }) refresh = false; // force to refresh data when it is lazy
  @property({ type: Function }) actionRenderer?: (context: ActionsContext) => TemplateResult | string;
  @property({ type: String, attribute: 'show-actions' }) showActions: 'hover' | 'always' = 'hover';

  /** Value of the item currently in editing mode (only one at a time) */
  @state() private _editingValue: string | null = null;
  /** Cached reference to the node being edited — avoids a full DFS on every commit. */
  private _editingNode: TreeNode | null = null;

  @state() treeData: TreeNode[] = [];

  @property({ type: Boolean, attribute: 'draggable' }) draggable = false;

  private _dragSourceValue: string | null = null;
  private _dragOverValue: string | null = null;
  /** Last *committed* (painted) position — updated inside setDragIndicator */
  private _dragPosition: 'before' | 'inside' | 'after' | null = null;
  /** Latest *intended* position — updated synchronously in handleDragOver so
   *  getDragPosition always compares against the most recent decision, not a
   *  stale committed value that may not have been painted yet (rAF lag). */
  private _pendingPosition: 'before' | 'inside' | 'after' | null = null;

  /** Half-width of the dead zone around each boundary (px). The cursor must
   *  travel this far PAST a boundary before the indicator commits to the new zone. */
  private static readonly DRAG_HYSTERESIS_PX = 6;
  /** rAF handle for debouncing indicator updates */
  private _dragRafId: number | null = null;
  /** setTimeout handle for auto-expanding a collapsed node when hovering 'inside' it */
  private _expandTimer: ReturnType<typeof setTimeout> | null = null;
  /** Value of the node currently queued for auto-expand */
  private _expandTargetValue: string | null = null;
  /** Cached row rect per item value — invalidated on each new drag target */
  private _cachedRect: { value: string; rect: DOMRect } | null = null;
  /** True while a drag is in progress — suppresses sl-selection-change side-effects */
  private _isDragging = false;


  // ── Inline editing ──────────────────────────────────────────────────────

  /** Begin inline editing for the given node value. Only one item edits at a time. */
  startEditing(value: string) {
    if (this._editingValue === value) return;
    // Cancel any previous edit without saving
    if (this._editingValue !== null) {
      this._setEditing(this._editingValue, false);
    }
    this._editingValue = value;
    this._editingNode = this._flatFindNode(this.treeData, value);
    this._setEditing(value, true);
    // Focus the input after Lit re-renders
    this.updateComplete.then(() => {
      const input = this.shadowRoot?.querySelector<HTMLInputElement>(
        `[data-edit-id="${value}"]`,
      );
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  private _setEditing(value: string, editing: boolean) {
    this.treeData = this._setEditingInTree(this.treeData, value, editing);
  }

  private _setEditingInTree(
    items: TreeNode[],
    value: string,
    editing: boolean,
    found = { value: false },
  ): TreeNode[] {
    return items.map(item => {
      // Short-circuit: once the target is located, return remaining items as-is.
      if (found.value) return item;
      if (item.value === value) {
        found.value = true;
        return { ...item, isEditing: editing };
      }
      if (item.children?.length) {
        const newChildren = this._setEditingInTree(item.children, value, editing, found);
        if (found.value) {
          return { ...item, children: newChildren };
        }
      }
      return item;
    });
  }

  /** Commit the edit — fires sc-edit-save with a cancel() hook.
   *  Calling cancel() in the handler aborts the save (item stays in edit mode).
   *  Empty or unchanged label silently cancels instead. */
  private _commitEdit(value: string, newLabel: string) {
    // Guard: if this value is no longer the active edit (e.g. Enter already
    // committed it, then the input unmount triggered a blur), bail out.
    if (this._editingValue !== value) return;
    // Use the cached node reference set in startEditing() — avoids a full DFS.
    const node = this._editingNode ?? this._flatFindNode(this.treeData, value);
    if (!node) return;
    if (!newLabel.trim()) {
      this._cancelEdit(value);
      return;
    }
    let cancelled = false;
    const ctx: EditSaveContext = {
      currentNode: node,
      newLabel,
      cancel: () => { cancelled = true; },
    };
    this.emit('sc-edit-save', { detail: ctx });
    if (!cancelled) {
      this._editingValue = null;
      this._editingNode = null;
      this._setEditing(value, false);
    }
  }

  /** Cancel editing without saving */
  private _cancelEdit(value: string) {
    this._editingValue = null;
    this._editingNode = null;
    this._setEditing(value, false);
    this.emit('sc-edit-cancel', { detail: { value } });
  }

  private _flatFindNode(items: TreeNode[], value: string): TreeNode | null {
    for (const item of items) {
      if (item.value === value) return item;
      if (item.children?.length) {
        const found = this._flatFindNode(item.children, value);
        if (found) return found;
      }
    }
    return null;
  }

  @watch('data')
  valueUpdate() {
    this.treeData = this.initializeTreeData(this.data, this.treeData);
  }

  updated(changedProperties: Map<string, any>) {
    // When only `data` changed, valueUpdate() already called initializeTreeData
    // which sets selected:false on every node. We still need to apply the current
    // selection, so let updateSelectedState() run — but skip it when data is the
    // ONLY changed property and neither selection nor selectedItems changed,
    // because initializeTreeData + a single updateSelectedState call below is
    // equivalent (avoids a redundant second traversal in the common case).
    const selectionChanged =
      changedProperties.has('selected') ||
      changedProperties.has('selectedItems') ||
      changedProperties.has('selection');
    if (selectionChanged || changedProperties.has('data')) {
      this.updateSelectedState();
    }
  }

  initializeTreeData(items: TreeItem[], existing: TreeNode[] = []): TreeNode[] {
    // Build a Map once per level for O(1) lookup instead of O(n) .find() per item.
    const existingMap = new Map<string, TreeNode>(existing.map(e => [e.value, e]));
    return items.map(item => {
      const prior = existingMap.get(item.value);
      return {
        ...item,
        childrenLoaded: item.childrenLoaded ?? false,
        loading: false,
        selected: false,
        version: 0,
        isEditing: prior?.isEditing ?? false,
        children: item.children?.length
          ? this.initializeTreeData(item.children, prior?.children ?? [])
          : [],
      };
    });
  }

  updateSelectedState() {
    // Build a Set once for O(1) per-node lookup in multiple-selection mode.
    const selectedSet = this.selection === 'multiple'
      ? new Set(this.selectedItems)
      : null;
    this.treeData = this.generateUpdatedTreeData(this.treeData, selectedSet);
  }

  generateUpdatedTreeData(
    items = this.treeData,
    selectedSet: Set<string> | null = null,
  ): TreeNode[] {
    return items.map(item => {
      const selected = this.selection === 'single'
        ? item.value === this.selected
        : (selectedSet ?? new Set(this.selectedItems)).has(item.value);

      return {
        ...item,
        selected,
        children: item.children?.length
          ? this.generateUpdatedTreeData(item.children, selectedSet)
          : item.children,
      };
    });
  }

  // findItemByValue(value: string, items = this.treeData) : TreeNode | undefined {
  //   for(const item of items) {
  //     if(item.value === value) {
  //       return item;
  //     }

  //     if (item.children?.length) {
  //       const found = this.findItemByValue(value, item.children)
  //       if(found) return found
  //     }
  //   }

  //   return undefined;
  // }

  updateNode(value: string, updates: Partial<TreeNode>, items = this.treeData): TreeNode[] {
    return items.map(item => {
      if (item.value === value) {
        return { ...item, ...updates };
      }

      if (item.children?.length) {
        return { ...item, children: this.updateNode(value, updates, item.children) };
      }

      return item;
    });
  }

  async handleLazyLoad(event: CustomEvent, item: TreeNode) {
    event.stopPropagation();
    if ((item.children?.length ?? 0) > 0 || item.childrenLoaded) {
      return;
    }
    const itemId = item.value;
    try {
      this.treeData = this.updateNode(itemId, { loading: true });
      if (typeof this.loadChildren === 'function') {
        const children = await this.loadChildren({ ...item });
        const updates: Partial<TreeNode> = {
          children: children || [],
          loading: false,
          expanded: true,
          childrenLoaded: true,
          version: (item?.version || 0) + 1,
        };
        // if (!this.refresh) {
        //   updates.childrenLoaded = true;
        // }

        this.treeData = this.updateNode(itemId, updates);

        this.emit('sc-loaded', {
          detail: {
            value: itemId,
            children,
          },
        });
      }
    } catch (error) {
      console.log('Load data failed : ', error);
      this.treeData = this.updateNode(itemId, { loading: false });
      this.emit('sc-error', {
        detail: {
          value: itemId,
          error,
        },
      });
    }
  }


  // handleCollapse(event: CustomEvent) {
  //   const item = event.detail.item;
  //   const value = item.value;

  //   if(this.refresh) {
  //     this.treeData = this.updateNode(value, {
  //       loading: false,
  //       childrenLoaded: false
  //     })
  //   }
  // }


  // handleExpand(event: CustomEvent) {
  //   const item = event.detail.item;
  //   const value = item.value;

  //   if(this.refresh) {
  //     const node = this.findItemByValue(value);
  //     if(node && node.childrenLoaded) {
  //       this.treeData = this.updateNode(value, {
  //         version: (node.version || 0) + 1
  //       })
  //     }
  //   }
  // }

  // ── Drag & Drop helpers ──────────────────────────────────────────────────

  /** Apply drag-indicator CSS class directly on the DOM node — no Lit re-render. */
  private setDragIndicator(value: string | null, position: 'before' | 'inside' | 'after' | null) {
    // Clear previous indicator
    if (this._dragOverValue) {
      const prev = this.shadowRoot?.querySelector<HTMLElement>(`[data-id="${this._dragOverValue}"]`);
      prev?.classList.remove('drag-over-before', 'drag-over-inside', 'drag-over-after');
    }
    this._dragOverValue = value;
    this._dragPosition = position;
    this._pendingPosition = position;
    if (value && position) {
      const next = this.shadowRoot?.querySelector<HTMLElement>(`[data-id="${value}"]`);
      if (next) {
        next.classList.add(`drag-over-${position}`);
        // Align the indicator line with the visible row (::part(item)).
        // sl-tree-item renders its row as a shadowRoot part; the indentation is
        // applied as padding-inline-start on that part. We approximate the offset
        // by querying the first child element inside the shadow root that has the
        // part="item" attribute, then reading its offsetLeft relative to the host.
        const partItem = (next as any).shadowRoot?.querySelector('[part~="label"]') as HTMLElement | null;
        const left = partItem ? partItem.offsetLeft : 0;
        next.style.setProperty('--_indicator-left', `${left}px`);
      }
    }
  }

  /** Cancel the pending auto-expand timer (if any). */
  private _clearExpandTimer() {
    if (this._expandTimer !== null) {
      clearTimeout(this._expandTimer);
      this._expandTimer = null;
      this._expandTargetValue = null;
    }
  }

  /** Flat DFS traversal: returns every node with its parent reference.
   *  Uses a shared accumulator to avoid O(n²) array spread allocations. */
  private flattenTree(
    items: TreeNode[],
    parent: TreeNode | null = null,
    _acc: { node: TreeNode; parent: TreeNode | null }[] = [],
  ): { node: TreeNode; parent: TreeNode | null }[] {
    for (const item of items) {
      _acc.push({ node: item, parent });
      if (item.children?.length) {
        this.flattenTree(item.children, item, _acc);
      }
    }
    return _acc;
  }

  private removeNode(value: string, items: TreeNode[]): TreeNode[] {
    return items
      .filter(item => item.value !== value)
      .map(item => ({
        ...item,
        children: item.children?.length
          ? this.removeNode(value, item.children)
          : item.children,
      }));
  }

  private insertNode(
    node: TreeNode,
    targetValue: string,
    position: 'before' | 'inside' | 'after',
    items: TreeNode[],
  ): TreeNode[] {
    const result: TreeNode[] = [];
    for (const item of items) {
      if (position === 'before' && item.value === targetValue) {
        result.push(node);
      }
      if (position === 'inside' && item.value === targetValue) {
        result.push({ ...item, children: [...(item.children || []), node], expanded: true });
        continue;
      } else {
        result.push({
          ...item,
          children: item.children?.length
            ? this.insertNode(node, targetValue, position, item.children)
            : item.children,
        });
      }
      if (position === 'after' && item.value === targetValue) {
        result.push(node);
      }
    }
    return result;
  }

  /** Determine drop zone (before / inside / after) based on mouse Y.
   *
   *  Uses asymmetric (hysteresis) boundaries so the indicator never flickers
   *  when the cursor hovers near a zone boundary:
   *
   *   ┌─────────────────────────────────────────────┐
   *   │  'before'  exit-down boundary = T + hp      │  ← must pass this to leave 'before'
   *   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   *   │             entry boundary = T              │
   *   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   *   │  'inside'  exit-up boundary   = T - hp      │  ← must pass this to leave 'inside' upward
   *   │            exit-down boundary = B + hp      │  ← must pass this to leave 'inside' downward
   *   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   *   │             entry boundary = B              │
   *   ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
   *   │  'after'   exit-up boundary  = B - hp       │  ← must pass this to leave 'after'
   *   └─────────────────────────────────────────────┘
   *
   *  where T = threshold * rowHeight, B = (1-threshold) * rowHeight, hp = DRAG_HYSTERESIS_PX.
   *
   *  Lazy nodes (hasChildren && !childrenLoaded) only allow before/after — never inside.
   */
  private getDragPosition(
    e: DragEvent,
    hostEl: HTMLElement,
    item?: TreeNode,
  ): 'before' | 'inside' | 'after' {
    // Use cached rect when hovering the same item — avoids a forced reflow on
    // every dragover event (which fires up to 60+ times/sec).
    let rect: DOMRect;
    if (this._cachedRect?.value === item?.value && this._cachedRect !== null) {
      rect = this._cachedRect.rect;
    } else {
      const rowEl = (hostEl as any).shadowRoot?.querySelector('[part~="item"]') as HTMLElement | null;
      rect = (rowEl ?? hostEl).getBoundingClientRect();
      this._cachedRect = item?.value ? { value: item.value, rect } : null;
    }
    const y = e.clientY - rect.top;
    const isLazy = item?.hasChildren && !item?.childrenLoaded;
    const threshold = isLazy ? 0.5 : 0.3;
    const hp = ScTree.DRAG_HYSTERESIS_PX;
    const T = rect.height * threshold;          // upper boundary (before ↔ inside)
    const B = rect.height * (1 - threshold);    // lower boundary (inside ↔ after)

    // The current zone for this item (synchronously maintained, not subject to rAF lag)
    const current = this._dragOverValue === item?.value ? this._pendingPosition : null;

    if (current === 'before') {
      // Stay 'before' until cursor passes T + hp downward
      return y < T + hp ? 'before' : (isLazy ? 'after' : 'inside');
    }

    if (current === 'inside') {
      // Stay 'inside' until cursor passes T - hp upward OR B + hp downward
      if (y <= T - hp) return 'before';
      if (y >= B + hp) return 'after';
      return 'inside';
    }

    if (current === 'after') {
      // Stay 'after' until cursor passes B - hp upward
      return y > B - hp ? 'after' : (isLazy ? 'before' : 'inside');
    }

    // No current zone yet (first entry) — use plain thresholds
    if (y < T) return 'before';
    if (isLazy || y >= B) return 'after';
    return 'inside';
  }

  /** Check whether `descendantValue` lives somewhere inside `ancestorChildren`. */
  private isDescendant(descendantValue: string, items: TreeNode[]): boolean {
    for (const i of items) {
      if (i.value === descendantValue) return true;
      if (i.children?.length && this.isDescendant(descendantValue, i.children)) return true;
    }
    return false;
  }

  // ── Drag event handlers ──────────────────────────────────────────────────

  handleDragStart(e: DragEvent, item: TreeNode) {
    // Stop bubbling so ancestor sl-tree-items (which also have dragstart listeners)
    // don't fire their own handleDragStart and overwrite _dragSourceValue.
    e.stopPropagation();
    if (this._editingValue !== null) {
      e.preventDefault();
      return;
    }
    this._isDragging = true;
    this._dragSourceValue = item.value;
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', item.value);
    requestAnimationFrame(() => {
      const el = this.shadowRoot?.querySelector<HTMLElement>(`[data-id="${item.value}"]`);
      if (el) el.classList.add('dragging');
    });
  }

  handleDragOver(e: DragEvent, item: TreeNode) {
    if (!this.draggable || item.value === this._dragSourceValue) return;

    // Walk composedPath to find the deepest sl-tree-item (data-id) under the pointer,
    // skipping the drag source itself (it stays in the DOM during drag).
    // If a *different* nested item is deeper than the current one, let that
    // deeper handler take ownership instead.
    const path = e.composedPath() as Element[];
    const deepestItem = path.find(
      el =>
        el instanceof Element &&
        el.hasAttribute('data-id') &&
        el.getAttribute('data-id') !== this._dragSourceValue,
    ) as HTMLElement | undefined;
    if (deepestItem && deepestItem.getAttribute('data-id') !== item.value) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = 'move';
    const hostEl = e.currentTarget as HTMLElement;
    const pos = this.getDragPosition(e, hostEl, item);
    // Only update DOM if target or position actually changed — avoids any class thrash
    if (this._dragOverValue !== item.value || this._pendingPosition !== pos) {
      // Invalidate rect cache when switching to a different target node
      if (this._dragOverValue !== item.value) {
        this._cachedRect = null;
        this._clearExpandTimer();
      }
      // Auto-expand collapsed nodes after hovering 'inside' them for 600 ms.
      // Only schedule if this item has children and is not already expanded.
      if (pos === 'inside' && this._expandTargetValue !== item.value) {
        const flatEntry = this.flattenTree(this.treeData).find(f => f.node.value === item.value);
        if (flatEntry && (flatEntry.node.children?.length || flatEntry.node.hasChildren) && !flatEntry.node.expanded) {
          this._clearExpandTimer();
          this._expandTargetValue = item.value;
          this._expandTimer = setTimeout(() => {
            this._expandTimer = null;
            this._expandTargetValue = null;
            const domEl = this.shadowRoot?.querySelector<any>(`[data-id="${item.value}"]`);
            if (domEl && this._pendingPosition === 'inside') {
              domEl.expanded = true;
              // Invalidate cached rect after expand (row may shift)
              this._cachedRect = null;
            }
          }, 600);
        }
      } else if (pos !== 'inside') {
        this._clearExpandTimer();
      }
      // Synchronously record the intended position so the next getDragPosition
      // call (before the rAF fires) can use it for hysteresis comparison.
      this._pendingPosition = pos;
      // Debounce via rAF: cancel any pending frame so we only paint once per frame
      if (this._dragRafId !== null) {
        cancelAnimationFrame(this._dragRafId);
      }
      this._dragRafId = requestAnimationFrame(() => {
        this._dragRafId = null;
        this.setDragIndicator(item.value, pos);
      });
    }
  }

  handleDragLeave(e: DragEvent, item: TreeNode) {
    if (this._dragOverValue !== item.value) return;
    const hostEl = e.currentTarget as HTMLElement;
    const related = e.relatedTarget as Node | null;
    if (!related || !hostEl.contains(related)) {
      // Cancel pending rAF and expand timer when leaving a node
      if (this._dragRafId !== null) {
        cancelAnimationFrame(this._dragRafId);
        this._dragRafId = null;
      }
      this._clearExpandTimer();
      this._cachedRect = null;
      this.setDragIndicator(null, null);
    }
  }

  /**
   * Fired when a node is successfully dropped onto a new position.
   * @fires {CustomEvent<{sourceValue:string, targetValue:string, position:'before'|'inside'|'after', data:TreeNode[]}>} sc-drop
   */
  handleDrop(e: DragEvent, targetItem: TreeNode) {
    // Same deepest-item guard as dragover — skip the source node itself.
    const path = e.composedPath() as Element[];
    const deepestItem = path.find(
      el =>
        el instanceof Element &&
        el.hasAttribute('data-id') &&
        el.getAttribute('data-id') !== this._dragSourceValue,
    ) as HTMLElement | undefined;
    if (deepestItem && deepestItem.getAttribute('data-id') !== targetItem.value) return;

    e.preventDefault();
    e.stopPropagation();
    const sourceValue = this._dragSourceValue;
    // Use _pendingPosition — it is updated synchronously on every dragover and
    // is never behind by an rAF frame the way _dragPosition can be.
    const position = this._pendingPosition ?? this._dragPosition;
    this._clearExpandTimer();
    this.setDragIndicator(null, null);

    if (!sourceValue || !position || sourceValue === targetItem.value) return;

    const sourceEntry = this.flattenTree(this.treeData).find(f => f.node.value === sourceValue);
    if (!sourceEntry) return;

    // Prevent dropping a parent into one of its own descendants
    if (
      sourceEntry.node.children?.length &&
      this.isDescendant(targetItem.value, sourceEntry.node.children)
    ) return;

    let updated = this.removeNode(sourceValue, this.treeData);
    updated = this.insertNode(sourceEntry.node, targetItem.value, position, updated);
    this.treeData = updated;

    // In multiple selection mode, after Lit re-renders we manually force-sync
    // the DOM selection state:
    // 0. Ensure every sl-tree-item has selectable=true so the checkbox renders.
    //    Shoelace's initTreeItem (called by MutationObserver) only processes the
    //    root of an inserted subtree — deeply nested items in a moved subtree
    //    never get initTreeItem called, so their selectable stays false and the
    //    checkbox is not rendered.  We fix this by setting selectable ourselves.
    // 1. Set every leaf's `selected` from selectedItems (source of truth).
    // 2. Walk bottom-up to recompute each parent's selected/indeterminate.
    if (this.selection === 'multiple') {
      this.updateComplete.then(async () => {
        const slTree = this.shadowRoot?.querySelector<any>('sl-tree');
        if (!slTree) return;
        const selectedSet = new Set(this.selectedItems);
        const allItems: SlTreeItem[] = Array.from(slTree.querySelectorAll('sl-tree-item'));

        // Step 0: ensure every item shows its checkbox (selectable must be true).
        // Shoelace only sets selectable on the root of an inserted subtree via its
        // MutationObserver; deeply-nested children inside a dragged subtree keep
        // selectable=false (default) and their checkboxes are never rendered.
        allItems.forEach(domItem => {
          if (!(domItem as any).selectable) {
            (domItem as any).selectable = true;
          }
        });
        // Wait for the selectable change to be committed to the DOM (checkbox rendered)
        await Promise.all(allItems.map(item => (item as any).updateComplete));

        // Step 1: set every leaf's selected state from selectedItems (source of truth)
        allItems.forEach(domItem => {
          const hasChildren = domItem.querySelectorAll(':scope > sl-tree-item').length > 0;
          if (!hasChildren) {
            (domItem as any).selected = selectedSet.has((domItem as any).value);
            (domItem as any).indeterminate = false;
          }
        });

        // Step 2 + 3 combined: bottom-up — sync each parent from its direct DOM children,
        // and collect all selected nodes (both leaves and fully-checked parents) in one pass.
        const newSelectedItems: string[] = [];
        [...allItems].reverse().forEach(domItem => {
          const childItems = Array.from(domItem.querySelectorAll(':scope > sl-tree-item'));
          if (childItems.length > 0) {
            // Parent: derive selected/indeterminate from children
            const allChecked = childItems.every(c => (c as any).selected);
            const anyChecked = childItems.some(c => (c as any).selected || (c as any).indeterminate);
            (domItem as any).selected = allChecked;
            (domItem as any).indeterminate = !allChecked && anyChecked;
          }
          // Collect any node (leaf or parent) that is fully selected
          if ((domItem as any).selected) {
            newSelectedItems.push((domItem as any).value as string);
          }
        });

        this._isDragging = false;
        // Always sync selectedItems and emit sc-select so consumers reflect the
        // post-drop selection — e.g. a previously-unselected node that became
        // the sole parent of selected children is now correctly selected too.
        this.selectedItems = newSelectedItems;
        this.emit('sc-select', { detail: { value: newSelectedItems } });
      });
    } else {
      this._isDragging = false;
    }

    this.emit('sc-drop', {
      detail: {
        sourceValue,
        targetValue: targetItem.value,
        position,
        data: updated,
      },
    });
  }

  handleDragEnd(e: DragEvent, item: TreeNode) {
    void e; void item;
    // Cancel any pending rAF so a stale indicator update doesn't fire after drop.
    if (this._dragRafId !== null) {
      cancelAnimationFrame(this._dragRafId);
      this._dragRafId = null;
    }
    this._clearExpandTimer();
    this._cachedRect = null;
    this._isDragging = false;
    this.shadowRoot?.querySelectorAll<HTMLElement>('.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
    this._dragSourceValue = null;
    this._pendingPosition = null;
    this.setDragIndicator(null, null);
  }

  render() {
    return html`
      <sl-tree 
        .selection="${this.selection}" 
        @sl-selection-change="${this.handleSelect}"
        class=${classMap({
      'tree-with-lines': this.showIndentLines,
      'actions-always': this.showActions === 'always',
    })}
      >
        ${this.renderItems(this.treeData, 0)}
      </sl-tree>
    `;
  }

  renderIcon(iconName: any) {
    if (!iconName) return '';
    return html`<div class="tree-item-icon">
      <sc-icon name="${iconName}"></sc-icon>
    </div>`;
  }

  renderLabel(item: TreeItem) {
    if (typeof item.label === 'function') {
      try {
        return item.label({
          item,
          selected: this.selection === 'single' ?
            this.selected === item.value : this.selectedItems.includes(item.value),
          tree: this,
        });
      } catch (err) {
        console.error('render failed : ', err);
      }
    }
    return item.label;
  }

  // render item
  renderItems(items: TreeNode[], level: number, parentNode: TreeItem | null = null): TemplateResult[] {
    return items.map((item: any) => {
      const shouldBeLazy = item.hasChildren && !item.childrenLoaded;
      const labelText = typeof item.label === 'string' ? item.label : '';
      return html`
        <sl-tree-item
          .key="${item.value}-${item.version}"
          .value="${item.value}" 
          ?expanded=${item.expanded}
          ?disabled=${item.disabled}
          ?selected=${item.selected}
          ?lazy="${shouldBeLazy}"
          data-level="${level}"
          data-id="${item.value}"
          draggable="${this.draggable && !item.isEditing ? 'true' : 'false'}"
          @sl-lazy-load=${(e: CustomEvent) => this.handleLazyLoad(e, item)}
          @dragstart=${this.draggable ? (e: DragEvent) => this.handleDragStart(e, item) : null}
          @dragover=${this.draggable ? (e: DragEvent) => this.handleDragOver(e, item) : null}
          @dragleave=${this.draggable ? (e: DragEvent) => this.handleDragLeave(e, item) : null}
          @drop=${this.draggable ? (e: DragEvent) => this.handleDrop(e, item) : null}
          @dragend=${this.draggable ? (e: DragEvent) => this.handleDragEnd(e, item) : null}
          style="
            --sl-toggle-size-medium:1rem;
            --sl-color-primary-600:var(--sc-checkbox-checked-border-color, var(--sc-color-blue-500))"
        >
          <div class="tree-item-content" part="base">
            ${this.renderIcon(item.prefixIcon)}
            ${item.isEditing ? html`
              <input
                class="tree-item-edit-input"
                data-edit-id="${item.value}"
                .value="${labelText}"
                @click=${(e: MouseEvent) => e.stopPropagation()}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    this._commitEdit(item.value, (e.target as HTMLInputElement).value);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this._cancelEdit(item.value);
                  }
                }}
                @blur=${(e: FocusEvent) => {
                  this._commitEdit(item.value, (e.target as HTMLInputElement).value);
                }}
              />
            ` : html`
              <div class="tree-item-label" part="label" title=${labelText}>
                ${this.renderLabel(item)}
              </div>
              <span class="tree-item-actions" @click=${(e: MouseEvent) => e.stopPropagation()}>
                ${this.actionRenderer ? this.actionRenderer({
                  currentNode: item,
                  parentNode,
                  tree: this,
                }) : nothing}
              </span>
            `}
          </div>

          <!-- render children node part -->
          ${item.children?.length ? this.renderItems(item.children, level + 1, item) : ''}
        </sl-tree-item>
      `;
    });
  }

  /**
   * Fired when the user selects a tree node.
   * @fires {CustomEvent<{value:string|string[]}>} sc-select
   */
  handleSelect(event: CustomEvent) {
    // Suppress selection changes that Shoelace fires during drag-drop DOM rebuild.
    // The correct selectedItems are reconciled in handleDrop's updateComplete callback.
    if (this._isDragging) return;
    const selectionData = event.detail.selection;
    if (this.selection === 'single') {
      const selectedId = selectionData.length > 0 ? selectionData[0].value : null;
      this.selected = selectedId;
      this.emit('sc-select', {
        detail: {
          value: selectedId,
        },
      });
    } else {
      const updatedItems = selectionData.map((item: { value: any; }) => item.value);
      this.selectedItems = updatedItems;
      this.emit('sc-select', {
        detail: {
          value: updatedItems,
        },
      });
    }
  }
}
