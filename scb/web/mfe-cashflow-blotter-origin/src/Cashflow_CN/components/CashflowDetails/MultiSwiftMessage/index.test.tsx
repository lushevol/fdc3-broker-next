import { fireEvent,render, screen } from '@testing-library/react';

import MultiSwiftMessage from './index';

jest.mock("./../common/utils", () => ({
    formattedXml: jest.fn((xmlString) => 'Message 1\nMessage 2'),
}));

describe('MultiSwiftMessage', () => {
  const mockSwiftMessages = [
    {
      mxType: 'type 1',
      mxMessage: 'Message 1',
      sequence: 1,
    },
    {
      mxType: 'type 2',
      mxMessage: 'Message 2',
      sequence: 2,
    },
  ];

  test('renders the component with swift messages', () => {
    render(<MultiSwiftMessage swiftMessages={mockSwiftMessages} cashflowId="123" />);

    const menuIconBtn = screen.getByTestId("menu-icon_btn");
    fireEvent.click(menuIconBtn);
    const menuItem = screen.getByTestId("swift-menu-type 2");
    fireEvent.click(menuItem);
    expect(screen.getByText("Export All")).toBeInTheDocument();
  });

  test('renders the component with no swift messages', () => {
    render(<MultiSwiftMessage swiftMessages={[]} cashflowId="123" />);
    expect(screen.getByText('No Swift Message')).toBeInTheDocument();
  });

  test('copies the selected swift message', async () => {
    render(<MultiSwiftMessage swiftMessages={mockSwiftMessages} cashflowId="123" />);
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    // Click the copy button
    fireEvent.click(screen.getByTestId("copy-message"));
    expect(writeTextMock).toHaveBeenCalled();
  });
});