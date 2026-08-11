import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import { resetDocumentMode } from '../src/theme.js';

expect.extend(matchers);
afterEach(() => {
  cleanup();
  resetDocumentMode();
  window.location.hash = '';
});
