import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Container from './Container';
import type { Container as ContainerProps } from '../../../hooks/model/workspaces';

interface Appearance {
  mode: 'light' | 'dark';
  designGeneration: 'legacy' | 'webkit';
}
interface RemoteProps {
  module: string;
  tile: string;
  parameters: Record<string, unknown>;
  panelId: string;
  tabId: string;
  appearance: Appearance;
}
let mockStore = { theme: 'light', newStyles: true };

jest.mock('../../../hooks/provider', () => ({
  useContext: () => [mockStore, jest.fn()],
}));
jest.mock('../../../components/Splash', () => ({ __esModule: true, default: () => null }));
jest.mock('../../../components/ErrorBoundry', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../../../admin', () => ({ __esModule: true, default: () => null }));

const baseProps: ContainerProps = {
  id: 'container-id',
  container: '@fm/a-custom-business-container',
  module: '/custom-module',
  tile: '/custom-tile',
  title: 'Custom business tile',
  emailSupport: 'support@example.test',
  panelId: 'panel-id',
  tabId: 'tab-id',
  parameters: { queryId: 'saved-query' },
};
const makeRemote = (name: string) => function Remote(props: RemoteProps) {
  return <output data-testid={name}>{JSON.stringify(props)}</output>;
};
const readRemote = (name: string): RemoteProps => JSON.parse(screen.getByTestId(name).textContent ?? '{}');

describe('SystemJS remote appearance contract', () => {
  const originalImport = System.import;
  const mockImport = jest.fn(async (name: string) => ({ default: makeRemote(name) }));

  beforeEach(() => {
    mockStore = { theme: 'light', newStyles: true };
    mockImport.mockClear();
    System.import = mockImport as typeof System.import;
  });
  afterAll(() => {
    System.import = originalImport;
  });

  it('loads an arbitrary import-map name and preserves tile props alongside explicit appearance', async () => {
    render(<Container {...baseProps} />);
    await screen.findByTestId(baseProps.container);
    expect(mockImport).toHaveBeenCalledWith(baseProps.container);
    expect(readRemote(baseProps.container)).toEqual({
      module: baseProps.module,
      tile: baseProps.tile,
      parameters: baseProps.parameters,
      panelId: baseProps.panelId,
      tabId: baseProps.tabId,
      appearance: { mode: 'light', designGeneration: 'webkit' },
    });
  });

  it('forwards a live host Legacy/dark selection to the independently mounted remote', async () => {
    const { rerender } = render(<Container {...baseProps} />);
    await screen.findByTestId(baseProps.container);
    mockStore = { theme: 'dark', newStyles: false };
    rerender(<Container {...baseProps} title="Host appearance updated" />);
    await waitFor(() => {
      expect(readRemote(baseProps.container).appearance).toEqual({
        mode: 'dark',
        designGeneration: 'legacy',
      });
    });
    expect(mockImport).toHaveBeenCalledTimes(1);
  });

  it('uses a changed import-map name rather than retaining the previously loaded remote', async () => {
    const { rerender } = render(<Container {...baseProps} />);
    await screen.findByTestId(baseProps.container);
    const nextContainer = '@fm/another-customer-import-map-entry';
    rerender(<Container {...baseProps} container={nextContainer} parameters={undefined} />);
    await screen.findByTestId(nextContainer);
    expect(mockImport).toHaveBeenCalledWith(nextContainer);
    expect(readRemote(nextContainer).parameters).toEqual({});
    expect(readRemote(nextContainer).appearance).toEqual({ mode: 'light', designGeneration: 'webkit' });
  });

  it('keeps the built-in Base admin route local and does not call System.import', async () => {
    render(<Container {...baseProps} container="@fm/base" />);
    await waitFor(() => expect(mockImport).not.toHaveBeenCalled());
  });
});
