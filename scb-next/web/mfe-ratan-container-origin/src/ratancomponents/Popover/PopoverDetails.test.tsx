import React from 'react';
import { render, screen } from '@testing-library/react';
import { PopoverDetails } from './PopoverDetails';

const mockFieldsList = [
  {
    name: 'Group 1',
    fields: [
      { label: 'Field 1', field: 'field1' },
      { label: 'Field 2', type: 'time', field: 'field2' },
     ],
  },
];

const mockDetails = {
  field1: 'Value 1',
  field2: '2023-01-01T12:00:00',
  field3: 'Value 3',
};

describe('PopoverDetails', () => {
  it('renders fields correctly', () => {
    render(
      <PopoverDetails fieldsList={mockFieldsList} details={mockDetails}>
      </PopoverDetails>
    );

    const field1 = screen.getByText('Field 1');
    expect(field1).toBeInTheDocument();
    expect(field1.nextElementSibling).toHaveTextContent('Value 1');

    const field2 = screen.getByText('Field 2');
    expect(field2).toBeInTheDocument();
    expect(field2.nextElementSibling).toHaveTextContent('2023-01-01T12:00:00');
  });

});