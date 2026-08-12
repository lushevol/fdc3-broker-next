import { render, screen } from "@testing-library/react";
import { CustomAntDFieldSelector, generateFunFieldConfig, handleOneLevelField, handleValueChange } from "./CustomAntDFieldSelector";
import { RatanFieldCascaderOption } from '../../RatanOne/type';
import {
  ValueSource,
} from "react-querybuilder";

afterAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CustomAntDFieldSelector component", () => {
  it("should be in the document", async () => {
    const props = {
      className: "rule-value",
      handleOnChange: jest.fn(),
      options: [],
      value: "200",
      title: "title",
      disabled: false,
      multiple: false,
      listsAsArrays: true,
      path: [6],
      level: 3,
    };
    const { getByTestId } = render(<CustomAntDFieldSelector {...props} />);
    const multipleInputNumber = getByTestId("custom-field-selector");
    expect(multipleInputNumber).toBeDefined();
  });
  it("renders CustomFnComp when enableFn is true", async () => {
    const options = [{
      disabled:false,
      label:"Trade",
      value:"Trade",
      children:[
        {
        label: "AACode Comments",
        value: "AACode_Comments",
        disabled: false,
        children: [],
        indexedTerm: "AACode_Comments",
        businessTerm: "",
        dataType: "text",
        subSelection: "Trade",
        context: "TRANSACTION_DATA",
        displayStyle: "freeText",
        valueList: [],
        operators: "EQ",
        operatorsSupp: "==,!=",
        detailsFixed: false,
        dynamicList: false,
        disabledView: true,
        disabledFilter: true,
        scope: "{\"disabledBlotter\":[\"TRADE_BLOTTER\",\"CASHFLOW_BLOTTER\"],\"enabledQueryResult\":[],\"fieldTags\":[],\"displayName\":\"\",\"version\":\"v1.1.0\"}",
        detailsGroup: "",
        seq: 2446,
        blotterContext: [
            "TRANSACTION_DATA"
        ]}
  ],
  }];
    const handleOnChange = jest.fn();

    const mockFunctionConfig = [{
      displayName: "Split",
      description: "Case: FieldA(value is \"AAA_BBB\") using Split(\"_\",1) \nResult is \"AAA\"",
      functionName: "split",
      parameters: [
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
      methodReturnType: [
        {
          paramType: "TEXT",
          renderComp: "FunInput",
          defaultValue: ""
        }
      ],
      supportTargetObjectClass: [
        "TEXT"
      ]
    }];
    const mockRule = {
      id: "a61a5822-5da6-4a0c-9f54-1fcddc5a6749",
      field: "AACode_Comments",
      operator: "=",
      valueSource: "value" as ValueSource,
      value: "",
      enrich: {
        expression: "xxx"
      }
  }

  const mockSchema = {
    fieldMap:{
      AACode_Comments:
      {
        "name": "AACode_Comments",
        "label": "AACode_Comments",
        "inputType": "text",
        "values": [],
        "operators": [
            {
                "name": "=",
                "label": "="
            },
            {
                "name": "!=",
                "label": "!="
            },
            {
                "name": "null",
                "label": "is null"
            },
            {
                "name": "notNull",
                "label": "is not null"
            },
            {
                "name": "in",
                "label": "in"
            },
            {
                "name": "notIn",
                "label": "not in"
            },
            {
                "name": "matches",
                "value": "matches",
                "label": "matches"
            },
            {
                "name": "notMatches",
                "value": "notMatches",
                "label": "not matches"
            },
            {
                "name": "empty",
                "value": "empty",
                "label": "is empty"
            },
            {
                "name": "notEmpty",
                "value": "notEmpty",
                "label": "is not empty"
            }
        ],
        config: {
            "indexedTerm": "AACode_Comments",
            "businessTerm": "",
            dataType: "text",
            "subSelection": "Trade",
            "context": "TRANSACTION_DATA",
            "displayStyle": "freeText",
            "valueList": [],
            "operators": "EQ",
            "operatorsSupp": "==,!=",
            "detailsFixed": false,
            "dynamicList": false,
            "disabledView": true,
            "disabledFilter": true,
            "scope": "{\"disabledBlotter\":[\"TRADE_BLOTTER\",\"CASHFLOW_BLOTTER\"],\"enabledQueryResult\":[],\"fieldTags\":[],\"displayName\":\"\",\"version\":\"v1.1.0\"}",
            "detailsGroup": "",
            "seq": 2446,
            "blotterContext": [
                "TRANSACTION_DATA"
            ]
        },
        "valueSources": [
            "value",
            "field"
        ]
    }
    }
  }
    render(
      <CustomAntDFieldSelector
        className="testClassFun"
        //@ts-ignore
        options={options}
        handleOnChange={handleOnChange}
        enableFn = {true}
        functionConfig={mockFunctionConfig}
        value="testFiled"
        rule = {mockRule}
        schema = {mockSchema}
        title="testTitle"
        disabled={false}
        multiple ={false}
        listsAsArrays={true}
        type={"fieldSelctor"}
        path= {[6]}
        level={1}
      />
    );

    expect(screen.getByTestId('custom-field-selector')).toBeInTheDocument();
  });
});

