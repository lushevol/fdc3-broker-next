import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PageContainer from './index';
import { ReactRouterDom } from "../../Root/import";


type RootModel = {
    refreshState: number;
  };
  
  type IAction = {
    type: string;
  };
describe('PageContainer', () => {
  it('renders children when not loading', async () => {
    vi.spyOn(ReactRouterDom, "useResolvedPath").mockImplementation(()=>{
      return {
        pathname: "test"
      }
    })
    vi.spyOn(ReactRouterDom, "useNavigate").mockImplementation(()=>{
      return () => {}
    })
    vi.mock('../../Root/hooks/provider', () => ({
        useContext: vi.fn(() => [
          {
            refreshState: 1,
          } as RootModel,
          vi.fn() as React.Dispatch<IAction>,
        ]),
      }));



    const children = <div>Mock Children</div>;
    render(<PageContainer>{children}</PageContainer>);

    expect(screen.getByText('Mock Children')).toBeInTheDocument();
    expect(screen.queryByText('loading...')).not.toBeInTheDocument();
  });

  it('renders Loading component when loading', async () => {
    vi.mock('../../Root/hooks/provider', () => ({
      useContext: vi.fn(() => ({
        refreshState: 0, // 触发 loading 状态
      })),
    }));

    const children = <div>Mock Children</div>;
    render(<PageContainer>{children}</PageContainer>);

    await act(async () => {
    });
    expect(screen.queryByText('Mock Children')).toBeInTheDocument();
    expect(screen.queryByText('API Status')).toBeInTheDocument();

  });
});