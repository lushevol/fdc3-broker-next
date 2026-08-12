import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Dialog } from './index';
const onClose = jest.fn();

describe('Dialog component', () => {
  it('renders and calls onClose on button click', () => {
    const { unmount } = render(
      <Dialog isOpen={true} onClose={onClose}>
        <p>Dialog content</p>
      </Dialog>
    );

    const closeButton = screen.getByTestId('closeBtn');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('does not render children when isOpen is false and isDestroy is true', () => {
    const { queryByText } = render(
      <Dialog isOpen={false} onClose={onClose} isDestroy={true}>
        <p>Dialog content</p>
      </Dialog>
    );
    const content = queryByText('Dialog content');
    expect(content).toBeNull();
  });

});