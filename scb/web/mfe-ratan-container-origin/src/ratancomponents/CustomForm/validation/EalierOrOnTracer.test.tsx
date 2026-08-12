import EalierOrOnTracer from './EalierOrOnTracer';

const mockGetFieldValue = (fieldName) => {
  if (fieldName === 'field1') return '2023-01-01';
  if (fieldName === 'field2') return '2022-12-31';
  return null;
};

const mockConvertValue = (value) => {
  return new Date(value);
};

const mockSubItem = {
  value: {
    fields: [
      { field: 'field1' },
      { field: 'field2' },
    ],
  },
  errorMsg: 'mock error',
};

describe('EalierOrOnTracer', () => {
  it('should resolve if the date is earlier or on the same day', async () => {
    const validator = EalierOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2022-12-31')).resolves.toBeUndefined();
  });

  it('should reject if the date is later', async () => {
    const validator = EalierOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2023-01-02')).rejects.toThrowError(mockSubItem.errorMsg);
  });

  it('should resolve if all dates are the same', async () => {
    const validator = EalierOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2022-12-31')).resolves.toBeUndefined();
  });

  it('should handle null or invalid dates gracefully', async () => {
    const invalidDateValidator = EalierOrOnTracer(
      (fieldName) => (fieldName === 'field1' ? 'invalid-date' : mockGetFieldValue(fieldName)),
      mockSubItem,
      mockConvertValue
    ).validator;

    await expect(invalidDateValidator({}, '2023-01-01')).rejects.toThrowError(mockSubItem.errorMsg);
  });

});