import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { render, cleanup, screen } from '@testing-library/preact';

import { HomeContent } from '../../src/components/HomeContent';

afterEach(() => {
    cleanup()
});

describe('HomeContent', () => {
  test('should display title', () => {
    render(<HomeContent />);
    const contentTitle = screen.getByTestId('content-title');
    expect(contentTitle.textContent).toMatch(/What's next/);
  });
});