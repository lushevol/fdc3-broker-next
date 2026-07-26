import React from 'react';
import { render, screen } from '@testing-library/react';
import SingleView from './index';

jest.mock('../Home/common/Container', () => () => (
  <div data-testid="tile-content">Tile content</div>
));
jest.mock('../Home/common/singleView', () => ({
  SINGLE_VIEW_QUERY_PARAM: 'singleView',
  findSingleViewTile: jest.fn(() => ({
    container: '@fm/tile',
    module: '/module',
    tile: '/tile',
    title: 'Tile',
    emailSupport: 'support@example.com',
  })),
  createSingleViewContainer: jest.fn((tile) => ({
    ...tile,
    id: 'tile',
    panelId: 'single-view-tile',
    tabId: 'single-view-tile',
  })),
}));
jest.mock('../../hooks/provider', () => ({
  useContext: () => [{ drawers: [] }],
}));

describe('SingleView', () => {
  beforeEach(() => window.history.replaceState({}, '', '/?singleView=handoff-1'));

  it('renders only the requested tile container', () => {
    render(<SingleView />);

    expect(screen.getByTestId('single-view')).toContainElement(screen.getByTestId('tile-content'));
    expect(screen.queryByText('AppBar')).not.toBeInTheDocument();
  });
});
