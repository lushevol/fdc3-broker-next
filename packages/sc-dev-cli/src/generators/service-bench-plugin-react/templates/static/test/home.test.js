import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { render, cleanup, screen } from '@testing-library/preact';

import { UserContext } from '@scdevkit/service-bench-core/react/context.js';

import { Home } from '../src/Home';

afterEach(() => {
    cleanup()
});

describe('Home', () => {
  test('should display title', () => {
    render(
        <UserContext.Provider value={{ firstName: 'test', lastName: 'user' }}>
            <Home />
        </UserContext.Provider>
    );
    const bannerTitle = screen.getByTestId('banner-title');
    expect(bannerTitle.textContent).toMatch(/Welcome to Service Bench, test user!/);
  });
});