import { renderHook } from "@testing-library/react";
import type {
  Field
} from "react-querybuilder";
import { initialQuery } from "./export";
import { filterFieldType, isDateTimeFamily, useMode } from "./mode";
import {
    RuleFunctionConfig,
  } from "../RatanOne/type";

describe("React Query Builder Mode", () => {
    it("simple mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "simple",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[]
        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeDefined();
    });
    it("group mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "group",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[]
        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeUndefined();
    });
    it("search mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "search",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[]

        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeDefined();
    });
    it("group-l1-and-no-l3 mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "group-l1-and-no-l3",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[],
        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeUndefined();
    });
    it("group-l1-and mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "group-l1-and",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[]

        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeUndefined();
    });
    it("drools-rule mode", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "drools-rule",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: false,
            functionConfig: [] as RuleFunctionConfig[]
        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeUndefined();
    });
    it("drools-rule mode enableFn", () => {
        const fields = [];
        const { result } = renderHook(() => useMode({ 
            mode: "drools-rule",
            fields,
            allowDuplicateField: true,
            query: initialQuery,
            enableFn: true,
            functionConfig: [] as RuleFunctionConfig[]
        }));
        const { queryBuilderProps } = result.current;
        expect(queryBuilderProps.combinators).toBeUndefined();
    });
});

describe('isDateTimeFamily', () => {
  it('should return true for valid date-time family types', () => {
    expect(isDateTimeFamily('date')).toBe(true);
    expect(isDateTimeFamily('datetime')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isDateTimeFamily('string')).toBe(false);
    expect(isDateTimeFamily('number')).toBe(false);
    expect(isDateTimeFamily('boolean')).toBe(false);
    expect(isDateTimeFamily('object')).toBe(false);
  });

  it('should return false for edge cases', () => {
    expect(isDateTimeFamily(null)).toBe(false);
    expect(isDateTimeFamily(undefined)).toBe(false);
    expect(isDateTimeFamily('')).toBe(false);
  });
});

describe('isDateTimeFamily', () => {
  it('should return true for valid date-time family types', () => {
    expect(isDateTimeFamily('date')).toBe(true);
    expect(isDateTimeFamily('datetime')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isDateTimeFamily('string')).toBe(false);
    expect(isDateTimeFamily('number')).toBe(false);
    expect(isDateTimeFamily('boolean')).toBe(false);
    expect(isDateTimeFamily('object')).toBe(false);
  });

  it('should return false for edge cases', () => {
    expect(isDateTimeFamily(null)).toBe(false);
    expect(isDateTimeFamily(undefined)).toBe(false);
    expect(isDateTimeFamily('')).toBe(false);
  });
});

describe('isDateTimeFamily', () => {
  it('should return true for valid date-time family types', () => {
    expect(isDateTimeFamily('date')).toBe(true);
    expect(isDateTimeFamily('datetime')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isDateTimeFamily('string')).toBe(false);
    expect(isDateTimeFamily('number')).toBe(false);
    expect(isDateTimeFamily('boolean')).toBe(false);
    expect(isDateTimeFamily('object')).toBe(false);
  });

  it('should return false for edge cases', () => {
    expect(isDateTimeFamily(null)).toBe(false);
    expect(isDateTimeFamily(undefined)).toBe(false);
    expect(isDateTimeFamily('')).toBe(false);
  });
});

describe('isDateTimeFamily', () => {
  it('should return true for valid date-time family types', () => {
    expect(isDateTimeFamily('date')).toBe(true);
    expect(isDateTimeFamily('datetime')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isDateTimeFamily('string')).toBe(false);
    expect(isDateTimeFamily('number')).toBe(false);
    expect(isDateTimeFamily('boolean')).toBe(false);
    expect(isDateTimeFamily('object')).toBe(false);
  });

  it('should return false for edge cases', () => {
    expect(isDateTimeFamily(null)).toBe(false);
    expect(isDateTimeFamily(undefined)).toBe(false);
    expect(isDateTimeFamily('')).toBe(false);
  });
});

describe('isDateTimeFamily', () => {
  it('should return true for valid date-time family types', () => {
    expect(isDateTimeFamily('date')).toBe(true);
    expect(isDateTimeFamily('datetime')).toBe(true);
  });

  it('should return false for invalid types', () => {
    expect(isDateTimeFamily('string')).toBe(false);
    expect(isDateTimeFamily('number')).toBe(false);
    expect(isDateTimeFamily('boolean')).toBe(false);
    expect(isDateTimeFamily('object')).toBe(false);
  });

  it('should return false for edge cases', () => {
    expect(isDateTimeFamily(null)).toBe(false);
    expect(isDateTimeFamily(undefined)).toBe(false);
    expect(isDateTimeFamily('')).toBe(false);
  });
});

describe('filterFieldType', () => {
  const fields: Field[] = [
    { inputType: 'date', name: 'dateField', label: 'Date Field' },
    { inputType: 'datetime', name: 'datetimeField', label: 'DateTime Field' },
    { inputType: 'time', name: 'timeField', label: 'Time Field' },
    { inputType: 'datetime-local', name: 'datetimeLocalField', label: 'DateTime-Local Field' },
    { inputType: 'string', name: 'stringField', label: 'String Field' },
    { inputType: 'number', name: 'numberField', label: 'Number Field' },
  ];

  it('should return fields with exact inputType match', () => {
    const result = filterFieldType(fields, 'string');
    expect(result).toEqual([{ inputType: 'string', name: 'stringField', label: 'String Field' }]);
  });

  it('should return all date/time family fields when newType is date', () => {
    const result = filterFieldType(fields, 'date');
    expect(result).toEqual([
      { inputType: 'date', name: 'dateField', label: 'Date Field' },
      { inputType: 'datetime', name: 'datetimeField', label: 'DateTime Field' },
    ]);
  });

  it('should return all date/time family fields when newType is time', () => {
    const result = filterFieldType(fields, 'time');
    expect(result).toEqual([
      { inputType: 'time', name: 'timeField', label: 'Time Field' },
    ]);
  });

  it('should return only number field when newType is number', () => {
    const result = filterFieldType(fields, 'number');
    expect(result).toEqual([{ inputType: 'number', name: 'numberField', label: 'Number Field' }]);
  });

  it('should return empty array when no match', () => {
    const result = filterFieldType(fields, 'boolean');
    expect(result).toEqual([]);
  });

  it('should handle empty fields array', () => {
    const result = filterFieldType([], 'date');
    expect(result).toEqual([]);
  });
});