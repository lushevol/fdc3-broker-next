import React from 'react';
import { render, screen } from '@testing-library/react';
import SingleView from './index';

jest.mock('../Home/common/Container', () => () => <div data-testid="tile-content">Tile content</div>);
jest.mock('../Home/common/singleView', () => ({
  SINGLE_VIEW_QUERY_PARAM: 'singleView',
  getSingleViewHandoff: jest.fn(() => ({
    container: {
      id: 'tile-1',
      container: '@fm/tile',
      module: '/module',
      tile: '/tile',
      title: 'Tile',
      emailSupport: 'support@example.com',
      panelId: 'panel-1',
      tabId: 'tab-1',
    },
  })),
}));

describe('SingleView', () => {
  beforeEach(() => window.history.replaceState({}, '', '/?singleView=handoff-1'));

  it('renders only the requested tile container', () => {
    render(<SingleView />);

    expect(screen.getByTestId('single-view')).toContainElement(screen.getByTestId('tile-content'));
    expect(screen.queryByText('AppBar')).not.toBeInTheDocument();
  });
});
