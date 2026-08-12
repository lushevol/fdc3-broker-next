import { handleQuery, handleRuleBlotter } from './index';

describe('handleRuleBlotter', () => {
  test('returns { date: ["CUSTOM_DATE", "DATE_VAR"] } when datePickerVariable is true', () => {
    const result = handleRuleBlotter({
      datePickerVariable: true,
    });

    expect(result).toEqual({ date: ["CUSTOM_DATE", "DATE_VAR"] });
  });

  test('returns variableConfig when mode is "drools-rule" and datePickerVariable is false', () => {
    const variableConfig = { date: ["DATE_VAR"] };
    const result = handleRuleBlotter({
      mode: "drools-rule",
      datePickerVariable: false,
      // @ts-ignore
      variableConfig,
    });

    expect(result).toBe(variableConfig);
  });

  test('returns variableConfig when datePickerVariable is true', () => {
    const variableConfig = { date: ["DATE_VAR"] };
    const result = handleRuleBlotter({
      mode: "group",
      datePickerVariable: true,
       // @ts-ignore
      variableConfig,
    });

    expect(result).toEqual({ date: ["CUSTOM_DATE", "DATE_VAR"]});
  });

  test('returns variableConfig when mode is not "drools-rule" and datePickerVariable is false', () => {
    const variableConfig = { someKey: "someValue" };
    const result = handleRuleBlotter({
      mode: "group",
      datePickerVariable: false,
       // @ts-ignore
      variableConfig,
    });

    expect(result).toBe(variableConfig);
  });
});

describe('handleQuery', () => {
  const functionConfig = [
    {
        "displayName": "Split",
        "description": "Case: FieldA(value is \"AAA_BBB\") using Split(\"_\",1) \nResult is \"AAA\"",
        "functionName": "split",
        "parameters": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            },
            {
                "paramType": "NUMBER",
                "renderComp": "FunInputNumber",
                "defaultValue": ""
            }
        ],
        "methodReturnType": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "TEXT"
        ]
    },
    {
        "displayName": "Trim",
        "description": "Case: FieldA(value is \"  ABC  \") using Trim() \nResult is \"ABC\"",
        "functionName": "trim",
        "parameters": [],
        "methodReturnType": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "TEXT"
        ]
    },
    {
        "displayName": "Upper",
        "description": "Case: FieldA(value is \"abc\") using Upper() \nResult is \"ABC\"",
        "functionName": "upper",
        "parameters": [],
        "methodReturnType": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "TEXT"
        ]
    },
    {
        "displayName": "Lower",
        "description": "Case: FieldA(value is \"ABC\") using Lower() \nResult is \"abc\"",
        "functionName": "lower",
        "parameters": [],
        "methodReturnType": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "TEXT"
        ]
    },
    {
        "displayName": "Datetime To Date",
        "description": "Case: FieldA(value is \"2024-12-31T15:36:49.775+0800\") using DatetimeToDate() \nResult is \"2024-12-31\"",
        "functionName": "datetimeToDate",
        "parameters": [],
        "methodReturnType": [
            {
                "paramType": "DATE",
                "renderComp": "FunDatePicker",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "DATETIME"
        ]
    },
    {
        "displayName": "SubString",
        "description": "Case: FieldA(value is \"ABCDE\") using Substring(1,3) \nResult is \"ABC\"",
        "functionName": "subString",
        "parameters": [
            {
                "paramType": "NUMBER",
                "renderComp": "FunInputNumber",
                "defaultValue": ""
            },
            {
                "paramType": "NUMBER",
                "renderComp": "FunInputNumber",
                "defaultValue": ""
            }
        ],
        "methodReturnType": [
            {
                "paramType": "TEXT",
                "renderComp": "FunInput",
                "defaultValue": ""
            }
        ],
        "supportTargetObjectClass": [
            "TEXT"
        ]
    }
  ]

  test('should handle empty query object', () => {
    const result = handleQuery(undefined, functionConfig);
    expect(result).toEqual({});
  });

  test('should process simple rule without nested rules', () => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field: 'name',
          value: 'John Doe',
          operator: '=='
        },
      ],
    };

    const result = handleQuery(query, functionConfig);
    expect(result).toEqual(query);
  });

  test('should recursively process nested rules', () => {
    const nestedRule = {
      field: 'age',
      value: '30',
      operator: '=='
    };

    const query = {
      combinator: 'and',
      rules: [
        {
          combinator: 'and',
          rules: [nestedRule],
        },
      ],
    };

    const result = handleQuery(query, functionConfig);
    expect(result.rules[0].rules[0]).toEqual(nestedRule);
  });

  test('should transform field if it is a validation function expression', () => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field: 'lower(validateName)',
          value: 'John Doe',
          operator: '=='
        },
      ],
    };

    const expectedResult = {
      combinator: 'and',
      rules: [
        {
          field: 'validateName',
          enrich: {
            expression: 'lower(validateName)',
            field: 'validateName',
            resultType: 'TEXT',
          },
          operator: "==",
          value: 'John Doe',
        },
      ],
    };

    const result = handleQuery(query, functionConfig);
    expect(result).toEqual(expectedResult);
  });

  test('should transform value if it is a validation function expression', () => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field: 'name',
          value: 'datetimeToDate(time1)',
          operator: '=='
        },
      ],
    };

    const expectedResult = {
      combinator: "and",
      rules: [
        {
          field: 'name',
          value: {
            fn: {
              expression: 'datetimeToDate(time1)',
              field: 'time1',
              resultType: 'DATE',
            },
          },
          operator: "==",
        },
      ],
    };

    const result = handleQuery(query, functionConfig);
    expect(result).toEqual(expectedResult);
  });

  test('should handle both field and value transformations simultaneously', () => {
    const query = {
      combinator: "and",
      rules: [
        {
          field: 'datetimeToDate(validateAge)',
          value: 'datetimeToDate(validateYear)',
          operator: '=='
        },
      ],
    };

    const expectedResult = {
      combinator: 'and',
      rules: [
        {
          field: 'validateAge',
          enrich: {
            expression: 'datetimeToDate(validateAge)',
            field: 'validateAge',
            resultType: 'DATE',
          },
          value: {
            fn: {
              expression: 'datetimeToDate(validateYear)',
              field: 'validateYear',
              resultType: 'DATE',
            },
          },
          operator: '=='
        },
      ],
    };

    const result = handleQuery(query, functionConfig);
    expect(result).toEqual(expectedResult);
  });
});
