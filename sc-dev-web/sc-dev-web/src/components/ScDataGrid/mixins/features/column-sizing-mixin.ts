import { PropertyValueMap } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import {
  ColumnSizingState,
  Header,
  RowData,
  defaultColumnSizing,
} from '@tanstack/lit-table';
import { property } from 'lit/decorators.js';
import { watch } from '../../../../shared/watch.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { Feature } from '../../types/Feature.js';
import { EPosition, TPosition } from '../../types/utils.js';
import ScElement from '../../../../shared/sc-element.js';

export enum ColumnResizeStrategy {
  flexible = 'flexible',
  fixed = 'fixed',
}
const fixed = 'flexible';
const flexible = 'fixed';
type TColumnResizeStrategy = typeof fixed | typeof flexible;

let passiveSupported: boolean | null = null;
function passiveEventSupported() {
  if (typeof passiveSupported === 'boolean') return passiveSupported;

  let supported = false;
  try {
    const options = {
      get passive() {
        supported = true;
        return false;
      },
    };

    const noop = () => undefined;

    window.addEventListener('test', noop, options);
    window.removeEventListener('test', noop);
  } catch (err) {
    supported = false;
  }
  passiveSupported = supported;
  return passiveSupported;
}

function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === 'touchstart';
}

export type TMixin = {
  columnResizeStrategy: TColumnResizeStrategy;
  dynamicColumnWidth?: boolean;
  enableResizing?: boolean;
  whenSizingUpdate(): void;
  getSizeOf(type: 'max' | 'min', minSize?: number): number;
  getResizeHandler(
    header: Header<RowData, any>,
    _contextDocument?: Document
  ): (e: unknown) => void;
  resetSizeHandler(header: Header<unknown, unknown>): void;
  getSize(position: TPosition): number | undefined;
  finalizeSize(position: TPosition): {
    width?: string;
    minWidth?: string;
    maxWidth?: string;
  };
  getColumnSizingOptions(): {
    columnResizeMode: string;
    columnResizeDirection: string;
  };
};

