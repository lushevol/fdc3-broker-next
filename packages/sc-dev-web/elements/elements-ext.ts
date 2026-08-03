import './sc-data-grid.js';
import './sc-dashboard-viewer.js';
import './sc-tour.js';
import './sc-rich-text-editor.js';
// Skip import for unit test
if (!(globalThis as { __TEST__?: boolean }).__TEST__) {
  // @ts-ignore
  // eslint-disable-next-line import/extensions
  void import('@scdevkit/webkit-rte/elements');
}