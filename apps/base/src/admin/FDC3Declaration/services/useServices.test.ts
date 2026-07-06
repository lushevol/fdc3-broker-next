import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { postService } from '../../../hooks/service';
import useServices from './useServices';

jest.mock('../../../hooks/service', () => ({
  postService: jest.fn(),
}));

jest.mock('../../../hooks/HooksBase', () => ({
  getHooksBase: () => ({ baseDispatch: jest.fn() }),
}));

const mockedPostService = postService as jest.Mock;
type Services = ReturnType<typeof useServices>;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const renderUseServices = () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  let services: Services | undefined;

  const TestComponent = () => {
    services = useServices();
    return null;
  };

  act(() => {
    root.render(React.createElement(TestComponent));
  });

  return {
    get current() {
      if (!services) {
        throw new Error('useServices did not render');
      }
      return services;
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
    },
  };
};

describe('FDC3Declaration services', () => {
  beforeEach(() => {
    mockedPostService.mockResolvedValue({ data: { data: [] } });
  });

  afterEach(() => {
    mockedPostService.mockReset();
  });

  test('loads declarations through the admin API', async () => {
    const result = renderUseServices();

    await act(async () => {
      await result.current.getDeclaration('token', {});
    });

    expect(mockedPostService).toHaveBeenCalledWith(
      '/auth/v1/fmo/admin/fdc3/data',
      { entitlementsToken: 'token' },
      expect.any(Object),
    );
    result.unmount();
  });

  test('creates intent through the admin API', async () => {
    const result = renderUseServices();

    await act(async () => {
      await result.current.createIntent('token', {
        name: 'ViewChart',
        description: 'View chart',
      });
    });

    expect(mockedPostService).toHaveBeenCalledWith('/auth/v1/fmo/admin/fdc3/intent/create', {
      entitlementsToken: 'token',
      name: 'ViewChart',
      description: 'View chart',
    });
    result.unmount();
  });
});
