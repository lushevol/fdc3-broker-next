import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, DesignSystemProvider } from '../src';

describe('Ratan WebKit public boundary', () => {
  it('marks the active WebKit layer while preserving appearance semantics', () => {
    const { container } = render(
      <DesignSystemProvider
        appearance={{ scheme: 'dark', density: 'compact', direction: 'rtl' }}
        scope="host"
      >
        <span>WebKit content</span>
      </DesignSystemProvider>,
    );

    const legacyRoot = container.querySelector('.ratan-design-root');
    const webkitRoot = container.querySelector('.ratan-webkit-root');

    expect(legacyRoot).toHaveAttribute('data-ratan-theme', 'dark');
    expect(legacyRoot).toHaveAttribute('data-ratan-density', 'compact');
    expect(legacyRoot).toHaveAttribute('dir', 'rtl');
    expect(webkitRoot).toHaveAttribute('data-design-system', 'ratan-webkit');
    expect(webkitRoot).toHaveAttribute('data-ratan-webkit-scope', 'host');
    expect(screen.getByText('WebKit content')).toBeInTheDocument();
  });

  it('keeps the established component contract available during migration', () => {
    render(<Button>Open workspace</Button>);

    expect(
      screen.getByRole('button', { name: 'Open workspace' }),
    ).toHaveAttribute('data-ratan-component', 'button');
  });
});
