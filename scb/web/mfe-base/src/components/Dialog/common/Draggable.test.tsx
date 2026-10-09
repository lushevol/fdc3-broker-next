import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Dialog from '..';
import Draggable from './Draggable';

afterEach(() => vi.restoreAllMocks());

function drag(target: HTMLElement, x: number, y: number) {
  fireEvent.mouseDown(target, { button: 0, clientX: 10, clientY: 10 });
  fireEvent.mouseMove(document, { buttons: 1, clientX: 10 + x, clientY: 10 + y });
  fireEvent.mouseUp(document, { button: 0, clientX: 10 + x, clientY: 10 + y });
}

describe('Base draggable dialog paper', () => {
  it('preserves the title handle, content cancellation, and Paper props without findDOMNode', () => {
    const findDOMNode = vi.spyOn(ReactDOM, 'findDOMNode');
    const onClick = vi.fn();
    render(
      <React.StrictMode>
        <Draggable
          idTitle="drag-title"
          data-testid="paper"
          className="caller-paper"
          aria-label="Settlement paper"
          style={{ padding: 12 }}
          onClick={onClick}
        >
          <div id="drag-title">
            <button>Move dialog</button>
            <div className="MuiDialogContent-root">
              <button>Edit content</button>
            </div>
          </div>
        </Draggable>
      </React.StrictMode>,
    );
    const paper = screen.getByTestId('paper');
    expect(paper).toHaveClass('caller-paper');
    expect(paper).toHaveAttribute('aria-label', 'Settlement paper');
    expect(paper).toHaveStyle({ padding: '12px' });
    drag(screen.getByRole('button', { name: 'Move dialog' }), 30, 20);
    expect(paper.style.transform).toBe('translate(30px,20px)');
    drag(screen.getByRole('button', { name: 'Edit content' }), 50, 40);
    expect(paper.style.transform).toBe('translate(30px,20px)');
    fireEvent.click(screen.getByRole('button', { name: 'Edit content' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(findDOMNode.mock.calls.length).toBe(0);
  });

  it('drags the real public Dialog while retaining content and close callbacks without console errors', () => {
    const findDOMNode = vi.spyOn(ReactDOM, 'findDOMNode');
    const consoleError = vi.spyOn(console, 'error');
    const onClose = vi.fn();
    const onChange = vi.fn();
    render(
      <Dialog open isDraggable titleComponents="Settlement details" onClose={onClose}>
        <input aria-label="Settlement reference" defaultValue="Original" onChange={onChange} />
      </Dialog>,
    );
    const paper = screen.getByRole('dialog', { name: /Settlement details/ });
    drag(screen.getByText('Settlement details'), 35, 25);
    expect(paper.style.transform).toBe('translate(35px,25px)');
    const input = screen.getByLabelText('Settlement reference');
    drag(input, 50, 50);
    expect(paper.style.transform).toBe('translate(35px,25px)');
    fireEvent.change(input, { target: { value: 'Updated' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(input).toHaveValue('Updated');
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(findDOMNode.mock.calls.length).toBe(0);
    expect(consoleError).not.toHaveBeenCalled();
  });
});
