import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CustomDateTimeSelect } from './CustomDateTimeSelect';
import { CURRENT_TIME } from '../Function/DateVariable';

describe('CustomDateTimeSelect', () => {
  const mockOnChange = jest.fn();
  const variableList = ['TIME_VAR'];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders time buttons when variableList includes TIME_VAR', () => {
    render(<CustomDateTimeSelect data="" variableList={variableList} onChange={mockOnChange} />);
    
    expect(screen.getByText('Current Time')).toBeInTheDocument();
  });

  test('does not render time buttons when variableList does not include TIME_VAR', () => {
    render(<CustomDateTimeSelect data="" variableList={[]} onChange={mockOnChange} />);
    
    expect(screen.queryByText('Current Time')).not.toBeInTheDocument();
  });

  test('calls onChange with CURRENT_TIME when Current Time button is clicked', () => {
    render(<CustomDateTimeSelect data="" variableList={variableList} onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('Current Time'));
    expect(mockOnChange).toHaveBeenCalledWith(CURRENT_TIME);
  });

  it("calls onChange with hour value when Set button clicked", () => {
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomDateTimeSelect data="" variableList={variableList} onChange={onChange} />
    );
    const input = getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "7" } });
    fireEvent.click(getByText("Set"));
    expect(onChange).toHaveBeenCalledWith("hours(7)");
  });

  it("calls onChange with minute value when Set button clicked", async () => {
    const onChange = jest.fn();
    const { getByRole, getByText } = render(
      <CustomDateTimeSelect data="" variableList={variableList} onChange={onChange} />
    );
    const input = getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "7" } });
    const select = screen.getByTestId('custom-time-type-select').firstChild;
    // @ts-ignore
    fireEvent.mouseDown(select);
    const option = await screen.findByText("Minutes");
    fireEvent.click(option);
    fireEvent.click(getByText("Set"));
    expect(onChange).toHaveBeenCalledWith("minutes(7)");
  });
});
