import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const parityRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = JSON.parse(await readFile(path.join(parityRoot, 'evidence/proof-cohort/capture.json'), 'utf8'));
const performance = JSON.parse(await readFile(path.join(parityRoot, 'evidence/proof-cohort/performance.json'), 'utf8'));
assert.deepEqual(evidence.browsers.map(({ id }) => id), ['chrome', 'edge']);
assert.equal(evidence.summary.fixtures, 12);
assert.equal(evidence.summary.unexplainedScreenshotFailures, 0, `${evidence.summary.unexplainedScreenshotFailures} proof screenshots exceed 0.1% without an approved deviation.`);
assert.equal(evidence.summary.ratanAccessibilityViolations, 0, `${evidence.summary.ratanAccessibilityViolations} Ratan proof fixtures have Axe violations.`);
assert.ok(performance.synchronousMilliseconds.mountP95 < performance.synchronousMilliseconds.budgetP95, 'Mount p95 exceeds the synchronous budget.');
assert.ok(performance.synchronousMilliseconds.overlayOpenP95 < performance.synchronousMilliseconds.budgetP95, 'Overlay-open p95 exceeds the synchronous budget.');
assert.ok(performance.synchronousMilliseconds.unmountP95 < performance.synchronousMilliseconds.budgetP95, 'Unmount p95 exceeds the synchronous budget.');
assert.equal(performance.cleanup.passed, true, 'Proof mount/unmount cleanup leaked overlays, listeners, or observers.');
process.stdout.write('Verified proof-cohort screenshots, computed styles, accessibility, and deviation links.\n');
