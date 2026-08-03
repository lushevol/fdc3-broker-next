import { act } from '@testing-library/react';
import { manifest, mount, unmount } from './positions';

it('mounts the independent Positions Tile into its supplied Shadow Root', () => {
  const root = document.createElement('div').attachShadow({ mode: 'open' });
  const telemetry = jest.fn();
  const fdc3 = { raise: jest.fn() };
  act(() => mount({ tileId: 'positions', instanceId: 'positions-1', root, capabilities: { close: jest.fn(), telemetry: { track: telemetry }, fdc3 } }));
  expect(manifest).toEqual({ tileId: 'positions', contractVersion: '0.1' });
  expect(root.textContent).toContain('Positions');
  const button = root.querySelector('button') as HTMLButtonElement;
  act(() => button.click());
  expect(telemetry).toHaveBeenCalledWith('positions.fdc3.broadcast');
  expect(fdc3.raise).toHaveBeenCalledWith('ViewChart', expect.objectContaining({ type: 'fdc3.instrument' }));
  act(() => unmount('positions-1'));
  expect(root.textContent).toBe('');
});
