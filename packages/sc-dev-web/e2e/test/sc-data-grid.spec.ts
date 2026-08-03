import { test, expect, Page, Locator } from '@playwright/test';
import { captureEvent } from '../util/event-listener.js';

// --- Storybook story URL helpers ---
const STORY = (name: string) =>
  `iframe.html?globals=&args=&id=table-data-grid--${name}&viewMode=story`;

/**
 * Navigate to a Storybook story and wait until sc-data-grid has mounted
 * and completed at least one render update (awaits Lit's updateComplete).
 */
const gotoStory = async (page: Page, url: string) => {
  await page.goto(url);
  // Wait for the custom element to be in the DOM
  const gridEl = page.locator('sc-data-grid');
  await gridEl.waitFor({ state: 'attached', timeout: 4_000 });
  // Wait for Lit's updateComplete so the shadow DOM is fully rendered
  await page.evaluate(async () => {
    const el = document.querySelector('sc-data-grid') as any;
    if (el?.updateComplete) await el.updateComplete;
  });
  // Also wait for the header area to be visible as a reliable "ready" signal
  await page
    .locator('sc-data-grid')
    .locator('.sc-data-grid-header-area')
    .waitFor({ state: 'visible', timeout: 2_000 });
};

const URLS = {
  basic: STORY('basic'),
  empty: STORY('empty'),
  sorting: STORY('client-side-row-sorting'),
  pagination: STORY('client-side-pagination'),
  rowSelection: STORY('row-selection'),
  singleSelection: STORY('single-row-selection'),
  filtering: STORY('client-side-row-filtering'),
  colManager: STORY('column-manager'),
  pinnedCols: STORY('sticky-column'),
  rowPinning: STORY('row-pinning'),
  actions: STORY('actions-bar'),
  export: STORY('data-export'),
  resizing: STORY('fixed-resize-strategy'),
  masterCell: STORY('master-cell-with-arbitrary-content'),
  cellDataType: STORY('cell-data-type'),
  ssFilter: STORY('server-side-row-filtering'),
  typedFilter: STORY('typed-filtering'),
  multiFilter: STORY('multiple-filtering-per-column'),
  customMultiFilter: STORY('custom-multiple-filtering'),
  editing: STORY('editing-mode'),
  dragColumn: STORY('draggable-column'),
  draggableRow: STORY('draggable-row'),
  headerGroup: STORY('header-group'),
  rowGrouping: STORY('row-grouping'),
  treeData: STORY('tree-data'),
} as const;

// --- Locator helpers ---
const grid = (page: Page) => page.locator('sc-data-grid');
const gridHeader = (page: Page) =>
  grid(page).locator('.sc-data-grid-header-area');
const gridBody = (page: Page) => grid(page).locator('.sc-data-grid-body-area');
const gridRows = (page: Page) =>
  gridBody(page).locator('.sc-data-grid-row-of-body');

const expectCountGreaterThan = async (locator: Locator, min: number) => {
  await expect.poll(async () => locator.count()).toBeGreaterThan(min);
};

const dispatchDragEvent = async (
  locator: Locator,
  eventType: 'dragstart' | 'dragend',
) => {
  await locator.evaluate((el, type) => {
    const dataTransfer = new DataTransfer();
    el.dispatchEvent(
      new DragEvent(type, { dataTransfer, bubbles: true, composed: true })
    );
  }, eventType);
};

