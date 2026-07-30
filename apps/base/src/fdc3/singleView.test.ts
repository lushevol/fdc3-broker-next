import type { Container } from '../hooks/model/workspaces';
import { isSingleViewTarget } from './singleView';

const target: Container = {
  id: 'tile-1',
  container: '@fm/tile',
  module: '/module',
  tile: '/tile',
  title: 'Tile',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('single-view FDC3 policy', () => {
  it('allows only the selected tile instance as an internal target', () => {
    expect(isSingleViewTarget({ appId: 'tile', instanceId: 'tile-1' }, target, 'tile')).toBe(true);
    expect(isSingleViewTarget({ appId: 'tile', instanceId: 'tile-2' }, target, 'tile')).toBe(false);
    expect(isSingleViewTarget({ appId: 'other-tile' }, target, 'tile')).toBe(false);
  });
});
