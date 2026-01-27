import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Button } from '../src/Button';

test('The button should render correctly', async () => {
  render(<Button>Demo Button</Button>);
  const button = screen.getByRole('button', { name: 'Demo Button' });
  expect(button).toBeInTheDocument();
});

test('The primary button should have correct styles', async () => {
  render(<Button>Primary Button</Button>);
  const button = screen.getByRole('button', { name: 'Primary Button' });
  expect(button).toHaveStyle({
    backgroundColor: '#0473ea',
    color: '#ffffff',
  });
});

test('The secondary button should have correct styles', async () => {
  render(<Button type="secondary">Secondary Button</Button>);
  const button = screen.getByRole('button', { name: 'Secondary Button' });
  expect(button).toHaveStyle({
    backgroundColor: '#f2f2f2',
    color: '#333333',
  });
});

test('The disabled button should not be clickable', async () => {
  render(<Button disabled>Disabled Button</Button>);
  const button = screen.getByRole('button', { name: 'Disabled Button' });
  expect(button).toBeDisabled();
});
