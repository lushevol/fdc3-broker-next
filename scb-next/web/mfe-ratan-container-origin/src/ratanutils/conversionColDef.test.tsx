import { filterArray, conversionColDef } from './conversionColDef';

describe('filterArray', () => {
  it('should return the original array if no values match', () => {
    const arr = ['a', 'b', 'c'];
    const valueIsArray = ['x', 'y', 'z'];
    expect(filterArray(arr, valueIsArray)).toEqual(['a', 'b', 'c']);
  });

  it('should return the array up to the first matching value', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const valueIsArray = ['b', 'z'];
    expect(filterArray(arr, valueIsArray)).toEqual(['a', 'b']);
  });

  it('should handle empty arrays', () => {
    const arr = [];
    const valueIsArray = ['x', 'y', 'z'];
    expect(filterArray(arr, valueIsArray)).toEqual([]);
  });
});

describe('conversionColDef', () => {
  it('should return a new array with a "Select" column and filtered columns', () => {
    const businessFields = [
      {
        indexedTerm: 'a.b.c',
        businessTerm: 'Business Term C',
      },
    ];
    const valueIsArray = ['a'];
    const expectedColDefs = [
      {
        headerName: "Select",
        filter: false,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortable: false,
        menuTabs: [],
        resizable: false,
        maxWidth: 42,
        minWidth: 42,
        hide: false,
        pinned: "left",
        lockPosition: true,
      },
      {
        enableRowGroup: true,
        headerName: 'Business Term C',
        headerTooltip: 'Business Term C',
        field: 'a.b.c',
        hide: true,
        
      },
      ];

    const colDefs = conversionColDef(businessFields, 'All', valueIsArray);
    expect(colDefs).toEqual(expectedColDefs);
  });

  it('should handle disabledView and disabledFilter', () => {
    const businessFields = [
      {
        colDefs: {
          hide: false,
          disabledFilter: true,
        },
        indexedTerm: 'field1',
        businessTerm: 'Field 1',
        disabledView: ['All'],
      },
      {
        colDefs: {
          hide: true,
          disabledFilter: false,
        },
        indexedTerm: 'field2',
        businessTerm: 'Field 2',
        disabledView: ['View1'],
      },
      {
        colDefs: {
          hide: true,
          disabledFilter: true,
        },
        indexedTerm: '',
        businessTerm: 'Field 3',
        disabledView: 'View3',
      },
    ];

    const result = conversionColDef(businessFields, 'View1');

    result[1].valueGetter({
      data: {
        field2: [],
      },
    });

    expect(result).toEqual([
      {
        headerName: 'Select',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortable: false,
        filter: false,
        menuTabs: [],
        resizable: false,
        maxWidth: 42,
        minWidth: 42,
        hide: false,
        pinned: 'left',
        lockPosition: true,
      },
      {
        headerName: 'Field 1',
        headerTooltip: 'Field 1',
        field: 'field1',
        hide: false,
        enableRowGroup: true,
        valueGetter: expect.any(Function),
      },
    ]);
  });
  it('should return an array of column definitions', () => {
    const businessFields = [
      {
        colDefs: {
          hide: false,
          disabledFilter: true,
        },
        indexedTerm: 'field1',
        businessTerm: 'Field 1',
        disabledView: ['All'],
      },
      {
        colDefs: {
          hide: false,
          disabledFilter: true,
        },
        indexedTerm: 'a.b.c',
        businessTerm: 'Field 2',
        disabledView: ['All'],
      },
      {
        colDefs: {
          hide: false,
          disabledFilter: true,
        },
        indexedTerm: 'd.e.f',
        businessTerm: 'Field 3',
        disabledView: ['All'],
      },
    ];

    const result = conversionColDef(businessFields, 'View1');

    result[1].valueGetter({
      data: {},
    });

    result[2].valueGetter({
      data: {
        a: 'value1',
        b: 'value2',
      },
    });

    expect(result).toEqual([
      {
        headerName: 'Select',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        sortable: false,
        filter: false,
        menuTabs: [],
        resizable: false,
        maxWidth: 42,
        minWidth: 42,
        hide: false,
        pinned: 'left',
        lockPosition: true,
      },
      {
        headerName: 'Field 1',
        headerTooltip: 'Field 1',
        field: 'field1',
        hide: false,
        enableRowGroup: true,
        valueGetter: expect.any(Function),
      },
      {
        headerName: 'Field 2',
        headerTooltip: 'Field 2',
        field: 'a.b.c',
        hide: false,
        enableRowGroup: true,
        valueGetter: expect.any(Function),
      },
      {
        headerName: 'Field 3',
        headerTooltip: 'Field 3',
        field: 'd.e.f',
        hide: false,
        enableRowGroup: true,
        valueGetter: expect.any(Function),
      },
    ]);
  });
});
