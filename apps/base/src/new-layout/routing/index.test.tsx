import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { NewLayoutRoutingComponent } from './index';

const mockIsSingleViewRequest = jest.fn();

jest.mock('../../pages/Home/common/singleView', () => ({
  isSingleViewRequest: () => mockIsSingleViewRequest(),
}));
jest.mock('../../routing/common/useController', () => ({
  __esModule: true,
  default: () => ({
    store: {},
    handleCloseErrorMessage: jest.fn(),
    isReady: true,
  }),
}));
jest.mock('../../routing/common/style', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
  classes: { root: 'routing-root' },
  PREFIX: 'routing',
}));
jest.mock('../../components/Loader/PageLoader', () => ({
  __esModule: true,
  default: () => <div>Page loader</div>,
}));
jest.mock('../../components/Snackbar', () => ({
  __esModule: true,
  default: () => <div>Snackbar</div>,
}));
jest.mock('../components/Splash', () => ({
  __esModule: true,
  default: () => <div>New layout splash</div>,
}));
jest.mock('../../pages/Login', () => ({
  __esModule: true,
  default: () => <div>Legacy login</div>,
}));
jest.mock('../../pages/SingleView', () => ({
  __esModule: true,
  default: () => <div>Shared single view</div>,
}));
jest.mock('../pages/Home', () => ({
  __esModule: true,
  default: () => <div>New layout home</div>,
}));

const renderRoute = (token?: string, entities?: unknown[]) =>
  render(
    <Suspense fallback={<div>New layout splash</div>}>
      {NewLayoutRoutingComponent(token, entities)}
    </Suspense>,
  );

describe('NewLayoutRoutingComponent', () => {
  beforeEach(() => {
    mockIsSingleViewRequest.mockReturnValue(false);
  });

  it('keeps the shared login route for unauthenticated users', () => {
    renderRoute(undefined, []);

    expect(screen.getByText('Legacy login')).toBeInTheDocument();
  });

  it('routes authenticated portal users to the new-layout Home', async () => {
    renderRoute('token', [{ id: 'entity' }]);

    expect(await screen.findByText('New layout home')).toBeInTheDocument();
  });

  it('preserves the shared single-view route', () => {
    mockIsSingleViewRequest.mockReturnValue(true);
    renderRoute('token', [{ id: 'entity' }]);

    expect(screen.getByText('Shared single view')).toBeInTheDocument();
  });
});
