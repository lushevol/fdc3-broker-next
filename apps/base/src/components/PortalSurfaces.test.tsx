import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import * as Provider from '../hooks/provider';
import useDispatcher from '../hooks/dispathcer';
import Drawer from './Drawer';
import Empty from './Empty';
import Profile from './Profile';
import Splash from './Splash';

jest.mock('../hooks/provider', () => ({ useContext: jest.fn() }));
jest.mock('../hooks/dispathcer', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../analytics', () => ({ __esModule: true, default: () => ({ ButtonEvent: jest.fn() }) }));
jest.mock('./ErrorBoundry', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));

const mockUseContext = Provider.useContext as jest.Mock;
const mockUseDispatcher = useDispatcher as jest.Mock;

const tile = {
  title: 'Cashflow',
  subtitle: 'Liquidity',
  description: 'Monitor intraday liquidity and funding exposure.',
  imageDarkTheme: '/cashflow.svg',
  imageLightTheme: '/cashflow.svg',
  disabled: false,
  container: '@fm/cashflow',
  module: '/Cashflow',
  tile: '/cashflow',
  emailSupport: 'support@example.com',
};

beforeEach(() => {
  window.history.pushState({}, '', '/?new-layout=true');
  jest.clearAllMocks();
  mockUseContext.mockReturnValue([
    {
      user: {
        fullName: 'Ada Lovelace',
        userId: 'AL001',
        oud: { userId: 'BANK001', emailId: 'ada@example.com', country: 'SG' },
        auth_time: 1_700_000_000,
      },
      expiredIn: 1_700_003_600,
      timeType: 'utc',
      entities: [{ id: 1, name: 'Operations', roleName: 'Trader', subjects: [] }],
    },
    jest.fn(),
  ]);
  mockUseDispatcher.mockReturnValue({
    dispacthDrawer: jest.fn(),
    dispacthLoading: jest.fn(),
    dispacthTimeType: jest.fn(),
  });
});

afterEach(() => {
  window.history.pushState({}, '', '/');
});

describe('Base WebKit portal surfaces', () => {
  it('keeps the legacy tile surface outside the new layout flag', () => {
    window.history.pushState({}, '', '/');
    render(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={jest.fn()}
        drawers={[{ id: 1, label: 'Operations', tiles: [tile] }]}
      />,
    );

    expect(screen.getByRole('complementary', { name: 'Tile Options' })).toBeInTheDocument();
    expect(document.querySelector('sc-modal')).not.toBeInTheDocument();
  });

  it('opens the Tile Library and adds a matching application', () => {
    const addTile = jest.fn();
    render(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={addTile}
        drawers={[{ id: 1, label: 'Operations', tiles: [tile] }]}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Tile Library' })).toBeInTheDocument();
    expect(screen.getByText('Monitor intraday liquidity and funding exposure.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(addTile).toHaveBeenCalledWith(expect.objectContaining({ title: 'Cashflow Liquidity' }));
  });

  it('shows account details and timezone controls in the profile modal', () => {
    render(<Profile open onClose={jest.fn()} />);

    expect(screen.getByRole('dialog', { name: 'User profile' })).toBeInTheDocument();
    expect(screen.getByText('BANK001')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(document.querySelector('sc-badge[label="Trader"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Local time' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UTC' })).toBeInTheDocument();
  });

  it('provides actionable empty and loading workspace states', () => {
    render(<Empty />);
    expect(screen.getByText('Your workspace is empty')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Browse Tile Library' }));
    const latestDispatcher = mockUseDispatcher.mock.results.at(-1)?.value;
    expect(latestDispatcher.dispacthDrawer).toHaveBeenCalledWith(true);

    render(<Splash />);
    expect(screen.getByRole('status')).toHaveTextContent('Please wait...');
  });
});
