import React from 'react';
import { render } from '@testing-library/react';
import NewLayoutHome from './index';

const capturedPresentations: Array<Record<string, unknown>> = [];

jest.mock('../../../pages/Home', () => ({
  __esModule: true,
  default: ({ presentation }: { presentation: Record<string, unknown> }) => {
    capturedPresentations.push(presentation);
    return <div>New layout home</div>;
  },
}));

jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({ palette: { mode: 'light' } }),
}));
jest.mock('../../components/AppBar', () => ({ __esModule: true, default: () => null }));
jest.mock('../../components/Empty', () => ({ __esModule: true, default: () => null }));
jest.mock('../../components/WorkspaceTab', () => ({ __esModule: true, default: () => null }));
jest.mock('./style', () => ({ __esModule: true, default: 'section' }));

describe('NewLayoutHome presentation boundary', () => {
  beforeEach(() => {
    capturedPresentations.length = 0;
  });

  it('supplies every new-layout visual surface from the centralized module', () => {
    render(<NewLayoutHome />);

    expect(capturedPresentations).toHaveLength(1);
    expect(capturedPresentations[0]).toMatchObject({
      tabsInHeader: true,
      showAddWorkspace: false,
    });
    expect(capturedPresentations[0]).toEqual(
      expect.objectContaining({
        AppBarComponent: expect.anything(),
        EmptyComponent: expect.anything(),
        RootComponent: expect.anything(),
        TabItemComponent: expect.anything(),
        headerStyle: expect.objectContaining({ display: 'flex', height: '96px' }),
      }),
    );
  });
});
