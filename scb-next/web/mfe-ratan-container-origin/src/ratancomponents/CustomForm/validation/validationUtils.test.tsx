import {convertValue,setOnChangeFun } from './validationUtils';


describe('validationUtils', () => {

  it('should update isRequiredObj and reset form field', () => {
    const subSubItem = {
      rules: [
        { name: "RegExp", value: "^[a-zA-Z]+$" },
        { name: "Length", value: "5" },
      ],
    };
    const isRequiredObj = {testField:{ruleId:123}};
    const field = "testField";
    const ruleId = 1;
    const value = "test";
    const mockSet= vi.fn();
    const mockForm = {
        getFieldsValue: vi.fn(()=>{
          return {};
        }),
        resetFields: vi.fn(),
        setFieldsValue: vi.fn()
    };

    setOnChangeFun(subSubItem, isRequiredObj, field, ruleId, mockSet, mockForm, value);

    expect(convertValue(value)).toEqual(value);
    expect(convertValue(false)).toEqual("N")
    expect(convertValue(true)).toEqual("Y")
    expect(mockSet).toHaveBeenCalledWith(field, {
      1: {
        '^[a-zA-Z]+$5': true,
      },
      ruleId: 123,
    });
  });

  it('should handle failed regex validation', () => {
    const subSubItem = {
      rules: [
        { name: "RegExp", value: "^[0-9]+$" },
      ],
    };
    const isRequiredObj = {};
    const field = "testField";
    const ruleId = 1;
    const value = false;
    const mockSet= vi.fn();
    const mockForm = {
        getFieldsValue: vi.fn(()=>{
          return {};
        }),
        resetFields: vi.fn(),
        setFieldsValue: vi.fn()
    };

    setOnChangeFun(subSubItem, isRequiredObj, field, ruleId, mockSet, mockForm, value);
  });
});