import React from 'react';
import { render, screen } from '@testing-library/react';
import { GenerativeUIProvider, useGenerativeUI, RegisteredComponent } from '../common/GenerativeUI';

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
});
