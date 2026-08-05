import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import { property } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { getPaginationRowModel } from '@tanstack/lit-table';
import ScElement from '../../../../shared/sc-element.js';
import { MasterRowMixin } from '../master-row.mixin.js';
import { RowHeightObserverMixin } from '../row-height-observer-mixin.js';
import { ERowPosition } from '../../types/utils.js';

export type TMixin = {
  getPaginationOptions(): {
    autoResetPageIndex: boolean;
  };
  pageIndex: number;
  pageSize: number;
  pagination: boolean;
  manualPagination: boolean;
  total: number;
  jumpFirstLastPage: boolean;
  sizeChanger: boolean;
  quickJumper: boolean;
  noTruncation: boolean;
  label: boolean;
  pageSizeOptions: number[];
  handlePageChange(
    e: CustomEvent<{
      page: number;
      pageSize: number;
    }>
  ): void;
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_INDEX = 1;
const DEFAULT_TOTAL = -1;

export const PaginationMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends MasterRowMixin(
        RowHeightObserverMixin(TableStateMixin(superClass))
      )
      implements Feature<'pagination'>
    {
      @storybook('boolean', {
        description: 'Set to enable pagination',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: true,
      })
      pagination = false;

      @storybook('number', {
        description: 'The current page index (zero-based)',
        defaultValue: DEFAULT_PAGE_INDEX,
      })
      @property({ type: Number, attribute: 'page-index', reflect: true })
      pageIndex = DEFAULT_PAGE_INDEX;

      @storybook('number', {
        description: 'The current page size',
        defaultValue: DEFAULT_PAGE_SIZE,
      })
      @property({ type: Number, attribute: 'page-size', reflect: true })
      pageSize = DEFAULT_PAGE_SIZE;

      @storybook('boolean', {
        description:
          'Set to enable manual pagination, listen sc-page-change to update grid data if true',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'manual-pagination',
        reflect: true,
      })
      manualPagination = false;

      @storybook('number', {
        description: 'The total row size for manual pagination.',
        defaultValue: DEFAULT_TOTAL,
      })
      @property({ type: Number, reflect: true })
      total = DEFAULT_TOTAL;

      @storybook('boolean', {
        description: 'Set to show the pagination label',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: false,
      })
      label = false;

      @storybook('boolean', {
        description: 'Set to hide truncation between pages.',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'no-truncation',
        reflect: false,
      })
      noTruncation = false;

      @storybook('boolean', {
        description: 'Sets to show the pagination quick jumpe',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: false,
        attribute: 'quick-jumper',
      })
      quickJumper = false;

      @storybook('boolean', {
        description:
          'Sets to allow user to change the size of each page for pagination',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: false,
        attribute: 'size-changer',
      })
      sizeChanger = false;

      @storybook('boolean', {
        description:
          'Set to show first page and last page jumpers for pagination',
        defaultValue: true,
      })
      @property({
        type: Boolean,
        reflect: true,
        attribute: 'jump-first-last-page',
      })
      jumpFirstLastPage = true;

      @storybook('object', {
        description: 'Set to define custom page size options.',
        defaultValue: [],
      })
      @property({
        type: Array,
        reflect: true,
        attribute: 'page-size-options',
      })
      pageSizeOptions = [];

      getPaginationOptions() {
        return {
          autoResetPageIndex: false,
        };
      }

      @watch(['pageIndex', 'pageSize'])
      updatePagination() {
        this.updatePaginationState(this.pageIndex, this.pageSize);
      }

      get manualPaginationOpt() {
        if (!this.pagination) {
          return {};
        }
        if (!this.manualPagination) {
          return {
            getPaginationRowModel: getPaginationRowModel(),
          };
        }
        if (this.total === DEFAULT_TOTAL || this.total < 0) {
          throw new Error(
            'total attribute of <sc-data-grid> is required for manual pagination, and must be greater than 0'
          );
        }
        return {
          manualPagination: true,
          rowCount: this.total,
        };
      }
      @watch(['manualPagination', 'total', 'pagination'])
      handleManualPaginationChange(prev: any, now: any) {
        let paginateExpandedRows = false;
        const isHasGroupedRow = this.table
          .getAllLeafColumns()
          .some(column => column.columnDef.meta?.rowGrouping);
        if (this.pagination) {
          if (isHasGroupedRow && this.table.options.manualPagination) {
            paginateExpandedRows = true;
          } else {
            paginateExpandedRows = false;
          }
        } else {
          paginateExpandedRows = true;
        }
        this.table.setOptions(prev => {
          const { getPaginationRowModel, manualPagination, rowCount, ...opt } =
            prev;
          return {
            ...opt,
            ...this.manualPaginationOpt,
            // when no pagination, must set to true, otherwise wont expanded
            paginateExpandedRows,
            isEnablePagination: this.pagination,
          };
        });
        if (this.pagination) {
          this.updatePaginationState(this.pageIndex, this.pageSize);
        } else {
          this.updatePaginationState(DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE);
        }
        this.table.updateRowSpanning();
      }

      updatePaginationState(pageIndex: number, pageSize: number) {
        if (this.canUpdate(pageIndex, pageSize)) {
          this.table.setPagination({
            pageIndex: pageIndex - 1,
            pageSize,
          });
        }
      }
      canUpdate(pageIndex: number, pageSize: number) {
        const { pageIndex: prePageIndex, pageSize: prePageSize } =
          this.table.getState().pagination;
        const doNotUpdate =
          prePageIndex === pageIndex - 1 && prePageSize === pageSize;
        return !doNotUpdate;
      }

      handlePageChange(e: CustomEvent<{ page: number; pageSize: number }>) {
        const info = e.detail;
        const { page: pageIndex, pageSize } = info;
        if (this.canUpdate(pageIndex, pageSize)) {
          this.updatePaginationState(pageIndex, pageSize);
          this.table.updateRowSpanning();

          this.updatePrefixSum(ERowPosition.center);
          this.updatePrefixSum(ERowPosition.top);
          this.updatePrefixSum(ERowPosition.bottom);
          this.updatePrefixSum(ERowPosition.header);
          this.updateMasterRowPrefixSum();

          this.emit('sc-page-change', {
            detail: {
              page: pageIndex,
              pageSize,
            },
          });
        }
      }
    }
    return Mixin;
  }
);
