import { render, screen } from '@testing-library/react';
import CashFlowCN from './CashFlowCN';
import { ReactRouterDom } from '../import';

const { MemoryRouter } = ReactRouterDom;

describe('Cashflow remote appearance forwarding', () => {
  it('passes the resolved Ratan appearance to the nested Cashflow MFE', async () => {
    render(
      <MemoryRouter>
        <CashFlowCN
          module="/cashflow_blotter_cn"
          tile="/cashflow_cn"
          appearance={{ mode: 'dark', designGeneration: 'webkit' }}
        />
      </MemoryRouter>,
    );

    const remote = await screen.findByTestId('remote-cashflow');
    expect(remote).toHaveAttribute('data-mode', 'dark');
    expect(remote).toHaveAttribute('data-generation', 'webkit');
  });
});
