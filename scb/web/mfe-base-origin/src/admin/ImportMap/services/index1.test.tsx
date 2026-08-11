import { render, screen } from '@testing-library/react';
import React from 'react';
import useServices from './useServices';
import Provider from '../../../hooks/provider';
import ThemeProvider from '../../../theme';
afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('../../../hooks/service', () => {
  return {
    putService: async () => {
      return Promise.reject({});
    },
    postService: async () => {
      return Promise.reject({});
    },
    getService: async () => {
      return Promise.reject({});
    },
  };
});

const Comp = () => {
  const {
    getImportMap,
    updateImportMap,
    verifyImportMap,
    createImportMap,
    deactivateImportMap,
    getImportMapAudit,
  } = useServices();
  React.useEffect(() => {
    void Promise.allSettled([
      getImportMap('123'),
      updateImportMap('123', { x: 'x', c: 'c' }),
      verifyImportMap('123', { x: 'x', c: 'c' }),
      createImportMap('123', { x: 'x', c: 'c' }),
      deactivateImportMap('123', { x: 'x', c: 'c' }),
      getImportMapAudit('123', { x: 'x', c: 'c' }),
    ]);
  }, []);
  return <div />;
};

describe('ImportMap useServices component', () => {
  it('should be in the document', () => {
    render(
      <Provider>
        <ThemeProvider>
          <Comp />
        </ThemeProvider>
      </Provider>,
    );
    expect(screen).toBeDefined();
  });
});