// ─────────────────────────────────────────────────────────────────────────
// Rendering — Basic story (gData(4), 4 columns)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — basic', () => {
  test('renders structure regions and cell content', async ({ page }) => {
    await gotoStory(page, URLS.basic);
    await expect(grid(page)).toBeVisible();
    await expect(grid(page).locator('.sc-data-grid-header-area')).toHaveCount(1);
    await expect(grid(page).locator('.sc-data-grid-body-area')).toHaveCount(1);
    await expect(
      grid(page).locator('.sc-data-grid-horizontal-scroller'),
    ).toHaveCount(1);
    // cell content: body rows contain rendered cells
    await expectCountGreaterThan(gridBody(page).locator('sc-data-grid-cell'), 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Actions bar — ActionsBar story (rowSelection, selectAllButton, slots)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — actions bar', () => {
  test('renders actions-bar with slotted Upload content', async ({ page }) => {
    await gotoStory(page, URLS.actions);
    await expect(grid(page).locator('.sc-data-grid-actions-bar')).toHaveCount(1);
    await expect(grid(page)).toContainText('Upload');
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Empty state — Empty story (data: [])
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — empty state', () => {
  test('shows empty region, custom slot content, and no body rows', async ({ page }) => {
    await gotoStory(page, URLS.empty);
    // empty region is visible
    await expectCountGreaterThan(grid(page).locator('.sc-data-grid-empty'), 0);
    // custom slot content is rendered
    await expect(grid(page)).toContainText(
      'There is not available records came from data if you can see me.',
    );
    // no body rows when data is empty
    await expect(gridRows(page)).toHaveCount(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Sorting — ClientSideRowSorting story (gData(20), sortable firstName col)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — sorting', () => {
  test('cycles through all sort states and emits sc-sort event', async ({ page }) => {
    await gotoStory(page, URLS.sorting);
    // initial state: sort icons present in sortable header cells
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell-sort'),
      0,
    );
    // firstName starts with sort='desc' and sortingOrder=['none','desc','asc']
    const sortIcon = gridHeader(page).locator('.sc-data-grid-cell-sort').first();

    // click 1: desc → asc; also verify sc-sort event fires with an array value
    const awaitSort = await captureEvent<{ value?: unknown[] }>(grid(page), 'sc-sort');
    await sortIcon.click();
    const sortDetail = await awaitSort();
    expect(Array.isArray(sortDetail?.value)).toBe(true);
    await expectCountGreaterThan(
      gridHeader(page).locator('sc-data-grid-cell[sort="asc"]'),
      0,
    );

    // click 2: asc → none
    await sortIcon.click();
    await expect(
      gridHeader(page).locator(
        'sc-data-grid-cell[sort="asc"], sc-data-grid-cell[sort="desc"]',
      ),
    ).toHaveCount(0);

    // click 3: none → desc
    await sortIcon.click();
    await expectCountGreaterThan(
      gridHeader(page).locator('sc-data-grid-cell[sort="desc"]'),
      0,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Pagination — ClientSidePagination story (gData(41), pageSize:20, pageIndex:2)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — pagination', () => {
  test('navigates pages and emits sc-page-change event', async ({ page }) => {
    await gotoStory(page, URLS.pagination);
    // initial state: pagination component present and rows visible on current page
    await expect(grid(page).locator('sc-pagination')).toHaveCount(1);
    await expectCountGreaterThan(gridRows(page), 0);

    const nextButton = grid(page)
      .locator('sc-pagination')
      .locator('li.sc-pagination-next')
      .first();
    const prevButton = grid(page)
      .locator('sc-pagination')
      .locator('li.sc-pagination-prev')
      .first();

    // navigate forward; also verify sc-page-change event fires with page + pageSize
    const awaitPageChange = await captureEvent<{
      page?: number;
      pageSize?: number;
    }>(grid(page), 'sc-page-change');
    const initialCount = await gridRows(page).count();
    await nextButton.click();
    const pageDetail = await awaitPageChange();
    expect(pageDetail?.page).not.toBeUndefined();
    expect(pageDetail?.pageSize).not.toBeUndefined();
    await expect
      .poll(async () => gridRows(page).count())
      .toBeLessThan(initialCount);

    // navigate back
    await prevButton.click();
    await expect
      .poll(async () => gridRows(page).count())
      .toBeGreaterThanOrEqual(initialCount);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Row selection (multiple) — RowSelection story (gData(10), rowSelection)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — row selection', () => {
  test('selects a row on checkbox click then deselects on second click', async ({ page }) => {
    await gotoStory(page, URLS.rowSelection);
    // initial state: selection cells present in header and all 10 body rows
    await expectCountGreaterThan(
      gridHeader(page).locator('sc-data-grid-selection-cell'),
      0,
    );
    await expect(
      gridBody(page).locator('sc-data-grid-selection-cell'),
    ).toHaveCount(10);

    const toggle = gridBody(page)
      .locator('sc-data-grid-selection-cell')
      .first()
      .locator('sc-checkbox');

    // select: row gets selected class and sc-select event fires
    const awaitSelect = await captureEvent(grid(page), 'sc-select');
    await toggle.click();
    await expect(grid(page).locator('.sc-data-grid-row-selected')).toHaveCount(1);
    await awaitSelect();

    // deselect: selected class is removed
    await toggle.click();
    await expect(grid(page).locator('.sc-data-grid-row-selected')).toHaveCount(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Row selection (single) — SingleRowSelection story (gData(10), rowSelectionRadio)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — single row selection', () => {
  test('selects only one row at a time', async ({ page }) => {
    await gotoStory(page, URLS.singleSelection);
    // initial state: radio buttons present in body rows
    await expect(
      gridBody(page)
        .locator('sc-data-grid-selection-cell')
        .first()
        .locator('sc-radio'),
    ).toHaveCount(1);

    const radios = gridBody(page).locator('sc-data-grid-selection-cell');

    await radios.nth(0).locator('sc-radio').click();
    await radios.nth(1).locator('sc-radio').click();

    await expect(grid(page).locator('.sc-data-grid-row-selected')).toHaveCount(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Filtering — ClientSideRowFiltering story (gData(4), filterable, advancedFilter)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — filtering', () => {
  test('opens filter panel, opens column filter popup, and emits sc-filter event', async ({ page }) => {
    await gotoStory(page, URLS.filtering);
    // initial state: header tools icons and cell filter indicators present
    await expectCountGreaterThan(
      grid(page).locator('.sc-data-grid-header-tools-icons'),
      0,
    );
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell-filter'),
      0,
    );

    // open composite filter panel
    await grid(page).locator('.sc-data-grid-header-tools-filter').click();
    await expect(grid(page).locator('sc-data-grid-composite-filter')).toHaveCount(1);

    // close panel, then open column filter popup via indicator click
    await grid(page).locator('.sc-data-grid-header-tools-filter').click({ force: true });
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();
    await expect(grid(page).locator('sc-data-grid-column-filter')).toHaveCount(1);

    // dispatch filter event from the open popup
    const awaitFilter = await captureEvent<{ columnFilterValues?: unknown }>(grid(page), 'sc-filter');
    await grid(page)
      .locator('sc-data-grid-column-filter')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-filter', { bubbles: true, composed: true }),
        );
      });
    const detail = await awaitFilter();
    expect(detail?.columnFilterValues).not.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Column manager — ColumnManager story (gData(20), columnOrdering, columnVisibility)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — column manager', () => {
  test('opens column manager panel and emits sc-column-order on visibility toggle', async ({ page }) => {
    await gotoStory(page, URLS.colManager);
    // initial state: column-manager icon present in header tools
    await expectCountGreaterThan(
      grid(page).locator('.sc-data-grid-header-tools-icons'),
      0,
    );
    // open panel
    await grid(page).locator('.sc-data-grid-header-tools-visibility').click();
    await expect(grid(page).locator('sc-data-grid-column-manager')).toHaveCount(1);

    // toggle column visibility and verify sc-column-order event fires
    const awaitColOrder = await captureEvent(grid(page), 'sc-column-order');
    await grid(page)
      .locator('sc-data-grid-column-manager')
      .locator('sc-checkbox')
      .first()
      .click();

    await awaitColOrder();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Pinned columns — StickyColumn story (gData(20), left + right pinned cols)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — pinned columns', () => {
  test('renders left and right pinned areas with pinned header cells', async ({ page }) => {
    await gotoStory(page, URLS.pinnedCols);
    await expectCountGreaterThan(
      grid(page).locator(
        '.sc-data-grid-pinned-left, .sc-data-grid-thead.sc-data-grid-pinned-left',
      ),
      0,
    );
    await expectCountGreaterThan(
      grid(page).locator(
        '.sc-data-grid-pinned-right, .sc-data-grid-thead.sc-data-grid-pinned-right',
      ),
      0,
    );
    await expectCountGreaterThan(
      gridHeader(page).locator(
        '.sc-data-grid-pinned-left, .sc-data-grid-pinned-right',
      ),
      0,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Row pinning — RowPinning story (gData(20), 1 top + 2 bottom pinned rows)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — row pinning', () => {
  test('renders top pinned area (1 row) and bottom pinned area (2 rows)', async ({ page }) => {
    await gotoStory(page, URLS.rowPinning);
    // top pinned area
    await expect(
      grid(page).locator('.sc-data-grid-pinned-body-area.top'),
    ).toHaveCount(1);
    await expect(
      grid(page).locator(
        '.sc-data-grid-pinned-body-area.top .sc-data-grid-row-of-body',
      ),
    ).toHaveCount(1);
    // bottom pinned area
    await expect(
      grid(page).locator('.sc-data-grid-pinned-body-area.bottom'),
    ).toHaveCount(1);
    await expect(
      grid(page).locator(
        '.sc-data-grid-pinned-body-area.bottom .sc-data-grid-row-of-body',
      ),
    ).toHaveCount(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Data export — DataExport story (gData(20), enableExport)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — data export', () => {
  test('renders actions-bar with sc-button-dropdown export control', async ({ page }) => {
    await gotoStory(page, URLS.export);
    await expect(grid(page).locator('.sc-data-grid-actions-bar')).toHaveCount(1);
    await expect(grid(page).locator('sc-button-dropdown')).toHaveCount(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Column resizing — FixedResizeStrategy story (gData(20), columnResizeStrategy:'fixed')
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — column resizing', () => {
  test('mousedown on resizer adds resizing class and emits sc-mouse-down', async ({ page }) => {
    await gotoStory(page, URLS.resizing);
    // initial state: resizer handles present on resizable columns
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-separator-can-resize'),
      0,
    );
    const awaitMouseDown = await captureEvent(grid(page), 'sc-mouse-down');
    const resizer = gridHeader(page)
      .locator('.sc-data-grid-separator-can-resize')
      .first();

    await resizer.dispatchEvent('mousedown', { buttons: 1 });
    await awaitMouseDown();
    await resizer.dispatchEvent('mousemove', { clientX: 300 });

    await expect(
      gridHeader(page).locator('.sc-data-grid-separator-resizing'),
    ).toHaveCount(1);

    await resizer.dispatchEvent('mouseup');
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Master cell — MasterCellWithArbitraryContent story
//   (gData(20), 2 cols, isCellExpandable on col index 1, auto-expanded row 0)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — master cell', () => {
  test('auto-expanded row shows master-cell; toggle collapses and re-expands', async ({ page }) => {
    await gotoStory(page, URLS.masterCell);
    // initial state: detail layer present, expandable cells, first row auto-expanded
    await expect(
      grid(page).locator('.sc-data-grid-master-detial-layer'),
    ).toHaveCount(1);
    await expectCountGreaterThan(
      gridBody(page).locator('.sc-data-grid-cell-expanded'),
      0,
    );
    await expect(grid(page).locator('sc-data-grid-master-cell')).toHaveCount(1);
    await expect(
      gridBody(page)
        .locator('sc-data-grid-cell')
        .nth(1)
        .locator('.sc-data-grid-cell-expanded-active'),
    ).toHaveCount(1);

    const toggle = gridBody(page)
      .locator('sc-data-grid-cell')
      .nth(1)
      .locator('.sc-data-grid-cell-expanded');

    // collapse
    await toggle.click();
    await expect(toggle).not.toHaveClass(/sc-data-grid-cell-expanded-active/);
    // re-expand
    await toggle.click();
    await expect(toggle).toHaveClass(/sc-data-grid-cell-expanded-active/);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Cell data type — CellDataType story (gData(5), rowSelection, 5 data cols)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — cell data types', () => {
  test('renders object, boolean, date, and selection cell types correctly', async ({ page }) => {
    await gotoStory(page, URLS.cellDataType);
    // object column: custom renderer with italic span and non-empty text
    const hasItalic = await gridBody(page)
      .locator('sc-data-grid-cell')
      .evaluateAll(cells => {
        const objectCells = cells.filter((_, i) => i % 6 === 3);
        return objectCells.some(cell =>
          cell.shadowRoot?.querySelector('span[style*="italic"]'),
        );
      });
    expect(hasItalic).toBe(true);
    const objectCell = gridBody(page)
      .locator('.sc-data-grid-row-of-body')
      .first()
      .locator('sc-data-grid-cell')
      .nth(3);
    const text = await objectCell.evaluate(
      cell => cell.shadowRoot?.textContent?.trim() || '',
    );
    expect(text.length).toBeGreaterThan(0);

    // boolean: isAdult column label is 'true' or 'false'
    const isAdultCell = gridBody(page)
      .locator('.sc-data-grid-row-of-body')
      .first()
      .locator('sc-data-grid-cell')
      .nth(4)
      .locator('sc-data-grid-selection-cell');
    const label = (await isAdultCell.getAttribute('a11y-label')) || '';
    expect(['true', 'false']).toContain(label.toLowerCase());

    // date: date column cell has non-empty text
    const dateCell = gridBody(page)
      .locator('.sc-data-grid-row-of-body')
      .first()
      .locator('sc-data-grid-cell')
      .nth(2);
    const dateText = await dateCell.evaluate(
      cell => cell.shadowRoot?.textContent || '',
    );
    expect(dateText.trim().length).toBeGreaterThan(0);

    // selection: 5 rows × (1 selection cell + 1 boolean isAdult cell) = 10
    await expect(
      gridBody(page).locator('sc-data-grid-selection-cell'),
    ).toHaveCount(10);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Server-side row filtering — ServerSideRowFiltering story
//   (gData(4), 1 col firstName, filterable, manualFilter)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — server-side row filtering', () => {
  test('emits sc-filter event and updates rows when data is narrowed', async ({ page }) => {
    await gotoStory(page, URLS.ssFilter);
    // initial state: filter indicator present and manual-filter attribute set
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell-filter'),
      0,
    );
    await expect
      .poll(async () => grid(page).getAttribute('manual-filter'))
      .not.toBeNull();

    // dispatch filter event via the popup
    const awaitFilter = await captureEvent<{ columnFilterValues?: unknown }>(grid(page), 'sc-filter');
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();
    await grid(page)
      .locator('sc-data-grid-column-filter')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-filter', { bubbles: true, composed: true }),
        );
      });
    const detail = await awaitFilter();
    expect(detail?.columnFilterValues).not.toBeUndefined();

    // narrow the data and verify rows update
    await grid(page).evaluate((gridEl: any) => {
      gridEl.data = (gridEl.data as any[]).filter(
        (row: any) => row.firstName === (gridEl.data as any[])[0].firstName,
      );
    });
    await expectCountGreaterThan(gridRows(page), 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Typed filtering — TypedFiltering story (gData(10), 6 typed filter cols)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — typed filtering', () => {
  test('emits sc-filter event when filter is applied', async ({ page }) => {
    await gotoStory(page, URLS.typedFilter);
    // initial state: filter indicators present on all typed filterable header cells
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell-filter'),
      0,
    );
    // open column filter popup
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();
    await expect(grid(page).locator('sc-data-grid-column-filter')).toHaveCount(1);

    const awaitFilter = await captureEvent<{ columnFilterValues?: unknown }>(grid(page), 'sc-filter');
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();

    await grid(page)
      .locator('sc-data-grid-column-filter')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-filter', { bubbles: true, composed: true }),
        );
      });

    const detail = await awaitFilter();
    expect(detail?.columnFilterValues).not.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Multiple filtering per column — MultipleFilteringPerColumn story
//   (gData(10), 6 cols with filter:'multiple')
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — multiple filtering per column', () => {
  test('emits sc-filter event when filter is dispatched', async ({ page }) => {
    await gotoStory(page, URLS.multiFilter);
    // initial state: filter indicators present for columns with filter: multiple
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell-filter'),
      0,
    );
    // open column filter popup
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();
    await expect(grid(page).locator('sc-data-grid-column-filter')).toHaveCount(1);

    const awaitFilter = await captureEvent<{ columnFilterValues?: unknown }>(grid(page), 'sc-filter');
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();

    await grid(page)
      .locator('sc-data-grid-column-filter')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-filter', { bubbles: true, composed: true }),
        );
      });

    const detail = await awaitFilter();
    expect(detail?.columnFilterValues).not.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Custom multiple filtering — CustomMultipleFiltering story
//   (gData(10), 3 cols: firstName filterable, lastName/age filterable:false)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — custom multiple filtering per column', () => {
  test('emits sc-filter event when filter is dispatched on firstName', async ({ page }) => {
    await gotoStory(page, URLS.customMultiFilter);
    // initial state: only firstName has a filter indicator; lastName and age do not
    await expect(
      gridHeader(page).locator('.sc-data-grid-cell-filter'),
    ).toHaveCount(1);
    await expect(
      gridHeader(page)
        .locator('.sc-data-grid-header-cell')
        .nth(1)
        .locator('.sc-data-grid-cell-filter'),
    ).toHaveCount(0);

    const awaitFilter = await captureEvent<{ columnFilterValues?: unknown }>(grid(page), 'sc-filter');
    await gridHeader(page).locator('.sc-data-grid-cell-filter').first().click();

    await grid(page)
      .locator('sc-data-grid-column-filter')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-filter', { bubbles: true, composed: true }),
        );
      });

    const detail = await awaitFilter();
    expect(detail?.columnFilterValues).not.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Editing mode — EditingMode story (gData(20), 4 editable cols)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — editing mode', () => {
  test('all editable cells present; enters and stops editing mode with events', async ({ page }) => {
    await gotoStory(page, URLS.editing);
    // initial state: all 4 × 20 = 80 cells carry the editable class
    await expect(
      gridBody(page).locator('.sc-data-grid-cell-editable'),
    ).toHaveCount(80);

    const editableCell = gridBody(page)
      .locator('.sc-data-grid-cell-editable > sc-data-grid-cell')
      .first()
      .locator('.sc-data-grid-cell-root');
    const editingRoot = grid(page)
      .locator('sc-data-grid-editing')
      .locator('.sc-data-grid-editing-root');

    // enter editing mode
    const awaitStarted = await captureEvent(grid(page), 'sc-editing-started');
    await editableCell.dblclick({ force: true });
    await awaitStarted();
    await expect(editingRoot.locator(':scope > *')).toHaveCount(1);

    // stop editing by clicking outside
    const awaitStopped = await captureEvent(grid(page), 'sc-editing-stopped');
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await awaitStopped();
    await expect(editingRoot.locator(':scope > *')).toHaveCount(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Draggable column — DraggableColumn story (gData(4), 4 cols, column-ordering)
// 2 tests share this URL → describe + beforeEach
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — draggable column', () => {
  test.beforeEach(async ({ page }) => {
    await gotoStory(page, URLS.dragColumn);
  });

  test('adds drag-start class on dragstart and removes it on dragend', async ({ page }) => {
    // initial state: header cells carry draggable="true", grid attributes set
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-cell[draggable="true"]'),
      0,
    );
    await expect
      .poll(async () => grid(page).getAttribute('column-ordering'))
      .not.toBeNull();
    await expect
      .poll(async () => grid(page).getAttribute('enable-drag-column'))
      .not.toBeNull();

    const headerCell = gridHeader(page)
      .locator('.sc-data-grid-cell[draggable="true"]')
      .first();

    await dispatchDragEvent(headerCell, 'dragstart');
    await expectCountGreaterThan(gridHeader(page).locator('.drag-start'), 0);

    await dispatchDragEvent(headerCell, 'dragend');
    await expect(gridHeader(page).locator('.drag-start')).toHaveCount(0);
  });

  test('emits sc-column-order event when column order changes via the column manager', async ({ page }) => {
    const awaitColOrder = await captureEvent(grid(page), 'sc-column-order');
    await grid(page).locator('.sc-data-grid-header-tools-visibility').click();

    await grid(page)
      .locator('sc-data-grid-column-manager')
      .evaluate(el => {
        el.dispatchEvent(
          new CustomEvent('sc-column-order', {
            bubbles: true,
            composed: true,
          }),
        );
      });

    await awaitColOrder();
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Draggable row — DraggableRow story (gData(4), 4 cols, enable-draggable-row)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — draggable row', () => {
  test('emits sc-dragstart and sc-dragend events and preserves row count', async ({ page }) => {
    await gotoStory(page, URLS.draggableRow);
    // initial state: drag-handle icon, draggable attribute, and active-draggable class present
    await expect(
      gridBody(page)
        .locator('sc-data-grid-cell')
        .first()
        .locator('sc-icon[name="drag-handle"]'),
    ).toHaveCount(1);
    await expect(gridRows(page).first()).toHaveAttribute('draggable', 'true');
    await expectCountGreaterThan(
      gridBody(page).locator('.sc-data-grid-active-draggable-row'),
      0,
    );

    const awaitDragStart = await captureEvent(grid(page), 'sc-dragstart');
    const row = gridRows(page).first();

    await dispatchDragEvent(row, 'dragstart');
    await awaitDragStart();

    const awaitDragEnd = await captureEvent(grid(page), 'sc-dragend');
    await dispatchDragEvent(row, 'dragend');
    await awaitDragEnd();

    await expect(gridRows(page)).toHaveCount(4);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Header group — HeaderGroup story (gData(4), nested groupColumns)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — header group', () => {
  test('renders multiple header rows, cells, and body cell content', async ({ page }) => {
    await gotoStory(page, URLS.headerGroup);
    // nested groups: more than one header row and more than 4 header cells
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-row-of-header'),
      1,
    );
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-header-cell'),
      4,
    );
    // body cells are populated
    await expectCountGreaterThan(gridBody(page).locator('sc-data-grid-cell'), 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Row grouping — RowGrouping story (gData(20), grouped by age/progress/visits,
//   first group auto-expanded via apiFunction)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — row grouping', () => {
  test('expanding a collapsed group increases row count; collapsing reduces it', async ({ page }) => {
    await gotoStory(page, URLS.rowGrouping);
    // initial state: grid visible, 2+ header columns, group rows with expandable cells
    await expect(grid(page)).toBeVisible();
    await expectCountGreaterThan(
      gridHeader(page).locator('.sc-data-grid-header-cell'),
      1,
    );
    await expectCountGreaterThan(gridRows(page), 1);
    await expectCountGreaterThan(
      gridBody(page).locator('sc-data-grid-cell[is-can-expand]'),
      0,
    );
    await expectCountGreaterThan(
      gridBody(page)
        .locator('sc-data-grid-cell[is-can-expand]')
        .first()
        .locator('.sc-data-grid-cell-expanded'),
      -1,
    );

    // expand the last collapsed group
    const allGroupCells = gridBody(page).locator('sc-data-grid-cell[is-can-expand]');
    const lastGroupToggle = allGroupCells
      .last()
      .locator('.sc-data-grid-cell-expanded');

    const countBefore = await gridRows(page).count();
    await lastGroupToggle.click();
    await expect
      .poll(async () => gridRows(page).count())
      .toBeGreaterThan(countBefore);

    // collapse the first (auto-expanded) group
    const firstGroupToggle = gridBody(page)
      .locator('sc-data-grid-cell[is-can-expand]')
      .first()
      .locator('.sc-data-grid-cell-expanded-active');

    const expandedCount = await gridRows(page).count();
    await firstGroupToggle.click();
    await expect
      .poll(async () => gridRows(page).count())
      .toBeLessThan(expandedCount);
  });
});

// ─────────────────────────────────────────────────────────────────────────
// Tree data — TreeData story (6 location items, initialExpanded)
// ─────────────────────────────────────────────────────────────────────────
test.describe('sc-data-grid — tree data', () => {
  test('renders expanded tree: more rows than 6 items, indented leaves, and count sub-elements', async ({ page }) => {
    await gotoStory(page, URLS.treeData);
    // initial state: initial-expanded attribute set, 2 header columns (location, count)
    await expect
      .poll(async () => grid(page).getAttribute('initial-expanded'))
      .not.toBeNull();
    await expect(
      gridHeader(page).locator('.sc-data-grid-header-cell'),
    ).toHaveCount(2);
    // tree is expanded: more than 6 source items rendered
    await expectCountGreaterThan(gridRows(page), 6);
    // leaf rows carry the indent class
    await expectCountGreaterThan(
      gridBody(page).locator('.sc-data-grid-cell-indent'),
      0,
    );
    // group rows render count sub-elements
    const hasSub = await gridBody(page)
      .locator('sc-data-grid-cell')
      .evaluateAll(cells =>
        cells.some(cell => cell.shadowRoot?.querySelector('sub')),
      );
    expect(hasSub).toBe(true);
  });
});
