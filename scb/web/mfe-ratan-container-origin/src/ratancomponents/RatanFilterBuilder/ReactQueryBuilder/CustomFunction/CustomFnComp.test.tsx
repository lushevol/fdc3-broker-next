import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomFnComp from './CustomFnComp';
import {
  RuleFunctionConfig,
} from "../../RatanOne/type";

jest.mock('../CustomFunction/utils/utils', () => ({
  hydrationGenerationObj: jest.fn(() => ({
    funName: undefined,
    funField: '',
    param: [],
  })),
}));
const funList = [
  {
    functionName: 'testFunction',
    displayName: 'Test Function',
    parameters: [
      { paramType: 'string', renderComp:"fnInput" },
      { paramType: 'number', renderComp:"fnInput" },
    ],
    methodReturnType: [{
      paramType:"text",
      renderComp:"fnInput",
    }],
    supportTargetObjectClass: ['dataType'],
  }
] as RuleFunctionConfig[];

const mockSchema ={
  fieldMap:{
    "testField": {
      fieldConfig :
        {
          config: {
            dataType: "text",
          }
        }
    }
  }
};

const mockRule = {
  enrich:{
    expression:"testFn(testField)",
  },
  field:{
    fn:{
      expression:"testFn(testField)"
    }
  }
}

const handleOnChange = jest.fn();

describe('CustomFnCom', () => {
  it('renders correctly with initial props', () => {
    render(
      <CustomFnComp
        disableCascader={false}
        handleOnChange={handleOnChange}
        type="fieldSelector"
        functionConfig={funList}
        schema={mockSchema}
        selectorValue={"testField"}
        selectorRule={mockRule}
        level={1}
      />
    );

    const funButton = screen.getByTestId("customFieldFunMenthod-fun-button");
    expect(funButton).toBeInTheDocument();
    funButton.click();
  });
});