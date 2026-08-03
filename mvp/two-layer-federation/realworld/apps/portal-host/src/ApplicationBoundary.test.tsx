import { render, screen } from '@testing-library/react';
import { ApplicationBoundary } from './ApplicationBoundary';

function Broken(): never { throw new Error('render exploded'); }

it('contains application render errors', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  render(<ApplicationBoundary applicationName="Cashflow" resetKey="one"><Broken /></ApplicationBoundary>);
  expect(screen.getByRole('alert')).toHaveProperty('title', 'Cashflow failed:');
  expect(screen.getByRole('alert')).toHaveTextContent('render exploded');
  expect(error).toHaveBeenCalled();
  error.mockRestore();
});

it('resets a contained error when the application attempt changes', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const view = render(<ApplicationBoundary applicationName="Cashflow" resetKey="one"><Broken /></ApplicationBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('render exploded');
  view.rerender(<ApplicationBoundary applicationName="Cashflow" resetKey="two"><span>Recovered remote</span></ApplicationBoundary>);
  expect(screen.getByText('Recovered remote')).toBeInTheDocument();
  error.mockRestore();
});