describe('handleValueChange', () => {
  it('should return leaf.indexedTerm when conditions are not met', () => {
    const leaf = {
      dataType: 'string',
      indexedTerm: 'someIndexedTerm'
    };
    const rule = undefined;

    const result = handleValueChange({ rule, leaf });
    expect(result).toBe('someIndexedTerm');
  });

  it('should return transformed object when conditions are met', () => {
    const leaf = {
      dataType: 'datetime',
      indexedTerm: 'someIndexedTerm'
    };
    const rule = {
      enrich: {
        resultType: 'DATE'
      }
    };

    const result = handleValueChange({ rule, leaf });
    expect(result).toEqual({
      value: 'someIndexedTerm',
      fn: {
        expression: 'datetimeToDate(someIndexedTerm)',
        field: 'someIndexedTerm',
        resultType: 'DATE'
      }
    });
  });

  it('should return leaf.indexedTerm when rule is present but enrich.resultType is not "DATE"', () => {
    const leaf = {
      dataType: 'datetime',
      indexedTerm: 'someIndexedTerm'
    };
    const rule = {
      enrich: {
        resultType: 'TIME'
      }
    };

    const result = handleValueChange({ rule, leaf });
    expect(result).toBe('someIndexedTerm');
  });

  it('should return leaf.indexedTerm when leaf.dataType is not "datetime"', () => {
    const leaf = {
      dataType: 'string',
      indexedTerm: 'someIndexedTerm'
    };
    const rule = {
      enrich: {
        resultType: 'DATE'
      }
    };

    const result = handleValueChange({ rule, leaf });
    expect(result).toBe('someIndexedTerm');
  });
});

describe('handleOneLevelField', () => {
  const mockSchema = {
    fieldMap: {
      'field1': {
        config: { indexedTerm: "Trade_Id", subSelection: "Trade" }
      },
      'field2': {
        config: null // or undefined if you prefer
      }
    }
  };

  describe('when value is undefined', () => {
    it('should return undefined split by separator (empty array)', () => {
      // @ts-ignore
      const result = handleOneLevelField(undefined, mockSchema);
      expect(result).toEqual(undefined);
    });
  });

  describe('when value exists in fieldMap with config', () => {
    it('should call getPaths with the config', () => {
      // @ts-ignore
      const result = handleOneLevelField('field1', mockSchema);
      expect(result).toEqual(['Trade', 'Trade_Id']);
    });
  });

  describe('when value exists in fieldMap without config', () => {
    it('should split the value by separator', () => {
      // @ts-ignore
      const result = handleOneLevelField('field2', mockSchema);
      expect(result).toEqual(['field2']);
    });
  });

  describe('when value does not exist in fieldMap', () => {
    it('should split the value by separator', () => {
      // @ts-ignore
      const result = handleOneLevelField('nonexistent', mockSchema);
      expect(result).toEqual(['nonexistent']);
    });
  });

  describe('when schema is undefined', () => {
    it('should split the value by separator', () => {
      const result = handleOneLevelField('anyvalue');
      expect(result).toEqual(['anyvalue']);
    });
  });

  describe('when fieldMap is undefined', () => {
    it('should split the value by separator', () => {
      const result = handleOneLevelField('anyvalue', { fieldMap: undefined });
      expect(result).toEqual(['anyvalue']);
    });
  });
});

describe('generateFunFieldConfig', () => {
  const mockSchema = {
    fieldMap: {
      Trade_Id: {
        config: {
          indexedTerm: 'Trade_Id',
          valueList: [],
          dataType: 'string'
        }
      }
    }
  };

  beforeEach(() => {
    // Clear all mocks if using jest
    jest.clearAllMocks();
  });

  test('should handle type "fieldSelctor" with enrich rule', () => {
    const result = generateFunFieldConfig({
      value: 'someValue',
      rule: {
        enrich: {
          expression: 'enrichedField'
        }
      },
      type: 'fieldSelctor',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual(['enrichedField']);
  });

  test('should handle non-fieldSelctor type with function value', () => {
    const result = generateFunFieldConfig({
      value: { fn: { expression: 'anotherField' } },
      rule: {
        field: {
          fn: "xxx"
        }
      },
      type: 'fieldSelctor',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual(['anotherField']);
  });

  test('should handle non-fieldSelctor type with function value', () => {
    const result = generateFunFieldConfig({
      value: { fn: { expression: 'anotherField' } },
      rule: {
        field: 'xxx'
      },
      type: 'fieldSelctor',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual([""]);
  });

  test('should handle non-fieldSelctor type with function value', () => {
    const result = generateFunFieldConfig({
      value: 'Trade_Id',
      rule: {
        field: 'Trade_Id'
      },
      type: 'fieldSelctor',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual(["Trade_Id"]);
  });

  test('should handle non-fieldSelctor type with string value', () => {
    const result = generateFunFieldConfig({
      value: 'simpleField',
      rule: {},
      type: 'otherType',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual(['simpleField']);
  });

  test('should return default config when field not found in schema', () => {
    const result = generateFunFieldConfig({
      value: 'nonExistentField',
      rule: {},
      type: 'otherType',
      // @ts-ignore
      schema: mockSchema
    });

    expect(result).toEqual(['nonExistentField']);
  });

  test('should handle undefined schema gracefully', () => {
    const result = generateFunFieldConfig({
      value: 'testField',
      rule: {},
      type: 'otherType',
      schema: undefined as any
    });

    expect(result).toEqual(['testField']);
  });

  test('should handle empty fieldMap', () => {
    const result = generateFunFieldConfig({
      value: 'testField',
      rule: {},
      type: 'otherType',
      schema: { fieldMap: {} } as any
    });

    expect(result).toEqual(['testField']);
  });
});
