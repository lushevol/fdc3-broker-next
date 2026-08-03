import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  DesignSystemProvider,
  EmptyState,
  ErrorState,
  IconButton,
  ProgressCircle,
  Switch,
  Toast,
  ToggleButton,
} from '../src';

const appearance = {
  scheme: 'light',
  density: 'compact',
  direction: 'ltr',
} as const;

function Controls() {
  const [enabled, setEnabled] = useState(false);
  const [selected, setSelected] = useState(false);
  return (
    <>
      <Switch label="Live updates" selected={enabled} onChange={setEnabled} />
      <ToggleButton selected={selected} onChange={setSelected}>
        Compact mode
      </ToggleButton>
    </>
  );
}

describe('shell design-system components', () => {
  it('supports accessible switch and toggle selection', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider appearance={appearance}>
        <Controls />
      </DesignSystemProvider>,
    );
    const switchControl = screen.getByRole('switch', { name: 'Live updates' });
    const toggle = screen.getByRole('button', { name: 'Compact mode' });
    expect(switchControl).not.toBeChecked();
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(switchControl);
    await user.click(toggle);
    expect(switchControl).toBeChecked();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders deterministic and indeterminate progress semantics', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <ProgressCircle label="Loading workspace" />
        <ProgressCircle label="Import progress" value={40} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('progressbar', { name: 'Loading workspace' }))
      .not.toHaveAttribute('aria-valuenow');
    expect(screen.getByRole('progressbar', { name: 'Import progress' }))
      .toHaveAttribute('aria-valuenow', '40');
  });

  it('renders empty, error, icon-action, and toast feedback states', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const dismiss = vi.fn();
    render(
      <DesignSystemProvider appearance={appearance}>
        <EmptyState
          title="No applications open"
          description="Choose one from the launcher."
          icon="+"
          action={<Button>Open launcher</Button>}
        />
        <ErrorState
          title="Registry unavailable"
          message="The registry could not be loaded."
          action={<Button onClick={retry}>Retry</Button>}
        />
        <IconButton label="Close tab" icon="×" />
        <Toast message="Cashflow ready" tone="success" onDismiss={dismiss} />
        <Toast message="Read-only notice" />
        <Toast message="Failed" tone="error" />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('No applications open')).toBeInTheDocument();
    expect(screen.getByText('Registry unavailable').closest('[role="alert"]'))
      .toHaveTextContent('Registry unavailable');
    expect(screen.getByRole('button', { name: 'Close tab' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(dismiss).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('supports disabled switches and labelled toggle buttons', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Switch label="Locked" selected={false} onChange={vi.fn()} disabled name="locked" />
        <ToggleButton
          selected
          onChange={vi.fn()}
          disabled
          ariaLabel="Pinned mode"
        >
          Pin
        </ToggleButton>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('switch', { name: 'Locked' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pinned mode' })).toBeDisabled();
  });
});
