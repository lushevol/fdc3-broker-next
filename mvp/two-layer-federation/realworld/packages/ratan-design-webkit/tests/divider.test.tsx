import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { defineScDivider, Divider, ScDivider } from '../src';

describe('WebKit Divider adapter', () => {
  it.each([
    ['horizontal', true],
    ['vertical', false],
  ] as const)('maps the %s contract to the WebKit divider', (orientation, vertical) => {
    const { container } = render(<Divider orientation={orientation} className="custom-divider" />);

    const divider = container.querySelector('sc-divider');
    expect(divider).toHaveClass('ratan-divider', 'custom-divider');
    expect(divider).toHaveAttribute('data-ratan-component', 'divider');
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-orientation', orientation);
    expect(divider).toHaveProperty('vertical', vertical);
  });

  it('registers safely across independent application reloads', () => {
    const define = vi.fn();
    const registry = {
      define,
      get: vi.fn(() => undefined),
    } as unknown as CustomElementRegistry;

    defineScDivider(registry);
    defineScDivider(null);
    defineScDivider(customElements);

    expect(define).toHaveBeenCalledWith('sc-divider', ScDivider);
    expect(customElements.get('sc-divider')).toBe(ScDivider);
  });
});
