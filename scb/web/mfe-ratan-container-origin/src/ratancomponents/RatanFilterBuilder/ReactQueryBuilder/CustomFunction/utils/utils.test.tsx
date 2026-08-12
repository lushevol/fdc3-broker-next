
import { hydrationGenerationField, hydrationGenerationObj, isValidationFunExpression, getNewField, generateNewType} from './utils';
import { Schema , ValueSource} from "react-querybuilder";
import {
  RuleFunctionConfig,
} from "../../../RatanOne/type";

describe('hydrationGenerationField', () => {
    it('should return the first argument when the input matches the regex', () => {
      const input = 'functionName(arg1, arg2, arg3)';
      const expected = 'arg1';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  
    it('should return the whole input when the input does not match the regex', () => {
      const input = 'noMatchString';
      const expected = 'noMatchString';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  
    it('should handle empty input', () => {
      const input = '';
      const expected = '';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });

    it('should handle input with no arguments', () => {
      const input = 'functionName()';
      const expected = '';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  
    it('should handle input with multiple spaces around arguments', () => {
      const input = 'functionName(  arg1 , arg2 , arg3  )';
      const expected = 'arg1';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  
    it('should handle input with only one argument', () => {
      const input = 'singleArgFunction(arg1)';
      const expected = 'arg1';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  
    it('should handle input with arguments containing special characters', () => {
      const input = 'functionWithSpecialChars(arg1, @arg2, #arg3)';
      const expected = 'arg1';
      const result = hydrationGenerationField(input);
      expect(result).toEqual(expected);
    });
  });

  describe('hydrationGenerationObj', () => {
    it('should handle undefined input', () => {
      const result = hydrationGenerationObj(undefined);
      expect(result).toEqual({
        funName: undefined,
        funField: undefined,
        param: [],
        isRegx: false,
      });
    });
  
    it('should handle empty string input', () => {
      const result = hydrationGenerationObj('');
      expect(result).toEqual({
        funName: undefined,
        funField: '',
        param: [],
        isRegx: false,
      });
    });
  
    test('should handle string without regex pattern', () => {
      const result = hydrationGenerationObj('simpleString');
      expect(result).toEqual({
        funName: undefined,
        funField: 'simpleString',
        param: [],
        isRegx: false,
      });
    });
  
    it('should handle string with regex pattern and no parameters', () => {
      const result = hydrationGenerationObj('funcName()');
      expect(result).toEqual({
        funName: 'funcName',
        funField: '',
        param: [],
        isRegx: true,
      });
    });
  
    it('should handle string with regex pattern and one parameter', () => {
      const result = hydrationGenerationObj('funcName(param1)');
      expect(result).toEqual({
        funName: 'funcName',
        funField: 'param1',
        param: [],
        isRegx: true,
      });
    });
  
    test('should handle string with regex pattern and multiple parameters', () => {
      const result = hydrationGenerationObj('funcName(param1, param2, param3)');
      expect(result).toEqual({
        funName: 'funcName',
        funField: 'param1',
        param: ['param2', 'param3'],
        isRegx: true,
      });
    });
  
    test('should handle string with regex pattern and trimmed parameters', () => {
      const result = hydrationGenerationObj('funcName( param1 , param2 , param3 )');
      expect(result).toEqual({
        funName: 'funcName',
        funField: 'param1',
        param: ['param2', 'param3'],
        isRegx: true,
      });
    });

      
    test('should handle string with bracket field', () => {
      const result = hydrationGenerationObj('funcName( test(field) , param2 , param3 )');
      expect(result).toEqual({
        funName: 'funcName',
        funField: 'test(field)',
        param: ['param2', 'param3'],
        isRegx: true,
      });
    });

    it('isValidationFunExpression', () => {
      expect(isValidationFunExpression("functionName(arg1, arg2, arg3)")).toBeTruthy();
      expect(isValidationFunExpression("funcName( test(field) , param2 , param3 )")).toBeTruthy();
      expect(isValidationFunExpression("simpleString")).toBeFalsy();
      expect(isValidationFunExpression("123funcName( test(field) , param2 , param3 )")).toBeFalsy();
      expect(isValidationFunExpression("funcName( test(field) , param2 , param3")).toBeFalsy();
    });
  });

  describe('getNewField', () => {
    it('should return field.value if level is 1 and field.value exists', () => {
      const field = { value: 'testValue' };
      const props = { level: 1 };
      const result = getNewField(field, props);
      expect(result).toBe('testValue');
  });
  
    it('should return field if level is 1 and field.value does not exist', () => {
      const field = { someOtherProperty: 'value' };
      const props = { level: 1 };
      const result = getNewField(field, props);
      expect(result).toBe(field);
  });
    it('should return field.fn.expression if level is not 1 and field.fn exists with non-empty keys', () => {
      const field = { fn: { expression: 'fnExpression' } };
      const props = { level: 2 };
      const result = getNewField(field, props);
      expect(result).toBe('fnExpression');
  });
  it('should return field.fn.expression if level is not 1 and field.fn do not exists with non-empty keys', () => {
    const field = "fnExpression";
    const props = { level: 2 };
    const result = getNewField(field, props);
    expect(result).toBe('fnExpression');
  });
  it('should return field.fn.expression if level is not 1 and field.fn do not exists with non-empty keys', () => {
    const field = "fnExpression";
    const props = { level: 2 };
    const result = getNewField(field, props);
    expect(result).toBe('fnExpression');
  });
});
describe('generateNewType function', () => {
  const mockFunctionConfig = [
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
  test('should return enriched resultType if enrich exists', () => {
    const rule = {
      enrich: {
        resultType: 'INT',
        expression: 'testFn(testField)'
      }
    };
    const field = 'testField';
    const props = {};
    const inputType = 'text';

    const result = generateNewType(rule, field, props, mockSchema, inputType, mockFunctionConfig);

    expect(result).toEqual({"compObj": undefined, "newInputType": "int"});
  });

  test('should return functionObj methodReturnType if isRegx is true', () => {
    const rule = {};
    const field = "testFunction(arg1, arg2, arg3)";
    const props = {};
    const inputType = 'text1';

    const result = generateNewType(rule, field, props, mockSchema, inputType, mockFunctionConfig);

    expect(result).toEqual({"compObj": { paramType: "text", renderComp: "fnInput" }, "newInputType": "text"});
  });

  test('should return inputType if no enrich and not isRegx', () => {
    const rule = {};
    const field = 'testField';
    const props = {};
    const inputType = 'customType';

    const result = generateNewType(rule, field, props, mockSchema, inputType, mockFunctionConfig);

    expect(result).toEqual({"compObj": {}, "newInputType": "customType"});
  });

  test('should handle missing schema fieldMap', () => {
    const rule = {};
    const field = 'testField';
    const props = {};
    const inputType = 'text';
    const schemaWithoutFieldMap = {};

    const result = generateNewType(rule, field, props, schemaWithoutFieldMap, inputType, mockFunctionConfig);

    expect(result).toEqual({"compObj": {}, "newInputType": "text"}); // Assuming inputType is used as fallback
  });

  test('should handle missing functionConfig match', () => {
    const rule = {};
    const field = 'testField';
    const props = {};
    const inputType = 'text';

    const result = generateNewType(rule, field, props, mockSchema, inputType, mockFunctionConfig);

    expect(result).toEqual({"compObj": {}, "newInputType": "text"}); // Assuming inputType is used as fallback
  });
});


