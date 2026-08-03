import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';

import type { ScDateInputSurface } from '../../../../src/components/ScDatePicker/DateInputSurface/ScDateInputSurface';
import { scDateInputSurfaceName } from '../../../../src/components/ScDatePicker/DateInputSurface/constants.js';

describe(scDateInputSurfaceName, () => {
  const elementSelectors = {
    surfaceContainer: '.surface-container',
  } as const;

  it('renders', async () => {
    const el = await fixture<ScDateInputSurface>(
      html`<sc-date-input-surface>
        <h1 class=test>Test</h1>
      </sc-date-input-surface>`
    );
    const surfaceContainer = el.query(elementSelectors.surfaceContainer);
    surfaceContainer?.click();
    expect(surfaceContainer).toBeInTheDocument();
  });
});