import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import {
  ColumnSizingMixin,
  TMixin as ColumnSizingTMixin,
} from './column-sizing-mixin.js';
import {
  ColumnPinningMixin,
  TMixin as ColumnPinningTMixin,
} from './column-pinning-mixin.js';
import {
  ColumnSpanningMixin,
  TMixin as ColumnSpanningTMixin,
} from './column-spanning-mixin.js';
import {
  RowSortingMixin,
  TMixin as RwoSortingTMixin,
} from './row-sorting-mixin.js';
import {
  RowSpanningMixin,
  TMixin as RowSpanningTMixin,
} from './row-spanning-mixin.js';
import {
  RowPinningMixin,
  TMixin as RowPinningTMixin,
} from './row-pinning-mixin.js';
import {
  RowDraggableMixin,
  TMixin as RowDraggableTMixin,
} from './row-draggable-mixin.js';
import {
  PaginationMixin,
  TMixin as PaginationTMixin,
} from './pagination-mixin.js';
import { GroupingMixin, TMixin as GroupingTMixin } from './grouping-mixin.js';
import { ExpandingMixin, TMixin as ExpandTMixin } from './expanding-mixin.js';
import {
  ColumnVisibilityMixin,
  TMixin as ColumnVisibilityTMixin,
} from './column-visibility-mixin.js';
import {
  ColumnOrderingMixin,
  TMixin as ColumnOrderingTMixin,
} from './column-order-mixin.js';
import {
  RowSelectionMixin,
  TMixin as RowSelectionTMixin,
} from './row-selection-mixin.js';
import {
  CellDataTypeMixin,
  TMixin as CellDataTypeTMixin,
} from './cell-data-type-mixin.js';
import { StylesMixin, TMixin as StylesTMixin } from './styles-mixin.js';
import { EditingMixin, TMixin as EditingTMixin } from './editing-mixin.js';
import {
  ColumnFilterMixin,
  TMixin as ColumnFilterTMixin,
} from './column-filter-mixin.js';
import ScElement from '../../../../shared/sc-element.js';
import { KeyboardMixin, TMixin as KeyboardTMixin } from './keyboard-mixin.js';
import { GroupingTreeMixin } from './grouping-tree-mixin.js';
import { DataExportMixin, DataExportTMixin } from './data-export/index.js';

type TMixin = ColumnSizingTMixin &
  ColumnPinningTMixin &
  ColumnSpanningTMixin &
  RowPinningTMixin &
  RowSpanningTMixin &
  ColumnVisibilityTMixin &
  ColumnOrderingTMixin &
  PaginationTMixin &
  RowDraggableTMixin &
  GroupingTMixin &
  ExpandTMixin &
  RowSelectionTMixin &
  CellDataTypeTMixin &
  ColumnFilterTMixin &
  StylesTMixin &
  EditingTMixin &
  KeyboardTMixin &
  RwoSortingTMixin & {
    getFeatureOptions: () => Record<string, any>;
  } & DataExportTMixin;

export const FeaturesMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends KeyboardMixin(
      ColumnPinningMixin(
        EditingMixin(
          RowDraggableMixin(
            ColumnOrderingMixin(
              ColumnVisibilityMixin(
                PaginationMixin(
                  RowPinningMixin(
                    ColumnSizingMixin(
                      CellDataTypeMixin(
                        RowSelectionMixin(
                          RowSortingMixin(
                            ExpandingMixin(
                              GroupingMixin(
                                GroupingTreeMixin(
                                  RowSpanningMixin(
                                    ColumnSpanningMixin(
                                      ColumnFilterMixin(
                                        DataExportMixin(StylesMixin(superClass))
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    ) {
      constructor() {
        super();
        this.getFeatureOptions = this.getFeatureOptions.bind(this);
      }
      getFeatureOptions() {
        return {
          ...this.getPaginationOptions(),
          ...this.getRowPinningOptions(),
          ...this.getRowSortingOptions(),
          ...this.getColumnSizingOptions(),
          ...this.getColumnPinningOptions(),
          ...this.getRowSpanningConfigurationsOptions(),
          ...this.getColumnSpanningConfigurationsOptions(),
          ...this.getColumnVisibilityOptions(),
          ...this.getGroupingOptions(),
          ...this.getGroupingTreeOptions(),
          ...this.getExpandedOptions(),
          ...this.getRowSelectionOptions(),
          ...this.getColumnFilterOptions(),
          ...this.getColumnOrderingOptions(),
          ...this.getEditingOptions(),
          ...this.getRowDraggableOptions(),
        };
      }
    }
    return Mixin;
  }
);
