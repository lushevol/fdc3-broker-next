import { render, screen, fireEvent } from "@testing-library/react";
import { CustomContent, CustomDatePacker } from "./CustomDatePacker";
import { CustomDatePickerSelect } from "./CustomDatePickerSelect";
import { CustomDateTimeSelect } from "./CustomDateTimeSelect";

jest.mock('./CustomDatePickerSelect', () => ({
  CustomDatePickerSelect: jest.fn(() => <div>CustomDatePickerSelect</div>),
}));

jest.mock('./CustomDateTimeSelect', () => ({
  CustomDateTimeSelect: jest.fn(() => <div>CustomDateTimeSelect</div>),
}));

describe("CustomDatePacker", () => {
  const mockOnChange = jest.fn();
  
  const defaultProps = {
    value: "2023-01-01",
    disabled: false,
    placeHolderText: "Select date",
    datePickerVariable: true,
    variableList: ["DATE_VAR"],
    // datePickerVariableCustom: [],
    // inputTypeCoerced: "datetime-local",
    // operator: "=",
    staticFormat: "YYYY-MM-DD",
    handleOnChange: mockOnChange,
  };

  it("renders date picker with default value", () => {
    render(<CustomDatePacker {...defaultProps} />);
    expect(screen.getByTestId("datetime-local")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("datetime-local"));
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("handles date change", async () => {
    render(<CustomDatePacker {...defaultProps} />);
    // Open picker
    fireEvent.click(screen.getByTestId("datetime-local"));
    
    // Select date
    const targetCell = screen.getByTitle("2023-01-07")
    fireEvent.click(targetCell);
    
    // Wait for state updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(mockOnChange).toHaveBeenCalledWith("2023-01-07");
  });

  it("renders popover button when datePickerVariable is true", () => {
    render(<CustomDatePacker {...defaultProps} />);
    expect(screen.getByTestId("open-popover")).toBeInTheDocument();
  });

  it("does not render popover button when datePickerVariable is false", () => {
    render(<CustomDatePacker {...defaultProps} variableList ={[]} />);
    expect(screen.queryByTestId("open-popover")).not.toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<CustomDatePacker {...defaultProps} disabled={true} />);
    expect(screen.getByTestId("datetime-local")).toBeDisabled();
    expect(screen.getByTestId("open-popover")).toBeDisabled();
  });

  it("handles invalid date value", () => {
    render(<CustomDatePacker {...defaultProps} value="invalid-date" />);
    expect(screen.getByPlaceholderText("Select date")).toBeInTheDocument();
  });
});

describe('CustomContent', () => {
  const mockCustomChange = jest.fn();
  const variableList = ['DATE_VAR', 'TIME_VAR'];
  const value = 'some value';

  test('renders CustomDatePickerSelect when inputTypeCoerced is "date"', () => {
    render(<CustomContent variableList={variableList} inputTypeCoerced="date" customChange={mockCustomChange} value={value} />);
    
    expect(screen.getByText('CustomDatePickerSelect')).toBeInTheDocument();
    expect(CustomDatePickerSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        data: value,
        variableList,
        onChange: mockCustomChange,
      }),
      {}
    );
  });

  test('renders CustomDateTimeSelect when inputTypeCoerced is "datetime"', () => {
    render(<CustomContent variableList={variableList} inputTypeCoerced="datetime" customChange={mockCustomChange} value={value} />);
    
    expect(screen.getByText('CustomDateTimeSelect')).toBeInTheDocument();
    expect(CustomDateTimeSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        data: value,
        variableList,
        onChange: mockCustomChange,
      }),
      {}
    );
  });

  test('does not render any component when inputTypeCoerced is neither "date" nor "datetime"', () => {
    render(<CustomContent variableList={variableList} inputTypeCoerced="other" customChange={mockCustomChange} value={value} />);
    
    expect(screen.queryByText('CustomDatePickerSelect')).not.toBeInTheDocument();
    expect(screen.queryByText('CustomDateTimeSelect')).not.toBeInTheDocument();
  });
});