export const ColumnSizingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'columnSizing'>
    {
      @storybook('boolean', {
        description:
          'Re-calculate and update column width after column visibility change when enable',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'dynamic-column-width',
        reflect: false,
      })
      dynamicColumnWidth?: boolean = false;

      @storybook('inline-radio', {
        description: 'Set to change resizing strategy',
        defaultValue: ColumnResizeStrategy.flexible,
        options: [ColumnResizeStrategy.flexible, ColumnResizeStrategy.fixed],
      })
      @property({
        type: String,
        attribute: 'column-resize-strategy',
        reflect: true,
      })
      columnResizeStrategy: ColumnResizeStrategy =
        ColumnResizeStrategy.flexible;

      @storybook('boolean', {
        description: 'Set to enable resizing',
        defaultValue: true,
      })
      @property({ type: Boolean, attribute: 'enable-resizing', reflect: true })
      enableResizing?: boolean = true;

      @storybook('boolean', {
        description: 'Set to disable flexible column width which means not fill the entire widht of data grid',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'disable-flexible-column-width',
        reflect: true,
      })
      disableFlexibleColumnWidth?: boolean = false;

      previousColumnSizing: ColumnSizingState = {};
      whenSizingUpdate = () => {
        this.table.getHeaderGroups().forEach(headerGroup => {
          headerGroup.headers.forEach(header => {
            this.previousColumnSizing[header.column.id] =
              header.column.getSize();
          });
        });
      };

      @watch('columns', { waitUntilFirstUpdate: true })
      updateColumnSizing() {
        this.initializeColumnSizing(this.clientWidth);
      }

      @watch(['enableResizing'])
      handleDisableResizingChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            columns: [...prev.columns],
            defaultColumn: {
              ...prev.defaultColumn,
              enableResizing: this.enableResizing,
            },
          };
        });

        this.setDefaultColumnSizing();
      }

      @watch('disableFlexibleColumnWidth')
      handleDisableFlexibleColumnWidth() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            disableFlexibleColumnWidth: this.disableFlexibleColumnWidth,
          };
        });
        
        this.initializeColumnSizing(this.clientWidth);
      }

      @watch('columnResizeStrategy')
      handleResizeStrategyChange() {
        this.setDefaultColumnSizing();
      }

      getSize(position: TPosition) {
        let size;
        if (position === EPosition.left) {
          size = this.table.getLeftTotalSize();
        } else if (position === EPosition.right) {
          size = this.table.getRightTotalSize();
        }
        return size;
      }

      getColumnSizingOptions() {
        return {
          columnResizeMode: 'onChange',
          columnResizeDirection: 'ltr',
        };
      }

      finalizeSize(position: TPosition) {
        if (position === EPosition.center) {
          return {};
        }
        const size = this.getSize(position);
        return {
          width: `${size}px`,
          minWidth: `${size}px`,
          maxWidth: `${size}px`,
        };
      }

      setDefaultColumnSizing() {
        for (const id in this.previousColumnSizing) {
          const column = this.table.getColumn(id);
          if (column) {
            column.columnDef.size = this.previousColumnSizing[id];
          }
        }
      }

      initializeColumnSizing(totalWidth: number) {
        // if user set flex for columns, it will occupy the remaining space automatically
        // otherwise columns only take their own space size
        this.table.calculateTableSizing(totalWidth);
      }

      previousMaxSize: Set<[string, number]> = new Set();
      getSizeOf(type: 'max' | 'min', minSize?: number) {
        return minSize ?? defaultColumnSizing[`${type}Size`];
      }

      resetMaxSize() {
        this.previousMaxSize.forEach(([id, maxSize]) => {
          const column = this.table.getColumn(id);
          if (column) {
            column.columnDef.maxSize = maxSize;
          }
        });
      }

      getResizeHandler(
        header: Header<RowData, any>,
        _contextDocument?: Document
      ) {
        const deepestHeader = header
          .getLeafHeaders()
          .filter(header => header.depth === this.table.getMaxDepth());

        if (!deepestHeader.length) {
          return () => {};
        }
        const column = deepestHeader[deepestHeader.length - 1].column;

        const canResize = column?.getCanResize();

        return (e: unknown) => {
          if (!column || !canResize) {
            return;
          }

          (e as any).persist?.();

          if (isTouchStartEvent(e)) {
            // lets not respond to multiple touches (e.g. 2 or 3 fingers)
            if (e.touches && e.touches.length > 1) {
              return;
            }
          }

          const startSize = header.getSize();

          const columnSizingStart: [string, number][] = [
            [column.id, column.getSize()],
          ];

          const adjacentColumnSizingStart: Record<
            string,
            {
              id: string;
              size: number;
            }
          > = {};

          this.resetMaxSize();

          const { nextColumn } = column.getAdjacentColumns();

          if (this.columnResizeStrategy === ColumnResizeStrategy.fixed) {
            columnSizingStart.forEach(([colId, size]) => {
              if (nextColumn) {
                const startColumn = this.table.getColumn(colId)!;
                const totalSize = nextColumn.getSize() + size;
                const startColumnMaxSize =
                  totalSize -
                  this.getSizeOf('min', nextColumn.columnDef.minSize);
                const nextColumnMaxSize =
                  totalSize -
                  this.getSizeOf(
                    'min',
                    this.table.getColumn(colId)?.columnDef.minSize
                  );

                this.previousMaxSize.add([
                  colId,
                  this.getSizeOf('max', startColumn.columnDef.maxSize),
                ]);
                this.previousMaxSize.add([
                  nextColumn.id,
                  this.getSizeOf('max', nextColumn.columnDef.maxSize),
                ]);

                nextColumn.columnDef.maxSize = nextColumnMaxSize;
                startColumn.columnDef.maxSize = startColumnMaxSize;

                adjacentColumnSizingStart[colId] = {
                  id: nextColumn.id,
                  size: nextColumn.getSize(),
                };
              }
            });
          }

          const clientX = isTouchStartEvent(e)
            ? // eslint-disable-next-line
              Math.round(e.touches[0]!.clientX)
            : (e as MouseEvent).clientX;

          const newColumnSizing: ColumnSizingState = {};

          const updateOffset = (
            eventType: 'move' | 'end',
            clientXPos?: number
          ) => {
            if (typeof clientXPos !== 'number') {
              return;
            }

            this.table.setColumnSizingInfo(old => {
              const deltaDirection =
                this.table.options.columnResizeDirection === 'rtl' ? -1 : 1;
              const deltaOffset =
                (clientXPos - (old?.startOffset ?? 0)) * deltaDirection;

              const deltaPercentage = Math.max(
                deltaOffset / (old.columnSizingStart[0][1] ?? 0),
                -0.999999
              );

              old.columnSizingStart.forEach(([columnId, headerSize]) => {
                const sizeForColumn =
                  Math.round(
                    Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
                  ) / 100;
                newColumnSizing[columnId] = sizeForColumn;

                if (this.columnResizeStrategy === ColumnResizeStrategy.fixed) {
                  const { id: nextColumnId, size: nextColumnSize } =
                    adjacentColumnSizingStart[columnId] ?? [];
                  if (nextColumnId) {
                    const sizeForAdjacentColumn =
                      nextColumnSize - (newColumnSizing[columnId] - headerSize);

                    newColumnSizing[nextColumnId] = Math.min(
                      sizeForAdjacentColumn,
                      this.getSizeOf(
                        'max',
                        this.table.getColumn(nextColumnId)?.columnDef.maxSize
                      )
                    );
                  }
                }
              });

              return {
                ...old,
                deltaOffset,
                deltaPercentage,
              };
            });

            for (const columnId in newColumnSizing) {
              const column = this.table.getColumn(columnId);
              if (column) {
                column.columnDef.size = newColumnSizing[columnId];
              }
            }

            if (
              this.table.options.columnResizeMode === 'onChange' ||
              eventType === 'end'
            ) {
              this.table.setColumnSizing(old => {
                return {
                  ...old,
                  ...newColumnSizing,
                };
              });
            }
          };

          this.emit('sc-mouse-down', {
            detail: {
              column,
            },
          });
          const onMove = (clientXPos?: number) => {
            updateOffset('move', clientXPos);
            this.emit('sc-mouse-move', {
              detail: {
                column,
              },
            });
          };

          const onEnd = (clientXPos?: number) => {
            updateOffset('end', clientXPos);

            this.table.setColumnSizingInfo(old => ({
              ...old,
              isResizingColumn: false,
              startOffset: null,
              startSize: null,
              deltaOffset: null,
              deltaPercentage: null,
              columnSizingStart: [],
            }));

            this.emit('sc-mouse-up', {
              detail: {
                column,
              },
            });
          };

          const contextDocument =
            _contextDocument || typeof document !== 'undefined'
              ? document
              : null;

          const mouseEvents = {
            moveHandler: (e: MouseEvent) => onMove(e.clientX),
            upHandler: (e: MouseEvent) => {
              contextDocument?.removeEventListener(
                'mousemove',
                mouseEvents.moveHandler
              );
              contextDocument?.removeEventListener(
                'mouseup',
                mouseEvents.upHandler
              );
              onEnd(e.clientX);
            },
          };

          const touchEvents = {
            moveHandler: (e: TouchEvent) => {
              if (e.cancelable) {
                e.preventDefault();
                e.stopPropagation();
              }
              // eslint-disable-next-line
              onMove(e.touches[0]!.clientX);
              return false;
            },
            upHandler: (e: TouchEvent) => {
              contextDocument?.removeEventListener(
                'touchmove',
                touchEvents.moveHandler
              );
              contextDocument?.removeEventListener(
                'touchend',
                touchEvents.upHandler
              );
              if (e.cancelable) {
                e.preventDefault();
                e.stopPropagation();
              }
              onEnd(e.touches[0]?.clientX);
            },
          };

          const passiveIfSupported = passiveEventSupported()
            ? { passive: false }
            : false;

          if (isTouchStartEvent(e)) {
            contextDocument?.addEventListener(
              'touchmove',
              touchEvents.moveHandler,
              passiveIfSupported
            );
            contextDocument?.addEventListener(
              'touchend',
              touchEvents.upHandler,
              passiveIfSupported
            );
          } else {
            contextDocument?.addEventListener(
              'mousemove',
              mouseEvents.moveHandler,
              passiveIfSupported
            );
            contextDocument?.addEventListener(
              'mouseup',
              mouseEvents.upHandler,
              passiveIfSupported
            );
          }

          this.table.setColumnSizingInfo(old => ({
            ...old,
            startOffset: clientX,
            startSize,
            deltaOffset: 0,
            deltaPercentage: 0,
            columnSizingStart,
            isResizingColumn: column.id,
          }));
        };
      }

      previousClientWidth = -Infinity;
      elIntersectionObserver: IntersectionObserver;
      protected elResizeObserver = new ResizeObserver(() =>
        this.updateColumnSizingWhenResize()
      );

      updateColumnSizingWhenResize = () => {
        if (this.previousClientWidth !== this.clientWidth) {
          this.previousClientWidth = this.clientWidth;
          this.initializeColumnSizing(this.clientWidth);
          this.requestUpdate();
        }
      };

      connectedCallback(): void {
        super.connectedCallback();
        this.elResizeObserver.observe(this);

        this.elIntersectionObserver = new IntersectionObserver(entries => {
          const ratio = entries[0].intersectionRatio;
          if (ratio > 0) {
            requestAnimationFrame(() => {
              this.updateColumnSizingWhenResize();
            });
          } else {
            this.previousClientWidth = -Infinity;
          }
        });
        this.elIntersectionObserver.observe(this);
      }
      disconnectedCallback(): void {
        super.disconnectedCallback();
        this.elResizeObserver.disconnect();
        this.elIntersectionObserver.disconnect();
        this.previousClientWidth = -Infinity;
      }

      resetSizeHandler(header: Header<unknown, unknown>) {
        const column = this.table.getColumn(header.column.id);

        if (column) {
          const columnSizingStart: [string, number][] = header
            ? header
                .getLeafHeaders()
                .map(d => [d.column.id, d.column.getSize()])
            : [[column.id, column.getSize()]];

          const allColumnIds: Set<string> = new Set();

          columnSizingStart.forEach(([colId]) => {
            allColumnIds.add(colId);
            if (this.columnResizeStrategy === ColumnResizeStrategy.fixed) {
              const { nextColumn } = column.getAdjacentColumns();
              if (nextColumn?.id) {
                allColumnIds.add(nextColumn.id);
              }
            }
          });

          this.table.setColumnSizing(old => {
            const res: Record<string, number> = {};
            for (const key in old) {
              if (!allColumnIds.has(key)) {
                res[key] = old[key];
              }
            }
            return res;
          });
        }
      }
    }
    return Mixin;
  }
);
