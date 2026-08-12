import { fireEvent, render, screen } from "@testing-library/react"
import { CustomDatePickerSelect } from "./CustomDatePickerSelect"
import { useMap } from "react-use";
import '@testing-library/jest-dom/extend-expect';
import { LAST_BUSINESS_DATE, NEXT_BUSINESS_DATE } from "../Function";

jest.mock('react-use', () => ({
  useMap: jest.fn(),
}));

const mockUseMap = useMap as jest.Mock;

describe('CustomDatePickerSelect', () => {
  const onChange = jest.fn();
  const data = 'businessDay(1)';

  beforeEach(() => {
    mockUseMap.mockReset();
    mockUseMap.mockImplementation(() => [
      { type: 'businessDay', value: -1 },
      {
        set: jest.fn(),
        setAll: jest.fn(),
      },
    ]);
  });

  test('renders the component with default options', () => {
    render(<CustomDatePickerSelect data={data} variableList={["DATE_VAR", "CUSTOM_DATE"]} onChange={onChange} />);
    expect(screen.getByText('Current Date')).toBeInTheDocument();
    expect(screen.getByText('Last Business Day')).toBeInTheDocument();
    expect(screen.getByText('Next Business Day')).toBeInTheDocument();
  });

  test('calls onChange with CURRENT_DATE when Current Date button is clicked', () => {
    render(<CustomDatePickerSelect data={data}variableList={["DATE_VAR", "CUSTOM_DATE"]} onChange={onChange} />);
    fireEvent.click(screen.getByText('Current Date'));
    expect(onChange).toHaveBeenCalledWith('$CURRENT_DATE');
  });

  test('calls onChange with LAST_BUSINESS_DATE when Last Business Day button is clicked', () => {
    render(<CustomDatePickerSelect data={data} variableList={["DATE_VAR", "CUSTOM_DATE"]} onChange={onChange} />);
    fireEvent.click(screen.getByText('Last Business Day'));
    expect(onChange).toHaveBeenCalledWith(LAST_BUSINESS_DATE);
  });

  test('calls onChange with NEXT_BUSINESS_DATE when Next Business Day button is clicked', () => {
    render(<CustomDatePickerSelect data={"businessDay(-1)"} variableList={["DATE_VAR", "CUSTOM_DATE"]} onChange={onChange} />);
    fireEvent.click(screen.getByText('Next Business Day'));
    expect(onChange).toHaveBeenCalledWith(NEXT_BUSINESS_DATE);
  });

  test('updates custom date type and value when changed', async () => {
    const onChange = jest.fn();
    mockUseMap.mockImplementation(() => [
      { type: 'calendarDay', value: 5 },
      {
        set: jest.fn(),
        setAll: jest.fn(),
      },
    ]);
    render(<CustomDatePickerSelect data={data} variableList={["DATE_VAR", "CUSTOM_DATE"]} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByTestId('custom-day-type-select').firstElementChild as Element);
    await screen.findByText('calendarDay');
    fireEvent.click(screen.getByText('calendarDay'));
    fireEvent.change(screen.getByTestId('custom-day-value-select'), { target: { value: 5 } });
    fireEvent.click(screen.getByText('Set'));
    expect(onChange).toHaveBeenCalledWith('calendarDay(5)');
  });
});
