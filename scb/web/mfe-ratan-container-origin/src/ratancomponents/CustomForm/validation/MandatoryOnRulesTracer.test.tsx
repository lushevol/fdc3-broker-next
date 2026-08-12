import MandatoryOnRulesTracer from './MandatoryOnRulesTracer';

const mockNewOnChangeObj = {};
const mockSubSubItem = { field: 'mockField' };
const mockSetOnChangeFun = jest.fn();
const mockIsRequiredObj = {};
const mockItem = { field: 'mockItemField' };
const mockRuleId = 'mockRuleId';
const mockSet = jest.fn();
const mockForm = {
  getFieldValue: jest.fn(),
};

MandatoryOnRulesTracer({
  newOnChangeObj: mockNewOnChangeObj,
  subSubItem: mockSubSubItem,
  setOnChangeFun: mockSetOnChangeFun,
  isRequiredObj: mockIsRequiredObj,
  item: mockItem,
  ruleId: mockRuleId,
  set: mockSet,
  form: mockForm,
});

describe('MandatoryOnRulesTracer', () => {
  it('should call setOnChangeFun immediately with the given parameters and undefined as the last argument', () => {
    expect(mockSetOnChangeFun).toHaveBeenCalledTimes(1);
    
    const callArgs = mockSetOnChangeFun.mock.calls[0];
    expect(callArgs).toHaveLength(7);
    expect(callArgs[0]).toBe(mockSubSubItem);
    expect(callArgs[1]).toBe(mockIsRequiredObj);
    expect(callArgs[2]).toBe(mockItem.field);
    expect(callArgs[3]).toBe(mockRuleId);
    expect(callArgs[4]).toBe(mockSet);
    expect(callArgs[5]).toBe(mockForm);
    expect(callArgs[6]).toBe(undefined);
  });
});