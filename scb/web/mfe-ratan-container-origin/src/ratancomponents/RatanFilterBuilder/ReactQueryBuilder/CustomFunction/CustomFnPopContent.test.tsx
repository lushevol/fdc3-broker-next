import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomFnPopContent from './CustomFnPopContent';
import { StylePopRoot } from './common/CustomFnPopContentStyle';

const mockHandleOnChange = jest.fn();

const mockFunList = [
  {
    functionName: 'testFunction',
    displayName: 'Test Function',
    parameters: [{ name: 'param1', type: 'string' }, { name: 'param2', type: 'number' }],
    supportTargetObjectClass: ['text'],
    description: 'This is a test function',
    methodReturnType:[
      {
          "paramType": "TEXT",
          "renderComp": "FunInput",
          "defaultValue": ""
      }
  ]
  }
];

const mockProps = {
  initialValue: 'initialValue',
  disabled: false,
  funList: mockFunList,
  dataType: 'dataType',
  functionName: "test",
  type:"fieldSelector",
  handleOnChange: mockHandleOnChange,
  level:1

};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CustomFnPopContent', () => {
  it('renders correctly with initial props', () => {
    render(
      <StylePopRoot>
        <CustomFnPopContent {...mockProps} />
      </StylePopRoot>
    );

    expect(screen.getByTestId("customFieldFunMenthodSelect")).toBeInTheDocument();
  });

  it('updates function name and resets form when function name changes', () => {
    render(
      <StylePopRoot>
        <CustomFnPopContent {...mockProps} />
      </StylePopRoot>
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'testFunction' } });

    expect(mockHandleOnChange).not.toHaveBeenCalled();
  });

  it('renders form items based on selected function', () => {
    const mockFunList1 = [
      {
        functionName: 'testFunction',
        displayName: 'Test Function',
        parameters: [{ name: 'param1', type: 'string' }, { name: 'param2', type: 'number' }],
        supportTargetObjectClass: ['text'],
        description: 'This is a test function',
        methodReturnType:[
          {
              "paramType": "TEXT",
              "renderComp": "FunInput",
              "defaultValue": ""
          }
      ]
      }
    ];
    const mockProps = {
      initialValue: 'initialValue',
      disabled: false,
      funList: mockFunList1,
      dataType: 'text',
      functionName: "testFunction",
      type:"fieldSelector",
      handleOnChange: mockHandleOnChange,
      level:1
    };

    render(
      <CustomFnPopContent {...mockProps} />
    );

    const subBtn = screen.getByTestId("customFieldFunMenthod-submit");
    expect(subBtn).toBeInTheDocument();
    fireEvent.click(subBtn);
  });
  it('renders form items based on selected function', () => {
    const mockFunList1 = [
      {
        functionName: 'testFunction',
        displayName: 'Test Function',
        parameters: [{ name: 'param1', type: 'string' }, { name: 'param2', type: 'number' }],
        supportTargetObjectClass: ['text'],
        description: 'This is a test function',
        methodReturnType:[
          {
              "paramType": "TEXT",
              "renderComp": "FunInput",
              "defaultValue": ""
          }
      ]
      }
    ];
    const mockProps = {
      initialValue: 'initialValue',
      disabled: false,
      funList: mockFunList1,
      dataType: 'text',
      functionName: "testFunction",
      type:"fieldSelector",
      handleOnChange: mockHandleOnChange,
      level:1
    };

    render(
      <CustomFnPopContent {...mockProps} />
    );

     const selectFnName = screen.getByTestId("customFieldFunMenthodSelect");
    expect(selectFnName).toBeInTheDocument();
    fireEvent.click(selectFnName);
    
    const subBtn = screen.getByTestId("customFieldFunMenthod-delete");
    expect(subBtn).toBeInTheDocument();
    fireEvent.click(subBtn);
  });
});