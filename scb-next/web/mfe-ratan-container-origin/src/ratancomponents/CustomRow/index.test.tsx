import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomRow } from './index';

describe('CustomRow component', () => {
  it('renders correctly with single field', () => {
    const config = [
      {
        label: 'Test Label',
        field: 'testData',
      },
    ];
    const data = { testData: 'Test Value' };

    const { getByText } = render(<CustomRow config={config} data={data} />);

    expect(getByText("Test Label")).toBeInTheDocument();

  });

  it('renders correctly with multiple fields on the same line', () => {
    const config = [
      {
        label: 'Test Label 1',
        field: 'testData1',
        sameLine: [
          {
            label: 'Test Label 2',
            field: 'testData2',
          },
        ],
        valueGetter:"valueGetter",
      },
    ];
    const data = { testData1: 'Value 1', testData2: 'Value 2' };

    const { getByText } = render(<CustomRow config={config} data={data} />);

    expect(getByText("Test Label 2")).toBeInTheDocument();

  });

  it('renders correctly with value getter fields', () => {
    const config = [
      {
        label: 'Test Label 1',
        field: 'testData1',
        valueGetter: ()=>"valueGetter",
      },
    ];
    const data = { testData1: 'Value 1', testData2: 'Value 2' };

    const { getByText } = render(<CustomRow config={config} data={data} />);

    expect(getByText("valueGetter")).toBeInTheDocument();

  });

  it('renders correctly with arr fields', () => {
    const config = [
      {
        label: 'Test Label 1',
        field: ['testData1', 'testData2'],
      },
    ];
    const data = { testData1: 'Value 1', testData2: 'Value 2' };

    const { getByText } = render(<CustomRow config={config} data={data} />);

    expect(getByText("Value 1")).toBeInTheDocument();
    expect(getByText("Value 2")).toBeInTheDocument();

  });

});