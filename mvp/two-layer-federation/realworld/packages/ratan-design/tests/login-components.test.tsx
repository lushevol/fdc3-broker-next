import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  DesignSystemProvider,
  Divider,
  FieldGroup,
  Form,
  Link,
  PasswordField,
  Tabs,
} from '../src';

const appearance = {
  scheme: 'dark',
  density: 'comfortable',
  direction: 'ltr',
} as const;

function PasswordHarness() {
  const [value, setValue] = useState('');
  return (
    <PasswordField
      id="password"
      label="Password"
      value={value}
      onChange={setValue}
      placeholder="Enter password"
    />
  );
}

describe('login design-system components', () => {
  it('submits a semantic form and field group with the entered password', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <DesignSystemProvider appearance={appearance}>
        <Form onSubmit={onSubmit}>
          <FieldGroup title="Credentials" description="Use your portal account.">
            <PasswordHarness />
          </FieldGroup>
          <button type="submit">Continue</button>
        </Form>
      </DesignSystemProvider>,
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    await user.type(input, 'correct horse');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('correct horse');
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('provides linked tabs with keyboard selection and matching panels', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <DesignSystemProvider appearance={appearance}>
        <Tabs
          ariaLabel="Sign-in methods"
          tabs={[
            { id: 'credentials', label: 'Credentials', content: <p>Password panel</p> },
            { id: 'sso', label: 'Single sign-on', content: <p>SSO panel</p> },
          ]}
          onSelectionChange={onSelectionChange}
        />
      </DesignSystemProvider>,
    );

    const credentials = screen.getByRole('tab', { name: 'Credentials' });
    credentials.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Single sign-on' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('SSO panel')).toBeVisible();
    expect(onSelectionChange).toHaveBeenCalledWith('sso');
  });

  it('renders divider and link with native semantics', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Divider />
        <Link href="/sso" variant="button">Continue with SSO</Link>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue with SSO' })).toHaveAttribute(
      'href',
      '/sso',
    );
  });

  it('supports an untitled field group and password guidance states', () => {
    const { container, rerender } = render(
      <DesignSystemProvider appearance={appearance}>
        <FieldGroup><span>Only field</span></FieldGroup>
        <PasswordField
          id="guided-password"
          label="Password"
          value=""
          onChange={vi.fn()}
          helperText="Use at least 12 characters."
          revealLabel="Reveal secret"
          hideLabel="Mask secret"
        />
      </DesignSystemProvider>,
    );
    expect(
      container.querySelector('[data-ratan-component="field-group"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('Use at least 12 characters.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reveal secret' })).toBeInTheDocument();

    rerender(
      <DesignSystemProvider appearance={appearance}>
        <PasswordField
          id="invalid-password"
          label="Password"
          value=""
          onChange={vi.fn()}
          helperText="Password is required."
          error
        />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });
});
