import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  GenerativeUIProvider,
  useGenerativeUI,
  RegisteredComponent,
  DEFAULT_GENERATIVE_COMPONENTS,
} from '../common/GenerativeUI';

// Test component to access the registry
const TestComponent = () => {
  const { registry, getComponent } = useGenerativeUI();
  const hasCard = registry.has('Card');

  return (
    <div>
      <span data-testid="has-card">{hasCard.toString()}</span>
      <span data-testid="component-exists">{getComponent('Card') ? 'yes' : 'no'}</span>
    </div>
  );
};

describe('GenerativeUI', () => {
  it('provides component registry context', () => {
    render(
      <GenerativeUIProvider>
        <TestComponent />
      </GenerativeUIProvider>,
    );

    expect(screen.getByTestId('has-card')).toHaveTextContent('false');
    expect(screen.getByTestId('component-exists')).toHaveTextContent('no');
  });

  it('registers initial components', () => {
    const CardComponent = ({ props }: { props: Record<string, unknown> }) => (
      <div>Card: {props.title as string}</div>
    );

    render(
      <GenerativeUIProvider initialComponents={[{ name: 'Card', component: CardComponent }]}>
        <TestComponent />
      </GenerativeUIProvider>,
    );

    expect(screen.getByTestId('has-card')).toHaveTextContent('true');
    expect(screen.getByTestId('component-exists')).toHaveTextContent('yes');
  });

  it('renders registered component', () => {
    const CardComponent = ({ props }: { props: Record<string, unknown> }) => (
      <div data-testid="card-content">Card: {props.title as string}</div>
    );

    render(
      <GenerativeUIProvider initialComponents={[{ name: 'Card', component: CardComponent }]}>
        <RegisteredComponent name="Card" props={{ title: 'Test Card' }} />
      </GenerativeUIProvider>,
    );

    expect(screen.getByTestId('card-content')).toHaveTextContent('Test Card');
  });

  it('shows fallback for unknown components', () => {
    render(
      <GenerativeUIProvider>
        <RegisteredComponent name="Unknown" props={{}} />
      </GenerativeUIProvider>,
    );

    expect(screen.getByText(/Unknown component: Unknown/)).toBeInTheDocument();
  });

  it('renders execution plan status with neutral structural copy', () => {
    render(
      <GenerativeUIProvider initialComponents={DEFAULT_GENERATIVE_COMPONENTS}>
        <RegisteredComponent
          name="ExecutionPlanStatus"
          props={{
            kind: 'plan',
            status: 'running',
            summary: 'Backend plan summary',
            planId: 'plan-1',
            totalSteps: 2,
          }}
        />
      </GenerativeUIProvider>,
    );

    expect(screen.getByText('Execution plan')).toBeInTheDocument();
    expect(screen.getByText('Backend plan summary')).toBeInTheDocument();
    expect(screen.queryByText('Governed plan')).not.toBeInTheDocument();
  });

  it('renders usage statistics card totals and trend labels', () => {
    render(
      <GenerativeUIProvider initialComponents={DEFAULT_GENERATIVE_COMPONENTS}>
        <RegisteredComponent
          name="UsageStatisticsCard"
          props={{
            appLabel: 'cashflow',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
            pv: 120,
            uv: 30,
            trendPoints: [
              { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
              { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
            ],
          }}
        />
      </GenerativeUIProvider>,
    );

    expect(screen.getByText('cashflow')).toBeInTheDocument();
    expect(screen.getByText('PV')).toBeInTheDocument();
    expect(screen.getByText('UV')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('PV Trend')).toBeInTheDocument();
    expect(screen.getByText('UV Trend')).toBeInTheDocument();
  });

  it('adapts usage statistics card surfaces for dark theme', () => {
    render(
      <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
        <GenerativeUIProvider initialComponents={DEFAULT_GENERATIVE_COMPONENTS}>
          <RegisteredComponent
            name="UsageStatisticsCard"
            props={{
              appLabel: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 120,
              uv: 30,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
              ],
            }}
          />
        </GenerativeUIProvider>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('usage-statistics-card')).toBeInTheDocument();
    expect(screen.getByTestId('usage-statistics-pv-tile')).toBeInTheDocument();
    expect(screen.getByTestId('usage-statistics-uv-tile')).toBeInTheDocument();
  });
});
