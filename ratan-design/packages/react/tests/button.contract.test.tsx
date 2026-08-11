import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import {
  BUTTON_SIZES,
  BUTTON_TONES,
  BUTTON_VARIANTS,
  Button,
} from '../src/button';

describe('Button parity contract', () => {
  it('uses the observed WebKit defaults and safe native form type', () => {
    render(<Button>Confirm</Button>);

    const button = screen.getByRole('button', { name: 'Confirm' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.dataset.variant).toBe('primary');
    expect(button.dataset.tone).toBe('default');
    expect(button.dataset.size).toBe('sm');
    expect(button.dataset.pill).toBe('true');
    expect(button.dataset.border).toBe('true');
  });

  it.each(['primary', 'secondary', 'text', 'link'] as const)(
    'supports the %s variant',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant }).dataset.variant).toBe(variant);
    },
  );

  it.each(['default', 'error', 'alert', 'success'] as const)(
    'supports the %s tone',
    (tone) => {
      render(<Button tone={tone}>{tone}</Button>);
      expect(screen.getByRole('button', { name: tone }).dataset.tone).toBe(tone);
    },
  );

  it.each(['xxs', 'xs', 'sm', 'md', 'lg'] as const)(
    'supports the %s size',
    (size) => {
      render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole('button', { name: size }).dataset.size).toBe(size);
    },
  );

  it('supports one-shot and toggle selection without mutating controlled state', () => {
    const onSelectedChange = vi.fn();
    const { rerender } = render(
      <Button selectable="toggle" onSelectedChange={onSelectedChange}>
        Toggle
      </Button>,
    );
    const uncontrolled = screen.getByRole('button', { name: 'Toggle' });

    fireEvent.click(uncontrolled);
    expect(uncontrolled.getAttribute('aria-pressed')).toBe('true');
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(uncontrolled);
    expect(uncontrolled.getAttribute('aria-pressed')).toBe('false');
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);

    rerender(
      <Button
        selectable="toggle"
        selected
        onSelectedChange={onSelectedChange}
      >
        Toggle
      </Button>,
    );
    fireEvent.click(uncontrolled);
    expect(uncontrolled.getAttribute('aria-pressed')).toBe('true');
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);
  });

  it('blocks loading and disabled activation while preserving loading focusability', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.dataset.pending).toBe('true');
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('announces a localized loading label without changing the accessible name', () => {
    const { rerender } = render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    button.focus();

    rerender(
      <Button loading loadingLabel="Enregistrement en cours">
        Save
      </Button>,
    );

    expect(button).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Save' })).toBe(button);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Enregistrement en cours',
    );

    rerender(<Button loading>Save</Button>);
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('participates in native submit and reset behavior', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <input aria-label="Account" defaultValue="initial" />
        <Button>Safe default</Button>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Account' });

    await user.click(screen.getByRole('button', { name: 'Safe default' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledOnce();

    await user.clear(input);
    await user.type(input, 'changed');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(input).toHaveValue('initial');
  });

  it('matches the frozen parity manifest variants, tones, sizes, and defaults', () => {
    const contract = parityManifest.components.find(
      (component) => component.legacy.tag === 'sc-button',
    )?.contract;

    expect(contract).toBeDefined();
    expect(contract?.variants).toEqual([...BUTTON_VARIANTS]);
    expect(contract?.tones).toEqual([...BUTTON_TONES]);
    expect(contract?.sizes).toEqual([...BUTTON_SIZES]);
    expect(contract?.defaults).toEqual({
      variant: 'primary',
      tone: 'default',
      size: 'sm',
      pill: true,
      border: true,
    });
  });

  it('passes automated accessibility checks', async () => {
    const { container } = render(
      <div>
        <Button>Default</Button>
        <Button selectable selected>
          Selected
        </Button>
        <Button loading loadingLabel="Saving">
          Save
        </Button>
      </div>,
    );

    await expect(
      assertNoAxeViolations({ context: container }),
    ).resolves.toBeDefined();
  });

  it('renders composition points and forwards its native ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} startIcon={<span>Start</span>} endIcon={<span>End</span>}>
        Label
      </Button>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Label' }));
    expect(screen.getByText('Start').parentElement?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByText('End').parentElement?.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses React Aria press semantics for keyboard activation', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Keyboard action</Button>);

    await user.tab();
    const button = screen.getByRole('button', { name: 'Keyboard action' });
    expect(button).toHaveFocus();
    expect(button.dataset.focusVisible).toBe('true');

    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledOnce();
  });
});
