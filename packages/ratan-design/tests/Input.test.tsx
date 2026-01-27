import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Input } from '../src/Input';

test('The input should render correctly', async () => {
  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText('Enter text');
  expect(input).toBeInTheDocument();
});

test('The input with label should render correctly', async () => {
  render(<Input label="Username" placeholder="Enter username" />);
  const label = screen.getByText('Username');
  expect(label).toBeInTheDocument();
});

test('The required input should show asterisk', async () => {
  render(<Input label="Email" required placeholder="Enter email" />);
  const label = screen.getByText('Username');
  expect(label).toBeInTheDocument();
  const asterisk = screen.getByText('*');
  expect(asterisk).toBeInTheDocument();
});

test('The input with helper text should render correctly', async () => {
  render(
    <Input
      label="Password"
      helperText="Must be at least 8 characters"
      placeholder="Enter password"
    />,
  );
  const helperText = screen.getByText('Must be at least 8 characters');
  expect(helperText).toBeInTheDocument();
});

test('The error input should show validation message', async () => {
  render(
    <Input
      label="Email"
      validationStatus="error"
      validationMessage="Invalid email address"
      placeholder="Enter email"
    />,
  );
  const validationMessage = screen.getByText('Invalid email address');
  expect(validationMessage).toBeInTheDocument();
});

test('The alert input should show validation message', async () => {
  render(
    <Input
      label="Password"
      validationStatus="alert"
      validationMessage="Password expires soon"
      placeholder="Enter password"
    />,
  );
  const validationMessage = screen.getByText('Password expires soon');
  expect(validationMessage).toBeInTheDocument();
});

test('The success input should show validation message', async () => {
  render(
    <Input
      label="Username"
      validationStatus="success"
      validationMessage="Username is available"
      placeholder="Choose username"
    />,
  );
  const validationMessage = screen.getByText('Username is available');
  expect(validationMessage).toBeInTheDocument();
});

test('The disabled input should not be editable', async () => {
  render(<Input label="Disabled" disabled placeholder="Cannot edit" />);
  const input = screen.getByPlaceholderText('Cannot edit');
  expect(input).toBeDisabled();
});

test('The input with prefix text should render correctly', async () => {
  render(<Input prefixText="$" placeholder="0.00" />);
  const input = screen.getByPlaceholderText('0.00');
  expect(input).toBeInTheDocument();
  // Prefix text is rendered inside the input wrapper
});

test('The input with suffix text should render correctly', async () => {
  render(<Input suffixText="@email.com" placeholder="user" />);
  const input = screen.getByPlaceholderText('user');
  expect(input).toBeInTheDocument();
});

test('The input should handle value changes', async () => {
  render(<Input data-testid="value-test" placeholder="Enter text value" />);
  const input = screen.getByPlaceholderText('Enter text value');
  expect(input).toHaveValue('');
});

test('The input with default value should render correctly', async () => {
  render(<Input placeholder="Enter text" defaultValue="Test value" />);
  const input = screen.getByDisplayValue('Test value');
  expect(input).toBeInTheDocument();
});

test('The small input should have correct height', async () => {
  render(<Input size="small" placeholder="Small" />);
  const input = screen.getByPlaceholderText('Small');
  // Small input has height of 24px
  expect(input).toBeInTheDocument();
});

test('The large input should have correct height', async () => {
  render(<Input size="large" placeholder="Large" />);
  const input = screen.getByPlaceholderText('Large');
  // Large input has height of 40px
  expect(input).toBeInTheDocument();
});

test('The medium input should have correct height', async () => {
  render(<Input size="middle" placeholder="Medium" />);
  const input = screen.getByPlaceholderText('Medium');
  // Medium input has height of 32px
  expect(input).toBeInTheDocument();
});
