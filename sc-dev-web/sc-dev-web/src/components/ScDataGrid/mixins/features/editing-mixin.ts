import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { queryAsync } from 'lit/decorators.js';
import { Cell } from '@tanstack/lit-table';
import type { ScDataGridEditing } from '../../ScDataGridEditing.js';
import ScElement from '../../../../shared/sc-element.js';
import { ToolkitMixin } from '../toolkit-mixin.js';

type TEditing = {
  cell: Cell<unknown, unknown>;
  target: HTMLElement;
};

export type TMixin = {
  toggleEditingPanel(e: CustomEvent): void;
  getEditingOptions(): any;
  hideEditingPanelWhenScroll(): Promise<void>;
  getIsCellNotCovered(cellRect: DOMRect, target: HTMLElement): boolean
};

export const EditingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(ToolkitMixin(superClass))
      implements Feature<'editing'>
    {
      @queryAsync('sc-data-grid-editing')
      editingEl: Promise<ScDataGridEditing>;

      async hideEditingPanelWhenScroll() {
        const editingEl = await this.editingEl;
        editingEl.hidePopup();
      }

      
      getIsCellNotCovered(cellRect: DOMRect, target: HTMLElement) {
        const topLeft = [cellRect.left + 1, cellRect.y + 1];
        const topRight = [cellRect.right - 1, topLeft[1]];

        
        const left = this.shadowRoot?.elementFromPoint?.(topLeft[0], topLeft[1]);
        const right = this.shadowRoot?.elementFromPoint?.(topRight[0], topRight[1]);

        return left === right && left === target;
      }

      async toggleEditingPanel(e: CustomEvent<TEditing>) {
        const editingEl = await this.editingEl;
        const cellInstance = e.detail.cell;
        const isEditable = cellInstance.getIsEditable();
        if (!isEditable) {
          return;
        }

        this.table.setEditingCells(new Map([[cellInstance, true]]));
        const target = e.detail.target;
        
        const rectForAutoScroll = target.getBoundingClientRect();
        
        const notCovered = this.getIsCellNotCovered(rectForAutoScroll, target);
        if (!notCovered) {
          target.scrollIntoView();
        }
        await this.afterFrameUpdate();
        const rect = target.getBoundingClientRect();
        const adjustedRect = new DOMRect(
          rect.x,
          rect.y - rect.height,
          rect.width,
          rect.height
        );
        const cellEditor = cellInstance.column.getCellEditor();
        const cellEditorParams = cellInstance.column.getCellEditorParams();
        editingEl.cell = cellInstance;
        editingEl.cellEditor = cellEditor;
        editingEl.cellEditorParams = cellEditorParams;

        editingEl.setVirtualAnchor({
          getBoundingClientRect() {
            return adjustedRect;
          },
        });
        editingEl.showPopup();
        this.emit('sc-editing-started', {
          detail: {
            value: cellInstance,
          },
        });
      }
      updateEditing() {}
      getEditingOptions() {
        return {};
      }
    }
    return Mixin;
  }
);
