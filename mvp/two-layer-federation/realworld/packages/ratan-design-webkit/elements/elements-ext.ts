import './sc-data-grid.js';
import './sc-dashboard-viewer.js';
import './sc-tour.js';
import './sc-rich-text-editor.js';
// Skip import for unit test
if (!(globalThis as { __TEST__?: boolean }).__TEST__) {
  const optionalRichTextElements = '@scdevkit/webkit-rte/elements';
  void import(optionalRichTextElements).catch(() => {
    // The proprietary editor extension is optional; the core element catalog
    // remains available in open-source and Portal-host builds.
  });
}
