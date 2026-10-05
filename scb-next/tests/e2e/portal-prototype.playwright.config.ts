import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import existingConfig from '../../playwright.config';
import { referenceViewport } from '../fixtures/portal-prototype';

export default defineConfig({
  ...existingConfig,
  testDir: fileURLToPath(new URL('./', import.meta.url)),
  testMatch: 'portal-prototype.capture.spec.ts',
  workers: 1,
  timeout: 60_000,
  updateSnapshots: 'none',
  // Expected images are regenerated from the supplied source PNGs only, outside the repository.
  snapshotPathTemplate: join(tmpdir(), 'portal-prototype-source-references', '{arg}{ext}'),
  use: {
    ...existingConfig.use,
    viewport: referenceViewport,
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'Asia/Singapore',
  },
});
