import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createComponent } from '../src/wrapper/ReactWrapper.js';

describe('ReactWrapper', () => {
  it('wraps registered components from the WebKit component catalog', () => {
    const Button = createComponent('sc-button');
    const Divider = createComponent('sc-divider');
    const Badge = createComponent('sc-badge');
    const Dialog = createComponent('sc-dialog');
    const onClick = vi.fn();
    const { container } = render(
      <>
        <Button type="primary" disabled onClick={onClick}>Open</Button>
        <Divider vertical />
        <Badge type="text" color="green" label="Available" />
        <Dialog label="New tile" open>Catalog</Dialog>
      </>,
    );

    const button = container.querySelector('sc-button');
    fireEvent.click(button as Element);

    expect(customElements.get('sc-button')).toBeTypeOf('function');
    expect(customElements.get('sc-divider')).toBeTypeOf('function');
    expect(customElements.get('sc-badge')).toBeTypeOf('function');
    expect(customElements.get('sc-dialog')).toBeTypeOf('function');
    expect(button).toHaveProperty('type', 'primary');
    expect(button).toHaveProperty('disabled', true);
    expect(onClick).toHaveBeenCalledOnce();
    expect(container.querySelector('sc-divider')).toHaveProperty('vertical', true);
    expect(container.querySelector('sc-badge')).toHaveProperty('label', 'Available');
    expect(container.querySelector('sc-dialog')).toHaveProperty('label', 'New tile');
  });

  it('maps WebKit custom events to React event properties', () => {
    const Input = createComponent('sc-text-input');
    const onScInput = vi.fn();
    const { container } = render(<Input onScInput={onScInput} />);
    const input = container.querySelector('sc-text-input') as Element;

    fireEvent(input, new CustomEvent('sc-input', { detail: { value: 'cashflow' } }));

    expect(onScInput).toHaveBeenCalledOnce();
  });

  it('fails clearly for an unregistered tag', () => {
    expect(() => createComponent('sc-not-a-component')).toThrow(
      'Web Component sc-not-a-component is not exported by the component catalog',
    );
  });
});
