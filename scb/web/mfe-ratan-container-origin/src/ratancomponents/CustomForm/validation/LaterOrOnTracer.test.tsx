import LaterOrOnTracer from './LaterOrOnTracer';

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

describe('LaterOrOnTracer', () => {
  it('should resolve if the date is later or on the same day', async () => {
    const validator = LaterOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2023-01-02')).resolves.toBeUndefined();
  });

  it('should reject if the date is ealier', async () => {
    const validator = LaterOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2022-12-31')).rejects.toThrowError(mockSubItem.errorMsg);
  });

  it('should resolve if all dates are the same', async () => {
    const validator = LaterOrOnTracer(mockGetFieldValue, mockSubItem, mockConvertValue).validator;
    await expect(validator({}, '2023-01-02')).resolves.toBeUndefined();
  });

});