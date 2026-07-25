/** @jest-environment jsdom */

import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from '@jest/globals';
import type { TileProps } from '../Root/routing/common/interface';
import { ModuleLoaderConsumerTile } from './ModuleLoaderConsumerTile';

const ProducerCard = ({ instrument }: { instrument: string }) => (
  <div data-testid="module-loader-producer-card">Producer summary: {instrument}</div>
);
const mockLoad = jest.fn(() => Promise.resolve({ Component: ProducerCard }));

jest.mock('../Root/import', () => ({
  FDC3Agent: {
    useFDC3: () => ({ modules: { load: mockLoad } }),
  },
}));

const props: TileProps = {
  id: 'module-loader-consumer-1',
  container: '@fm/template',
  module: '/module_loader_consumer',
  tile: '/module_loader_consumer',
  title: 'Module Loader Consumer',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
  tabId: 'tab-1',
};

describe('ModuleLoaderConsumerTile', () => {
  it('loads and renders the producer component through the FDC3 platform extension', async () => {
    render(<ModuleLoaderConsumerTile {...props} />);

    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'Load producer summary' }));
    });

    expect(mockLoad).toHaveBeenCalledWith({
      loader: 'systemjs',
      moduleId: '@fm/module-loader-producer',
      exportName: 'TradeSummaryCard',
    });
    expect((await screen.findByTestId('module-loader-producer-card')).textContent).toContain(
      'Producer summary: AAPL',
    );
  });
});
