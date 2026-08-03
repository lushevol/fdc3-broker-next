/**
 * Fixtures barrel — single import point for all spec files.
 *
 * Merges all fixture extensions into one combined `test` object.
 * Spec files should import from this file only.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/index.ts';
 */

import { mergeTests } from '@playwright/test';
import { test as withPageObjects } from './page-objects.fixture.ts';

export const test = mergeTests(withPageObjects);

export { expect } from '@playwright/test';
