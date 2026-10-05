import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ThemeProvider, createTheme } from 'ratan-design-origin/theme';
import { PrototypeDrawer, type PresentedTile } from './drawer-presentation';

const tile: PresentedTile = {
  id: 1,
  title: 'Cashflow Blotter',
  subtitle: '[FX & Equity]',
  container: '@fm/ratan_container',
  module: '/cashflow',
  tile: '/cashflow_cn',
  emailSupport: 'operations@example.test',
  imageDarkTheme: 'darkIcons/cashflow.svg',
  imageLightTheme: 'lightIcons/cashflow.svg',
  entity: ['ENTITLED_APPLICATION'],
  subject: 'READ',
  parameters: { currency: 'USD', region: 'default' },
};

function showDrawer(overrides: Partial<React.ComponentProps<typeof PrototypeDrawer>> = {}) {
  const props = {
    anchor: true,
    toggleDrawer: vi.fn(() => vi.fn()),
    addTile: vi.fn(),
    drawers: [{ id: 1, label: 'Settlement', tiles: [tile] }],
    mode: 'light' as const,
    ...overrides,
  };
  return { ...render(<ThemeProvider theme={createTheme()}><PrototypeDrawer {...props} /></ThemeProvider>), props };
}

describe('prototype tile drawer', () => {
  it.each(['light', 'dark'] as const)('uses four compact desktop columns with readable text roles in %s mode', (mode) => {
    showDrawer({ mode });
    const card = screen.getByTestId('portal-prototype-tile');
    expect(card).toHaveStyle({ minHeight: '125px' });
    expect(card.closest('.tile-grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    });
    expect(screen.getByRole('heading', { name: 'Settlement' })).toHaveStyle({
      fontSize: '16px', lineHeight: '24px',
    });
    expect(screen.getByText('Cashflow Blotter')).toHaveStyle({
      fontSize: '14px', lineHeight: '20px',
    });
    expect(screen.getByText('[FX & Equity]')).toHaveStyle({
      fontSize: '12px', lineHeight: '18px',
    });
  });
  it('shows real categories and launches a tile once from the keyboard-accessible card', () => {
    const { props } = showDrawer();
    const drawer = screen.getByRole('dialog', { name: 'Tile Option' });
    expect(within(drawer).getByRole('heading', { name: 'Settlement' })).toBeVisible();
    const card = within(drawer).getByRole('button', { name: 'Add Cashflow Blotter [FX & Equity]', exact: true });
    fireEvent.click(card);
    expect(props.addTile).toHaveBeenCalledTimes(1);
    expect(props.addTile).toHaveBeenCalledWith(expect.objectContaining({
      container: tile.container,
      module: tile.module,
      tile: tile.tile,
      title: 'Cashflow Blotter [FX & Equity]',
      emailSupport: tile.emailSupport,
      parameters: tile.parameters,
      leftPosition: 'calc(50% - 45px)',
      topPossition: '8px',
    }));
    expect(props.addTile.mock.calls[0][0].parameters).not.toBe(tile.parameters);
    expect(within(drawer).queryByRole('button', { name: /Global|Indonesia/ })).not.toBeInTheDocument();
  });

  it('shows only explicit location actions and passes their defined parameter and title overrides', () => {
    const presented: PresentedTile = { ...tile, presentation: {
      pattern: 'wave',
      launchOptions: [
        { id: 'global', label: 'Global', parameters: { region: 'global' } },
        { id: 'indonesia', label: 'Indonesia', title: 'Indonesia Cashflow', parameters: { region: 'ID', market: 'Jakarta' } },
      ],
    } };
    const { props } = showDrawer({ drawers: [{ id: 1, label: 'Settlement', tiles: [presented] }] });
    fireEvent.click(screen.getByRole('button', { name: 'Add Cashflow Blotter [FX & Equity] for Global' }));
    expect(props.addTile).toHaveBeenLastCalledWith(expect.objectContaining({
      title: 'Cashflow Blotter [FX & Equity]', parameters: { currency: 'USD', region: 'global' },
    }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Cashflow Blotter [FX & Equity] for Indonesia' }));
    expect(props.addTile).toHaveBeenLastCalledWith(expect.objectContaining({
      title: 'Indonesia Cashflow', parameters: { currency: 'USD', region: 'ID', market: 'Jakarta' },
    }));
    expect(props.addTile).toHaveBeenCalledTimes(2);
    expect(tile.parameters).toEqual({ currency: 'USD', region: 'default' });
  });

  it('keeps every launch action disabled for disabled tiles', () => {
    const { props } = showDrawer({ drawers: [{ id: 1, label: 'Settlement', tiles: [{
      ...tile, disabled: true, presentation: { launchOptions: [{ id: 'SG', label: 'Singapore', parameters: {} }] },
    }] }] });
    const card = screen.getByRole('button', { name: 'Add Cashflow Blotter [FX & Equity]', exact: true });
    const option = screen.getByRole('button', { name: /for Singapore$/ });
    expect(card).toBeDisabled();
    expect(option).toBeDisabled();
    fireEvent.click(card);
    fireEvent.click(option);
    expect(props.addTile).not.toHaveBeenCalled();
  });

  it('preserves omitted parameters, custom positions, empty subtitles and supplied image URLs', () => {
    const { props } = showDrawer({ mode: 'dark', drawers: [{ id: 1, label: 'Trade Processing', tiles: [{
      ...tile, subtitle: undefined, parameters: undefined, leftPosition: '10px', topPossition: '20px',
    }] }] });
    expect(screen.getByTestId('portal-prototype-drawer')).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('portal-prototype-tile-art')).toHaveAttribute('src', '/image/darkIcons/cashflow.svg');
    fireEvent.click(screen.getByRole('button', { name: 'Add Cashflow Blotter', exact: true }));
    expect(props.addTile).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cashflow Blotter ', parameters: undefined, leftPosition: '10px', topPossition: '20px',
    }));
  });

  it('uses explicit pattern metadata in both themes, and never invents artwork or locations from entity names', () => {
    const { rerender } = showDrawer({ drawers: [{ id: 1, label: 'Settlement', tiles: [{
      ...tile, imageDarkTheme: '', imageLightTheme: '', entity: ['Global', 'Indonesia'],
    }] }] });
    expect(screen.queryByTestId('portal-prototype-tile-art')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /for Global|for Indonesia/ })).not.toBeInTheDocument();
    rerender(<ThemeProvider theme={createTheme()}><PrototypeDrawer anchor mode="light" toggleDrawer={() => vi.fn()}
      addTile={vi.fn()} drawers={[{ id: 1, label: 'Settlement', tiles: ['chevron', 'wave', 'dots', 'rings'].map((pattern, index) => ({
        ...tile, id: index, presentation: { pattern: pattern as 'chevron' | 'wave' | 'dots' | 'rings' },
      })) }]} /></ThemeProvider>);
    expect(screen.getAllByTestId('portal-prototype-tile-art')).toHaveLength(4);
    expect(screen.getAllByTestId('portal-prototype-tile-art')[0]).toHaveAttribute('src', expect.stringContaining('tile-chevron-light.png'));
  });

  it('closes with the title control, Escape and outside click through the original close callback', () => {
    const close = vi.fn();
    const toggleDrawer = vi.fn(() => close);
    showDrawer({ toggleDrawer });
    fireEvent.click(screen.getByRole('button', { name: 'Close tile options', exact: true }));
    fireEvent.keyDown(window, { key: 'Escape' });
    fireEvent.click(screen.getByTestId('portal-prototype-drawer-backdrop'));
    expect(close).toHaveBeenCalledTimes(3);
    expect(toggleDrawer).toHaveBeenCalledWith(false);
  });

  it.each([
    ['cashflow.svg', '/cashflow.svg'],
    ['/assets/cashflow.svg', '/assets/cashflow.svg'],
    ['https://example.test/cashflow.svg', 'https://example.test/cashflow.svg'],
    ['http://example.test/cashflow.svg', 'http://example.test/cashflow.svg'],
    ['data:image/png;base64,AA==', 'data:image/png;base64,AA=='],
  ])('preserves the existing artwork route for %s', (source, expected) => {
    showDrawer({ mode: 'light', drawers: [{ id: 1, label: 'Settlement', tiles: [{
      ...tile, id: undefined, imageLightTheme: undefined, imageDarkTheme: source,
    }] }] });
    expect(screen.getByTestId('portal-prototype-tile-art')).toHaveAttribute('src', expected);
  });

  it('keeps explicit parameters when a launch option has no default parameters to merge', () => {
    const { props } = showDrawer({ drawers: [{ id: 1, label: 'Settlement', tiles: [{
      ...tile, parameters: undefined, presentation: { launchOptions: [{
        id: 'global', label: 'Global', parameters: { country: 'global' },
      }] },
    }] }] });
    fireEvent.click(screen.getByRole('button', { name: /for Global$/ }));
    expect(props.addTile).toHaveBeenCalledWith(expect.objectContaining({ parameters: { country: 'global' } }));
  });

  it('returns focus to New Tile when launching removes the original empty-workspace control', () => {
    const trigger = document.createElement('button');
    const fallback = document.createElement('button');
    fallback.setAttribute('aria-label', 'Open new tile');
    document.body.append(trigger, fallback);
    trigger.focus();
    const { rerender, props } = showDrawer();
    trigger.remove();
    rerender(<ThemeProvider theme={createTheme()}><PrototypeDrawer {...props} anchor={false} /></ThemeProvider>);
    expect(fallback).toHaveFocus();
    fallback.remove();
  });

  it('contains Tab focus among enabled drawer actions and returns it to the initiating control on close', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const { rerender, props } = showDrawer();
    const close = screen.getByRole('button', { name: 'Close tile options', exact: true });
    const card = screen.getByRole('button', { name: 'Add Cashflow Blotter [FX & Equity]', exact: true });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(card).toHaveFocus();
    fireEvent.keyDown(card, { key: 'Tab' });
    expect(close).toHaveFocus();
    expect(fireEvent.keyDown(close, { key: 'Tab' })).toBe(true);
    fireEvent.keyDown(close, { key: 'ArrowDown' });
    expect(close).toHaveFocus();
    rerender(<ThemeProvider theme={createTheme()}><PrototypeDrawer {...props} anchor={false} /></ThemeProvider>);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('keeps empty categories and the close action reachable while closed drawers expose no actions', () => {
    const { rerender, props } = showDrawer({ drawers: [] });
    const close = screen.getByRole('button', { name: 'Close tile options', exact: true });
    fireEvent.keyDown(close, { key: 'Tab' });
    expect(close).toHaveFocus();
    expect(screen.queryByTestId('portal-prototype-tile')).not.toBeInTheDocument();
    rerender(<ThemeProvider theme={createTheme()}><PrototypeDrawer {...props} anchor={false} /></ThemeProvider>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
