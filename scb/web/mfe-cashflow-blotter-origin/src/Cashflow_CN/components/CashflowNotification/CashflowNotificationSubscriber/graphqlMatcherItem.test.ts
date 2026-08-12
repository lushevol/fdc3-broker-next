import { FilterArg } from 'src/generated/types.generated';

import { graphqlMatcherItem, isDateTimeFormat,isNumberOrNumberString, isRuleType } from './graphqlMatcherItem';

describe('graphqlMatcherItem', () => {
    it('should return true for EQ operator with matching values', () => {
        expect(graphqlMatcherItem('test', { field: "", operator: 'EQ', value: 'test' })).toBe(true);
    });

    it('should return false for NE operator with matching values', () => {
        expect(graphqlMatcherItem('test', { field: "", operator: 'NE', value: 'test' })).toBe(false);
    });

    it('should return true for LIKE operator with substring match', () => {
        expect(graphqlMatcherItem('test', { field: "", operator: 'LIKE', value: 'testing' })).toBe(true);
    });

    it('should return true for BETWEEN operator with valid number range', () => {
        expect(graphqlMatcherItem(15, { field: "", operator: 'BET', value: [10, 20] })).toBe(true);
    });

    it('should return false for BETWEEN operator with value outside number range', () => {
        expect(graphqlMatcherItem(25, { field: "", operator: 'BET', value: [10, 20] })).toBe(false);
    });

    it('should return true for BETWEEN operator with valid date range', () => {
        expect(
            graphqlMatcherItem('2023-06-15', { field: "", operator: 'BET', value: ['2023-01-01', '2023-12-31'] })
        ).toBe(true);
    });

    it('should return false for BETWEEN operator with date outside range', () => {
        expect(
            graphqlMatcherItem('2024-01-01', { field: "", operator: 'BET', value: ['2023-01-01', '2023-12-31'] })
        ).toBe(false);
    });

    it('should return false for BETWEEN operator with invalid date format', () => {
        expect(
            graphqlMatcherItem('invalid-date', { field: "", operator: 'BET', value: ['2023-01-01', '2023-12-31'] })
        ).toBe(false);
    });

    it('should return false for BETWEEN operator with non-numeric value in number range', () => {
        expect(graphqlMatcherItem('abc', { field: "", operator: 'BET', value:[10, 20] })).toBe(false);
    });

    it('should return true for BETWEEN operator with valid date range', () => {
        expect(
            graphqlMatcherItem('2023-06-15', { field: "", operator: 'BET', value: ['2023-01-01', '2023-12-31'] })
        ).toBe(true);
    });

    it('should return false for BETWEEN operator with invalid number range', () => {
        expect(graphqlMatcherItem(25, { field: "", operator: 'BET', value: [10, 20] })).toBe(false);
    });

    it('should return true for ONORBEFORE operator with valid date', () => {
        expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'ONORBEFORE', value: '2023-06-15' })).toBe(true);
    });

    it('should return false for ONORLATER operator with earlier date', () => {
        expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'ONORLATER', value: '2023-06-14' })).toBe(true);
    });

    it('should return true for LTE operator with valid date comparison', () => {
      expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'LTE', value: '2023-06-16' })).toBe(true);
    });
    
    it('should return false for LTE operator with invalid date comparison', () => {
      expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'LTE', value: '2023-06-14' })).toBe(false);
    });
    
    it('should return true for LTE operator with valid number comparison', () => {
      expect(graphqlMatcherItem(10, { field: "", operator: 'LTE', value: 15 })).toBe(true);
    });
    
    it('should return false for LTE operator with invalid number comparison', () => {
      expect(graphqlMatcherItem(20, { field: "", operator: 'LTE', value: 15 })).toBe(false);
    });
    
    it('should return false for LTE operator with non-numeric value', () => {
      expect(graphqlMatcherItem('abc', { field: "", operator: 'LTE', value: 15 })).toBe(false);
    });
    
    it('should return true for GTE operator with valid date comparison', () => {
      expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'GTE', value: '2023-06-14' })).toBe(true);
    });
    
    it('should return false for GTE operator with invalid date comparison', () => {
      expect(graphqlMatcherItem('2023-06-15', { field: "", operator: 'GTE', value: '2023-06-16' })).toBe(false);
    });
    
    it('should return true for GTE operator with valid number comparison', () => {
      expect(graphqlMatcherItem(20, { field: "", operator: 'GTE', value: 15 })).toBe(true);
    });
    
    it('should return false for GTE operator with invalid number comparison', () => {
      expect(graphqlMatcherItem(10, { field: "", operator: 'GTE', value: 15 })).toBe(false);
    });
    
    it('should return false for GTE operator with non-numeric value', () => {
      expect(graphqlMatcherItem('abc', { field: "", operator: 'GTE', value: 15 })).toBe(false);
    });

    it('should return true for IN operator with matching value in array', () => {
        expect(graphqlMatcherItem('b', { field: "", operator: 'IN', value: ['a', 'b', 'c'] })).toBe(true);
    });

    it('should return false for NOTIN operator with value in array', () => {
        expect(graphqlMatcherItem('b', { field: "", operator: 'NOTIN', value: ['a', 'b', 'c'] })).toBe(false);
    });

    it('should return true for MATCH operator with regex match', () => {
        expect(graphqlMatcherItem('test123', { field: "", operator: 'MATCH', value: '\\d+' })).toBe(true);
    });

    it('should return false for unsupported operator', () => {
        expect(graphqlMatcherItem('test', { field: "", operator: 'UNKNOWN', value: 'test' })).toBe(false);
    });
});

