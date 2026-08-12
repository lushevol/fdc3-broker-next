import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DynamickFieldLabel, FieldLabel } from './index';

describe('DynamickFieldLabel and FieldLabel UT', () => {
  it('renders DynamickFieldLabel correctly with initial label', () => {
    const config = [
      { field: 'field1', label: 'Label 1', disabled: false },
      { field: 'field2', label: 'Label 2', disabled: true },
    ];
    const { getByText } = render(
      <DynamickFieldLabel
        config={config}
        onChange={vi.fn()}
      >
      </DynamickFieldLabel>
    );

    expect(getByText('Label 1')).toBeInTheDocument();
  });

  it('renders FieldLabel correctly with initial label', () => {
    const { getByText } = render(
      <FieldLabel
      text={"mock-text"}
      >
      </FieldLabel>
    );
    expect(getByText('mock-text')).toBeInTheDocument();
  });

  it('renders FieldLabel correctly with optional attribute', () => {
    const { getByText } = render(
      <FieldLabel
      text={"mock-text-2"}
      className={"mock-text-class"}
      labelWidth={30}
      formWidth={30}
      order={2}
      >
      </FieldLabel>
    );
    expect(getByText('mock-text-2')).toBeInTheDocument();
  });
});