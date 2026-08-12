import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { NewItem } from './FormItemComponents';
import { ValidateStatus } from "antd/es/form/FormItem";

describe('NewItem component', () => {
  it('renders correctly with basic props', () => {
    const props = {
      field: 'testField',
      label: 'Test Field',
      configs: [{
        field: 'config_field',
        label: 'config_laebl'
      }],
      isRequired: true,
      error: {},
      update:jest.fn(),
      form:[],
      rules: [],
      hasBr: false,
      hasDivider: false,
      hidden: false,
      help: 'Some help text',
      validateStatus: "success" as ValidateStatus,
      hasFeedback: true,
      tooltipText: 'Tooltip info',
    };

    render(<NewItem {...props} />);

    const labelElement = screen.getByText('Test Field');
    const formItemElement = screen.queryByTestId('form-item-component');

    expect(formItemElement).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
    
  });
});