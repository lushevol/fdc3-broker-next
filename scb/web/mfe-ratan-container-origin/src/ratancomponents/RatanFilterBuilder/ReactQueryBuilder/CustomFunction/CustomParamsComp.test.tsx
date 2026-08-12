import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FunItemsComponent from './CustomParamsComp';

describe('FunItemsComponent', () => {
  it('renders FunInput component and updates value', () => {
    const onChange = jest.fn();
    const config = { renderComp: 'FunInput', placeholder: 'Enter text' };
    const field = 'testField';
    const initValue = 'initialValue';

    render(
      <FunItemsComponent
        config={config}
        field={field}
        initValue={initValue}
        disabled={false}
        onChange={onChange}
      />
    );

    const input = screen.getByTestId(`${field}-input`);
    expect(input).toHaveValue('initialValue');

    fireEvent.change(input, { target: { value: 'newValue' } });
    expect(onChange).toHaveBeenCalledWith(field, 'newValue');
  });

  it('renders FunInputNumber component and updates value', () => {
    const onChange = jest.fn();
    const config = { renderComp: 'FunInputNumber', placeholder: 'Enter number' };
    const field = 'testField';
    const initValue = 123;

    render(
      <FunItemsComponent
        config={config}
        field={field}
        initValue={initValue}
        disabled={false}
        onChange={onChange}
      />
    );

    const input = screen.getByTestId(`${field}-input-number`);
    expect(input).toHaveValue('123');

    fireEvent.change(input, { target: { value: '456' } });
    expect(onChange).toHaveBeenCalledWith(field, 456);
  });

  it('renders nothing if no matching component is found', () => {
    const onChange = jest.fn();
    const config = { renderComp: 'NonExistentComponent' };
    const field = 'testField';
    const initValue = 'initialValue';

    render(
      <FunItemsComponent
        config={config}
        field={field}
        initValue={initValue}
        disabled={false}
        onChange={onChange}
      />
    );

    expect(screen.queryByTestId(`${field}-input`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${field}-input-number`)).not.toBeInTheDocument();
  });
});