import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PageContainer from './index';
import { ReactRouterDom } from "../../Root/import";

const { providerStore } = vi.hoisted(() => ({
  providerStore: { refreshState: 0 },
}));
vi.mock('../../Root/hooks/provider', () => ({
  useContext: vi.fn(() => [providerStore, vi.fn()]),
}));


type RootModel = {
    refreshState: number;
  };
  
  type IAction = {
    type: string;
  };
describe('PageContainer', () => {
  it('renders children when not loading', async () => {
    providerStore.refreshState = 0;
    vi.spyOn(ReactRouterDom, "useResolvedPath").mockImplementation(()=>{
      return {
        pathname: "test"
      }
    })
    vi.spyOn(ReactRouterDom, "useNavigate").mockImplementation(()=>{
      return () => {}
    })
    const children = <div>Mock Children</div>;
    render(<PageContainer>{children}</PageContainer>);

    expect(screen.getByText('Mock Children')).toBeInTheDocument();
    expect(screen.queryByText('loading...')).not.toBeInTheDocument();
  });

  it('renders Loading component when loading', async () => {
    providerStore.refreshState = 1;

    const children = <div>Mock Children</div>;
    render(<PageContainer>{children}</PageContainer>);

    expect(screen.queryByText('Mock Children')).not.toBeInTheDocument();
    expect(screen.getByText('loading...')).toBeInTheDocument();
    expect(screen.queryByText('API Status')).toBeInTheDocument();

  });
});
