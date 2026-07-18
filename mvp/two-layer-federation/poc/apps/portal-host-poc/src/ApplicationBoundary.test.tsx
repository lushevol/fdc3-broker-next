import { render, screen } from '@testing-library/react';
import { ApplicationBoundary } from './ApplicationBoundary';

function Broken(): React.ReactElement {
  throw new Error('render exploded');
}

describe('ApplicationBoundary', () => {
  const originalError = console.error;
  beforeEach(() => { console.error = jest.fn(); });
  afterEach(() => { console.error = originalError; });

  it('renders healthy children', () => {
    render(<ApplicationBoundary applicationName="Cashflow" resetKey="one"><p>Healthy</p></ApplicationBoundary>);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('contains render failures and resets for a new key', () => {
    const view = render(
      <ApplicationBoundary applicationName="Cashflow" resetKey="one"><Broken /></ApplicationBoundary>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Cashflow failed while rendering');
    expect(screen.getByRole('alert')).toHaveTextContent('render exploded');
    expect(console.error).toHaveBeenCalled();
    view.rerender(
      <ApplicationBoundary applicationName="Cashflow" resetKey="two"><p>Recovered</p></ApplicationBoundary>,
    );
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
