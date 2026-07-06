import React, { act } from 'react';
import { screen } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import InteropEditor from './InteropEditor';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

test('reports invalid JSON mode to the parent', () => {
  const onValidityChange = jest.fn();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <InteropEditor
        value={{ intents: { listensFor: [], raises: [] } }}
        onChange={jest.fn()}
        onValidityChange={onValidityChange}
        intents={[]}
        contexts={[]}
      />,
    );
  });

  act(() => {
    screen.getByLabelText('JSON Mode').dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  act(() => {
    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    )?.set;
    valueSetter?.call(textbox, '{');
    textbox.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(screen.getAllByText(/JSON/).length).toBeGreaterThan(1);
  expect(onValidityChange).toHaveBeenLastCalledWith(false);

  act(() => {
    root.unmount();
  });
  container.remove();
});
