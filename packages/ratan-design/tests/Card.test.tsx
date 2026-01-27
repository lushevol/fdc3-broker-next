import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Card } from '../src/Card';

describe('Card', () => {
  test('The card should render correctly', () => {
    render(<Card title="Card Title" helperText="Helper text" />);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('The card should render with title and helper text', () => {
    render(
      <Card
        title="Test Card"
        eyebrow="Category"
        helperText="This is a description"
      />,
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  test('The clickable card should call onClick handler', () => {
    const handleClick = vi.fn();
    render(
      <Card title="Clickable Card" variant="clickable" onClick={handleClick} />,
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('The clickable card should be focusable', () => {
    render(
      <Card title="Clickable Card" variant="clickable" onClick={() => {}} />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[buttons.length - 1]).toHaveAttribute('tabIndex', '0');
  });

  test('The disabled card should not respond to clicks', () => {
    const handleClick = vi.fn();
    render(
      <Card title="Disabled Card" disabled={true} onClick={handleClick} />,
    );

    const buttons = screen.getAllByRole('button');
    const disabledCard = buttons.find(
      (btn) => btn.getAttribute('aria-disabled') === 'true',
    );
    expect(disabledCard).toBeDefined();
    // Click the disabled card - should not trigger onClick
    const lastButton = buttons[buttons.length - 1];
    fireEvent.click(lastButton);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('The selected card should have aria-selected attribute', () => {
    render(<Card title="Selected Card" variant="selected" selected={true} />);

    const buttons = screen.getAllByRole('button');
    const selectedCard = buttons.find(
      (btn) => btn.getAttribute('aria-selected') === 'true',
    );
    expect(selectedCard).toBeDefined();
  });

  test('The card with checkbox should render checkbox input', () => {
    render(
      <Card
        title="Selectable Card"
        selectionType="checkbox"
        selected={false}
        onSelectionChange={() => {}}
      />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('The card with radio should render radio input', () => {
    render(
      <Card
        title="Radio Card"
        selectionType="radio"
        selected={true}
        onSelectionChange={() => {}}
      />,
    );

    expect(screen.getByRole('radio')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeChecked();
  });

  test('The card should render tags correctly', () => {
    render(
      <Card
        title="Card with Tags"
        tags={[
          { label: 'Active', variant: 'success' },
          { label: 'New', variant: 'default' },
        ]}
      />,
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('The card with image should render image', () => {
    render(
      <Card
        image={{ src: 'test.jpg', alt: 'Test image' }}
        title="Image Card"
      />,
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');
  });

  test('The card with additional details should render them', () => {
    render(
      <Card
        title="Card with Details"
        additionalDetails={
          <>
            <span>Dec 19, 2025</span>
            <span>•</span>
            <span>5 min read</span>
          </>
        }
      />,
    );

    expect(screen.getByText('Dec 19, 2025')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  test('The card with footer actions should render them', () => {
    render(
      <Card
        title="Card with Footer"
        footerActions={
          <>
            <button>Cancel</button>
            <button>Confirm</button>
          </>
        }
      />,
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('The clickable card with chevron should render chevron icon', () => {
    render(
      <Card
        title="Card with Chevron"
        variant="clickable"
        trailingContent="chevron"
        onClick={() => {}}
      />,
    );

    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
  });

  test('The card with more menu should render more menu icon', () => {
    render(<Card title="Card with More Menu" trailingContent="more-menu" />);

    expect(screen.getByTestId('more-menu-icon')).toBeInTheDocument();
  });

  test('The draggable card should have draggable attribute', () => {
    render(<Card title="Draggable Card" draggable={true} />);

    // Find the card element by text and check draggable
    // Go up to find the styled card wrapper which has the draggable attribute
    const cardElement = screen
      .getByText('Draggable Card')
      .closest('[draggable="true"]');
    expect(cardElement).toBeInTheDocument();
  });
});
