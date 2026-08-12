import { waitFor } from '@testing-library/react';
import { onGridBodyScroll } from './infiniteScrollData';

test('onGridBodyScroll', async () => {
  const gridAction = vi.fn();
  const data = {
    params: {
      api: {
        addEventListener: vi.fn((name, callback) => {
          if (name === 'gridFetchedAllData') callback({ isGridFetchedAll: false });
          else if (name === 'gridFetchingData') callback({ isGridFetchingData: false });
          else if (name === 'bodyScroll') callback();
        }),
        showLoadingOverlay: vi.fn(),
        getLastDisplayedRow: vi.fn(() => 4),
        getDisplayedRowCount: vi.fn(() => 4),
        getVerticalPixelRange: vi.fn(() => {
          return {
            top: 1,
          };
        }),
      },
    },
    gridAction,
  };
  onGridBodyScroll(data);
  await waitFor(() => expect(gridAction).toBeCalled());
});
