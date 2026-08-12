import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import * as Provider from '../hooks/provider';
import useDispatcher from '../hooks/dispathcer';
import Config from '../theme/Config';
import getDarkTheme from '../theme/config/dark';
import NewTile from './NewTile';
import Switch from './Switch';
import Drawer from './Drawer';
import Empty from './Empty';
import Avatar from './Avatar';
import Profile from './Profile';
import Splash from './Splash';
import NewLayoutAvatar from '../new-layout/components/Avatar';
import NewLayoutEmpty from '../new-layout/components/Empty';
import NewLayoutProfile from '../new-layout/components/Profile';
import NewLayoutSplash from '../new-layout/components/Splash';

jest.mock('../hooks/provider', () => ({ useContext: jest.fn() }));
jest.mock('../hooks/dispathcer', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../analytics', () => ({ __esModule: true, default: () => ({ ButtonEvent: jest.fn() }) }));
jest.mock('./ErrorBoundry', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));

const mockLogout = jest.fn();
jest.mock('../services', () => ({ __esModule: true, default: () => ({ logout: mockLogout }) }));

const mockUseContext = Provider.useContext as jest.Mock;
const mockUseDispatcher = useDispatcher as jest.Mock;
const legacyTheme = Config(getDarkTheme()).config;

const renderLegacy = (component: React.ReactElement) => {
  window.history.pushState({}, '', '/');
  return render(<ThemeProvider theme={legacyTheme}>{component}</ThemeProvider>);
};

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

const researchTile = {
  ...tile,
  title: 'Analytics',
  subtitle: 'Research',
  description: 'Explore market signals and research activity.',
  module: '/Analytics',
  tile: '/analytics',
};

beforeEach(() => {
  window.history.pushState({}, '', '/?new-layout=true');
  jest.clearAllMocks();
  window.localStorage.clear();
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
      theme: 'dark',
      rootVersion: '1.2.3',
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
  it('preserves the original MUI avatar and account menu without the new layout flag', () => {
    renderLegacy(<Avatar setOpen={jest.fn()} />);

    const avatarButton = screen.getByTestId(/_avatar_IconButton$/);
    expect(avatarButton.querySelector('.MuiAvatar-root')).toBeInTheDocument();
    fireEvent.click(avatarButton);

    expect(screen.getByText('Click to view user profile details')).toBeInTheDocument();
    expect(screen.getByText('Root Config Version: 1.2.3')).toBeInTheDocument();
    expect(screen.getByText(/Base Container Version:/)).toBeInTheDocument();
  });

  it('preserves the original New Tile and theme controls without the new layout flag', () => {
    renderLegacy(
      <>
        <NewTile toggleDrawer={jest.fn(() => jest.fn())} />
        <Switch />
      </>,
    );

    const newTile = screen.getByTestId(/_new_tile$/);
    expect(newTile.tagName).toBe('SECTION');
    expect(newTile).toHaveTextContent('New Tile');
    expect(newTile.querySelector('[data-testid="SearchIcon"]')).toBeInTheDocument();

    const themeSwitch = screen.getByTestId(/_switch$/);
    expect(themeSwitch.querySelector('.MuiSvgIcon-root')).toBeInTheDocument();
    expect(themeSwitch.querySelector('.custom-switch')).not.toBeInTheDocument();
  });

  it('preserves the original MUI tile drawer and tile cards without the new layout flag', async () => {
    renderLegacy(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={jest.fn()}
        drawers={[{ id: 1, label: 'Operations', tiles: [tile] }]}
      />,
    );

    expect(document.querySelector('.MuiDrawer-root')).toBeInTheDocument();
    expect(screen.getByText('Tile Options')).toBeInTheDocument();
    expect(await screen.findByTestId(/_menuItem$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('preserves the original profile dialog without the new layout flag', () => {
    renderLegacy(<Profile open onClose={jest.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Login time:')).toBeInTheDocument();
    expect(screen.getByText('Session Expired time:')).toBeInTheDocument();
    expect(screen.getByText('Functional User Profile')).toBeInTheDocument();
  });

  it('keeps the legacy tile surface outside the new layout flag', () => {
    renderLegacy(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={jest.fn()}
        drawers={[{ id: 1, label: 'Operations', tiles: [tile] }]}
      />,
    );

    expect(document.querySelector('.MuiDrawer-root')).toBeInTheDocument();
    expect(screen.getByText('Tile Options')).toBeInTheDocument();
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
    expect(screen.getByRole('navigation', { name: 'Tile categories' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Favorites' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Most used' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sort Z to A' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(addTile).toHaveBeenCalledWith(expect.objectContaining({ title: 'Cashflow Liquidity' }));
  });

  it('persists favorites and filters the Tile Library views', () => {
    render(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={jest.fn()}
        drawers={[
          { id: 1, label: 'Operations', tiles: [tile] },
          { id: 2, label: 'Research', tiles: [researchTile] },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add Cashflow to favorites' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Favorites' }));

    expect(screen.getByText('Cashflow')).toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    expect(window.localStorage.getItem('base.tile-library.favorites')).toContain('/cashflow');
  });

  it('sorts tiles and keeps the All category rail synchronized with content', () => {
    render(
      <Drawer
        anchor
        toggleDrawer={jest.fn(() => jest.fn())}
        addTile={jest.fn()}
        drawers={[
          { id: 1, label: 'Operations', tiles: [tile] },
          { id: 2, label: 'Research', tiles: [researchTile] },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sort Z to A' }));
    expect(screen.getByRole('button', { name: 'Sort A to Z' })).toBeInTheDocument();

    const researchSection = screen.getByTestId('tile-category-Research');
    const results = screen.getByTestId('tile-library-results');
    Object.defineProperty(researchSection, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ top: 1, bottom: 200, left: 0, right: 0, width: 0, height: 199, x: 0, y: 1, toJSON: () => ({}) }),
    });
    Object.defineProperties(results, {
      scrollTop: { configurable: true, value: 200 },
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 400 },
    });
    fireEvent.scroll(results);
    expect(screen.getByRole('button', { name: 'Research category' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows account details and timezone controls in the profile modal', () => {
    render(<NewLayoutProfile open onClose={jest.fn()} />);

    expect(screen.getByRole('dialog', { name: 'User profile' })).toBeInTheDocument();
    expect(screen.getByText('BANK001')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(document.querySelector('sc-badge[label="Trader"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Local' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UTC' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByText('Signed in')).not.toBeInTheDocument();
  });

  it('logs out from profile details without opening the legacy confirmation', () => {
    const setOpen = jest.fn();
    render(<NewLayoutAvatar setOpen={setOpen} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open user profile' }));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).not.toHaveBeenCalled();
    expect(screen.queryByText('Leave Now?')).not.toBeInTheDocument();
  });

  it('provides actionable empty and loading workspace states', () => {
    render(<NewLayoutEmpty />);
    expect(screen.getByText('Build your workspace')).toBeInTheDocument();
    expect(screen.getByText('Workspace ready')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Browse Tile Library' }));
    const latestDispatcher = mockUseDispatcher.mock.results.at(-1)?.value;
    expect(latestDispatcher.dispacthDrawer).toHaveBeenCalledWith(true);

    render(<NewLayoutSplash />);
    expect(screen.getByRole('status')).toHaveTextContent('Please wait...');
  });
});
