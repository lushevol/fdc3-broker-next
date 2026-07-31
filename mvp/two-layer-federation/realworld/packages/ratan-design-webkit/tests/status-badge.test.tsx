import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { defineScBadge, ScBadge, StatusBadge } from '../src';

describe('WebKit StatusBadge adapter', () => {
  it('renders the promoted badge with the established status contract', async () => {
    const { container } = render(
      <StatusBadge status="ready" aria-label="Application state">
        Available
      </StatusBadge>,
    );

    const badge = container.querySelector('sc-badge') as ScBadge;
    await badge.updateComplete;

    expect(customElements.get('sc-badge')).toBe(ScBadge);
    expect(screen.getByLabelText('Application state')).toHaveAttribute('data-status', 'ready');
    expect(badge).toHaveProperty('type', 'text');
    expect(badge).toHaveProperty('color', 'green');
    expect(badge).toHaveProperty('label', 'Available');
    expect(badge.shadowRoot?.textContent).toContain('Available');
  });

  it.each([
    ['review', 'amber'],
    ['blocked', 'red'],
    ['neutral', 'grey'],
  ] as const)('maps %s status to the %s WebKit color', (status, color) => {
    const { container } = render(<StatusBadge status={status}>{status}</StatusBadge>);

    expect(container.querySelector('sc-badge')).toHaveProperty('color', color);
  });

  it('retains the established renderer for non-text children', () => {
    const { container } = render(
      <StatusBadge>
        <strong>Structured state</strong>
      </StatusBadge>,
    );

    expect(container.querySelector('sc-badge')).not.toBeInTheDocument();
    expect(screen.getByText('Structured state')).toBeInTheDocument();
  });

  it('registers safely across independent application reloads', () => {
    const define = vi.fn();
    const registry = {
      define,
      get: vi.fn(() => undefined),
    } as unknown as CustomElementRegistry;

    defineScBadge(registry);
    defineScBadge(null);
    defineScBadge(customElements);

    expect(define).toHaveBeenCalledWith('sc-badge', ScBadge);
    expect(customElements.get('sc-badge')).toBe(ScBadge);
  });
});
