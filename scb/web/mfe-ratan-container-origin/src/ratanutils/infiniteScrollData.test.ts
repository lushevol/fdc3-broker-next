import { waitFor } from '@testing-library/react';
import { onGridBodyScroll } from './infiniteScrollData';

test('onGridBodyScroll', async () => {
  const gridAction = jest.fn();
  const data = {
    params: {
      api: {
        addEventListener: jest.fn((name, callback) => {
          if (name === 'gridFetchedAllData') callback({ isGridFetchedAll: false });
          else if (name === 'gridFetchingData') callback({ isGridFetchingData: false });
          else if (name === 'bodyScroll') callback();
        }),
        showLoadingOverlay: jest.fn(),
        getLastDisplayedRow: jest.fn(() => 4),
        getDisplayedRowCount: jest.fn(() => 4),
        getVerticalPixelRange: jest.fn(() => {
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
