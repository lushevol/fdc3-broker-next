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
    jest.spyOn(ReactRouterDom, "useResolvedPath").mockImplementation(()=>{
      return {
        pathname: "test"
      }
    })
    jest.spyOn(ReactRouterDom, "useNavigate").mockImplementation(()=>{
      return () => {}
    })
    jest.mock('../../Root/hooks/provider', () => ({
        useContext: jest.fn(() => [
          {
            refreshState: 1,
          } as RootModel,
          jest.fn() as React.Dispatch<IAction>,
        ]),
      }));



    const children = <div>Mock Children</div>;
    render(<PageContainer>{children}</PageContainer>);

    expect(screen.getByText('Mock Children')).toBeInTheDocument();
    expect(screen.queryByText('loading...')).not.toBeInTheDocument();
  });

  it('renders Loading component when loading', async () => {
    jest.mock('../../Root/hooks/provider', () => ({
      useContext: jest.fn(() => ({
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