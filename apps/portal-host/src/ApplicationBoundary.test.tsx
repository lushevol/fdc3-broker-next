import { render, screen } from '@testing-library/react';
import { ApplicationBoundary } from './ApplicationBoundary';

function Broken(): never { throw new Error('render exploded'); }

it('contains application render errors', () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  render(<ApplicationBoundary applicationName="Cashflow" resetKey="one"><Broken /></ApplicationBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('Cashflow failed: render exploded');
  expect(error).toHaveBeenCalled();
  error.mockRestore();
});