describe('isRuleType', () => {
    it('should return true for RuleType object', () => {
        expect(isRuleType({ field: "", operator: 'EQ', value: 'test' })).toBe(true);
    });

    it('should return false for FilterArg object', () => {
        expect(isRuleType({ field: "", operator: 'EQ', values: ['test'] } as FilterArg)).toBe(false);
    });
});

describe('isNumberOrNumberString', () => {
    it('should return true for a number', () => {
        expect(isNumberOrNumberString(123)).toBe(true);
    });

    it('should return true for a numeric string', () => {
        expect(isNumberOrNumberString('123')).toBe(true);
    });

    it('should return false for a non-numeric string', () => {
        expect(isNumberOrNumberString('abc')).toBe(false);
    });
});

describe('isDateTimeFormat', () => {
    it('should return true for a valid date string', () => {
        expect(isDateTimeFormat('2023-06-15')).toBe(true);
    });

    it('should return false for an invalid date string', () => {
        expect(isDateTimeFormat('invalid-date')).toBe(false);
    });
});

describe('graphqlMatcherItem with option.isTextNumber for float numbers', () => {
    it('should return true for EQ operator with float numeric string comparison when isTextNumber is true', () => {
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'EQ', value: '123' }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('123.00', { field: "", operator: 'EQ', value: '123.0' }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('123.1', { field: "", operator: 'EQ', value: '123.10' }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for EQ operator with float numeric string comparison when isTextNumber is true and values do not match', () => {
        expect(graphqlMatcherItem('123.1', { field: "", operator: 'EQ', value: '123.2' }, { isTextNumber: true })).toBe(false);
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'EQ', value: '124.0' }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for NE operator with float numeric string comparison when isTextNumber is true', () => {
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'NE', value: '124.0' }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('123.1', { field: "", operator: 'NE', value: '123.2' }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for NE operator with float numeric string comparison when isTextNumber is true and values match', () => {
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'NE', value: '123' }, { isTextNumber: true })).toBe(false);
        expect(graphqlMatcherItem('123.10', { field: "", operator: 'NE', value: '123.1' }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for BETWEEN operator with float numeric string range when isTextNumber is true', () => {
        expect(graphqlMatcherItem('15.5', { field: "", operator: 'BET', value: ['10.0', '20.0'] }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('10.0', { field: "", operator: 'BET', value: ['10.0', '20.0'] }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('20.0', { field: "", operator: 'BET', value: ['10.0', '20.0'] }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for BETWEEN operator with float numeric string range when isTextNumber is true and value is outside range', () => {
        expect(graphqlMatcherItem('25.0', { field: "", operator: 'BET', value: ['10.0', '20.0'] }, { isTextNumber: true })).toBe(false);
        expect(graphqlMatcherItem('9.9', { field: "", operator: 'BET', value: ['10.0', '20.0'] }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for LTE operator with float numeric string comparison when isTextNumber is true', () => {
        expect(graphqlMatcherItem('10.0', { field: "", operator: 'LTE', value: '15.0' }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('15.0', { field: "", operator: 'LTE', value: '15.0' }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for LTE operator with float numeric string comparison when isTextNumber is true and value is greater', () => {
        expect(graphqlMatcherItem('20.0', { field: "", operator: 'LTE', value: '15.0' }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for GTE operator with float numeric string comparison when isTextNumber is true', () => {
        expect(graphqlMatcherItem('20.0', { field: "", operator: 'GTE', value: '15.0' }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('15.0', { field: "", operator: 'GTE', value: '15.0' }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for GTE operator with float numeric string comparison when isTextNumber is true and value is smaller', () => {
        expect(graphqlMatcherItem('10.0', { field: "", operator: 'GTE', value: '15.0' }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for IN operator with float numeric string array when isTextNumber is true and value matches', () => {
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'IN', value: ['123.0', '456.0'] }, { isTextNumber: true })).toBe(true);
        expect(graphqlMatcherItem('456.00', { field: "", operator: 'IN', value: ['123.0', '456.0'] }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for IN operator with float numeric string array when isTextNumber is true and value does not match', () => {
        expect(graphqlMatcherItem('789.0', { field: "", operator: 'IN', value: ['123.0', '456.0'] }, { isTextNumber: true })).toBe(false);
    });

    it('should return true for NOTIN operator with float numeric string array when isTextNumber is true and value does not match', () => {
        expect(graphqlMatcherItem('789.0', { field: "", operator: 'NOTIN', value: ['123.0', '456.0'] }, { isTextNumber: true })).toBe(true);
    });

    it('should return false for NOTIN operator with float numeric string array when isTextNumber is true and value matches', () => {
        expect(graphqlMatcherItem('123.0', { field: "", operator: 'NOTIN', value: ['123.0', '456.0'] }, { isTextNumber: true })).toBe(false);
    });
});
