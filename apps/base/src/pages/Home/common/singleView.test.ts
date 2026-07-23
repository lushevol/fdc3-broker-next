import type { Container } from '../../../hooks/model/workspaces';
import {
  buildSingleViewUrl,
  cleanExpiredSingleViewHandoffs,
  getSingleViewHandoff,
  launchSingleView,
  SingleViewLaunchError,
} from './singleView';

const container: Container = {
  id: 'tile-1',
  container: '@fm/tile',
  module: '/module',
  tile: '/tile',
  title: 'Tile',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('single view handoffs', () => {
  beforeEach(() => window.localStorage.clear());

  it('opens a browser popup and retains a valid handoff for the target page', async () => {
    const openWindow = jest.fn(() => ({ focus: jest.fn() })) as unknown as Window['open'];

    await expect(
      launchSingleView(container, { createId: () => 'handoff-1', openWindow }),
    ).resolves.toBe('handoff-1');

    expect(openWindow).toHaveBeenCalledWith(
      buildSingleViewUrl('handoff-1'),
      '_blank',
      expect.stringContaining('width=1200'),
    );
    expect(getSingleViewHandoff('handoff-1')).toMatchObject({ container });
  });

  it('uses an OpenFin platform window when available', async () => {
    const createWindow = jest.fn().mockResolvedValue({});

    await launchSingleView(container, {
      createId: () => 'openfin-1',
      getPlatform: () => ({ createWindow }),
    });

    expect(createWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'mfe-base-single-view-openfin-1',
        defaultWidth: 1200,
        defaultHeight: 800,
        customData: { singleViewHandoff: expect.objectContaining({ container }) },
      }),
    );
  });

  it('removes the pending handoff when popup creation fails', async () => {
    await expect(
      launchSingleView(container, { createId: () => 'blocked', openWindow: () => null }),
    ).rejects.toBeInstanceOf(SingleViewLaunchError);

    expect(getSingleViewHandoff('blocked')).toBeNull();
  });

  it('removes expired and malformed handoffs', () => {
    window.localStorage.setItem(
      'mfe-base:single-view:expired',
      JSON.stringify({ version: 1, expiresAt: 10, container }),
    );
    window.localStorage.setItem('mfe-base:single-view:broken', 'not-json');

    cleanExpiredSingleViewHandoffs(window.localStorage, 11);

    expect(window.localStorage.getItem('mfe-base:single-view:expired')).toBeNull();
    expect(window.localStorage.getItem('mfe-base:single-view:broken')).toBeNull();
  });
});
