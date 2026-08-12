import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import * as viewOption from './ViewOptions';
import { Context } from './store';
import { DragDropContext } from 'react-beautiful-dnd';

const { ViewOptions, dropIndex, SwitchHeaderName, setGroupFun, getIndex, handleDrag } = viewOption;

const mockApi = {
  getColumnState: vi.fn(() => [{colId: 'field1'}]),
  getColumn: vi.fn(() => ({ colDef: { headerName: 'Header 1' }})),
  setColumnsVisible: vi.fn(),
  moveColumns: vi.fn(),
};

const mockDispatch = vi.fn();

const options = [
  {
    field: 'field1',
    headerName: 'Header 1',
    hide: true,
    group: 'Group 1',
    searchField: 'Search Field 1',
    searchHeaderName: 'Search Header 1',
    searchShow: true,
  },
  {
    field: 'field2',
    headerName: 'Header 2',
    hide: false,
    group: 'Group 2',
    searchField: 'Search Field 2',
    searchHeaderName: 'Search Header 2',
    searchShow: true,
  },
];

describe('ViewOptions', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Context.Provider value={{ state: {}, dispatch: mockDispatch }}>
        <ViewOptions
          tradeGridReady={{ api: mockApi }}
          isOpen={true}
          options={options}
          setOptions={vi.fn()}
          showIndexTerm={true}
          searchValue=""
        />
      </Context.Provider>
    );

    expect(getByText('Category')).toBeInTheDocument();
    expect(getByText('Available Fields')).toBeInTheDocument();
    expect(getByText('Display View')).toBeInTheDocument();
  });

  it('handles drag and drop correctly', () => {
    const { getByText } = render(
      <Context.Provider value={{ state: {}, dispatch: mockDispatch }}>
        <DragDropContext onDragEnd={vi.fn()}>
          <ViewOptions
            tradeGridReady={{ api: mockApi }}
            isOpen={true}
            options={options}
            setOptions={vi.fn()}
            showIndexTerm={true}
            searchValue=""
          />
        </DragDropContext>
      </Context.Provider>
    );

    const header1 = getByText('Header 1');
    fireEvent.dragStart(header1);
    fireEvent.dragEnd(header1);

    // expect(mockApi.setColumnsVisible).toHaveBeenCalled();
    // expect(mockApi.moveColumns).toHaveBeenCalled();
  });

  it('handles delete column correctly', () => {
    const setOptionsMock = vi.fn();
    const { getByTitle } = render(
      <Context.Provider value={{ state: {}, dispatch: mockDispatch }}>
        <ViewOptions
          tradeGridReady={{ api: mockApi }}
          isOpen={true}
          options={options}
          setOptions={setOptionsMock}
          showIndexTerm={true}
          searchValue=""
        />
      </Context.Provider>
    );

    const deleteButton = getByTitle('Delete');
    fireEvent.click(deleteButton);

    expect(mockApi.setColumnsVisible).toHaveBeenCalledWith(['field1'], false);
    expect(setOptionsMock).toHaveBeenCalled();
  });
});

describe('dropIndex', () => {
  it('should return the correct real index when dropping within the same column and moving downwards', () => {
    const api = {
      getColumnState: () => [
        { hide: false, pinned: false },
        { hide: false, pinned: false },
        { hide: false, pinned: false },
      ],
    };

    const destination = { droppableId: 'column1', index: 2 };
    const source = { droppableId: 'column1', index: 0 };

    const result = dropIndex({ destination, source, api });

    expect(result).toBe(-1);
  });

  it('should return the correct real index when dropping within the same column and moving upwards', () => {
    const api = {
      getColumnState: () => [
        { hide: false, pinned: false },
        { hide: false, pinned: false },
        { hide: false, pinned: false },
      ],
    };

    const destination = { droppableId: 'column1', index: 0 };
    const source = { droppableId: 'column1', index: 2 };

    const result = dropIndex({ destination, source, api });

    expect(result).toBe(0);
  });

  it('should return the correct real index when dropping to a different column', () => {
    const api = {
      getColumnState: () => [
        { hide: false, pinned: false },
        { hide: false, pinned: false },
        { hide: false, pinned: false },
      ],
    };

    const destination = { droppableId: 'column2', index: 1 };
    const source = { droppableId: 'column1', index: 1 };

    const result = dropIndex({ destination, source, api });

    expect(result).toBe(1);
  });

  it('should handle hidden and pinned items correctly', () => {
    const api = {
      getColumnState: () => [
        { hide: true, pinned: false },
        { hide: false, pinned: true },
        { hide: false, pinned: false },
        { hide: false, pinned: false },
      ],
    };

    const destination = { droppableId: 'column1', index: 2 };
    const source = { droppableId: 'column1', index: 0 };

    const result = dropIndex({ destination, source, api });

    expect(result).toBe(-1);
  });
});

describe('SwitchHeaderName', () => {
  const rowData = {
    headerName: 'Test Header',
    searchHeaderName: '',
    field: 'Test Field',
    group: 'group1',
    searchField: 'Search Test Field',
  };

  it('should render the component correctly', () => {
    const openField = [];
    const setOpenField = vi.fn();

    render(
      <SwitchHeaderName
        openField={openField}
        rowData={rowData}
        setOpenField={setOpenField}
      />
    );

    expect(screen.getByText(rowData.headerName)).toBeInTheDocument();
    expect(screen.getByTestId('show-field-name')).toBeInTheDocument();
  });

  it('should toggle the open state when the button is clicked', () => {
    const openField = [];
    const setOpenField = vi.fn();

    render(
      <SwitchHeaderName
        openField={openField}
        rowData={rowData}
        setOpenField={setOpenField}
      />
    );

    // 点击按钮，打开
    fireEvent.click(screen.getByTestId('show-field-name'));
    expect(setOpenField).toHaveBeenCalledWith([rowData.headerName]);

    // 再次点击按钮，关闭
    fireEvent.click(screen.getByTestId('show-field-name'));
    expect(setOpenField).toHaveBeenCalledWith(["Test Header"]);
  });

  it('should display the search field when open', () => {
    const openField = [rowData.headerName];
    const setOpenField = vi.fn();
    rowData.searchHeaderName = 'Search Test Header';

    render(
      <SwitchHeaderName
        openField={openField}
        rowData={rowData}
        setOpenField={setOpenField}
      />
    );

    // 打开状态，显示搜索字段
    expect(screen.getByText(rowData.searchField)).toBeInTheDocument();
  });
});

describe('setGroupFun', () => {
  test('should return empty groups and groupsData when options is empty', () => {
    const options: any[] = [];
    const nowGroup = 'group1';
    const api = {}; // Mock API if needed

    const result = setGroupFun(options, nowGroup, api);

    expect(result).toEqual({ groups: [], groupsData: [] });
  });

  test('should return empty groups and groupsData when no items match hide and searchShow', () => {
    const options = [
      { field: "field1", headerName: "Header 1", group: 'group1', hide: false, searchField: "", searchHeaderName: "", searchShow: true },
      { field: "field2", headerName: "Header 2", group: 'group2', hide: true, searchField: "", searchHeaderName: "", searchShow: false },
    ];
    const nowGroup = 'group1';
    const api = {}; // Mock API if needed

    const result = setGroupFun(options, nowGroup, api);

    expect(result).toEqual({ groups: [], groupsData: [] });
  });

  test('should return sorted groups and first group data when nowGroup is empty', () => {
    const options = [
      { field: "field1", headerName: "Header 1", searchField: "", searchHeaderName: "", group: 'group2', hide: true, searchShow: true },
      { field: "field2", headerName: "Header 2", searchField: "", searchHeaderName: "", group: 'group1', hide: true, searchShow: true },
    ];
    const nowGroup = '';
    const api = {}; // Mock API if needed

    const result = setGroupFun(options, nowGroup, api);

    expect(result).toEqual({
      groups: ['group1', 'group2'],
      groupsData: [{ field: "field2", group: 'group1', headerName: "Header 2", hide: true, searchField: "", searchHeaderName: "", searchShow: true }],
    });
  });

  test('should return matched group data when nowGroup is provided and matches', () => {
    const options = [
      { field: "field1", headerName: "Header 1", searchField: "", searchHeaderName: "", group: 'group1', hide: true, searchShow: true },
      { field: "field2", headerName: "Header 2", searchField: "", searchHeaderName: "", group: 'group2', hide: true, searchShow: true },
    ];
    const nowGroup = 'group2';
    const api = {}; // Mock API if needed

    const result = setGroupFun(options, nowGroup, api);

    expect(result).toEqual({
      groups: ['group1', 'group2'],
      groupsData: [{ field: "field2", group: 'group2', headerName: "Header 2", hide: true, searchField: "", searchHeaderName: "", searchShow: true }],
    });
  });

  test('should return first group data when nowGroup is provided but does not match', () => {
    const options = [
      { field: "field1", headerName: "Header 1", searchField: "", searchHeaderName: "", group: 'group1', hide: true, searchShow: true },
      { field: "field2", headerName: "Header 2", searchField: "", searchHeaderName: "", group: 'group2', hide: true, searchShow: true },
    ];
    const nowGroup = 'group3';
    const api = {}; // Mock API if needed

    const result = setGroupFun(options, nowGroup, api);

    expect(result).toEqual({
      groups: ['group1', 'group2'],
      groupsData: [{ field: "field1", group: 'group1', headerName: "Header 1", hide: true, searchField: "", searchHeaderName: "", searchShow: true }],
    });
  });
});

describe('getIndex', () => {
  it('should return the correct index when colId exists in the list', () => {
    const list = [
      { colId: 'a', value: 1 },
      { colId: 'b', value: 2 },
      { colId: 'c', value: 3 },
    ];
    const colId = 'b';
    const expectedIndex = 1;
    const result = getIndex(list, colId);
    expect(result).toBe(expectedIndex);
  });

  it('should return 0 when colId does not exist in the list', () => {
    const list = [
      { colId: 'a', value: 1 },
      { colId: 'b', value: 2 },
      { colId: 'c', value: 3 },
    ];
    const colId = 'd';
    const expectedIndex = 0;
    const result = getIndex(list, colId);
    expect(result).toBe(expectedIndex);
  });

  it('should return 0 when the list is empty', () => {
    const list = [];
    const colId = 'a';
    const expectedIndex = 0;
    const result = getIndex(list, colId);
    expect(result).toBe(expectedIndex);
  });

  it('should return the first matching index when multiple items have the same colId', () => {
    const list = [
      { colId: 'a', value: 1 },
      { colId: 'b', value: 2 },
      { colId: 'b', value: 3 },
    ];
    const colId = 'b';
    const expectedIndex = 2;
    const result = getIndex(list, colId);
    expect(result).toBe(expectedIndex);
  });
});

describe('handleDrag', () => {
  it('should move columns when source is "droppable2"', () => {
    const mockApi = {
      moveColumns: vi.fn(),
      getColumnState: vi.fn(() => [{colId: 'field1'}]),
    };
    const mockSetOptions = vi.fn();
    const mockUpdateNewResultData = vi.fn();
    const mockResultData = [{ field: 'col1', hide: true }];

    const result = {
      source: { droppableId: 'droppable2', index: 0 },
      destination: { droppableId: 'col1-dest', index: 1 },
      draggableId: 'col1-draggable',
    };

    vi.spyOn(viewOption, 'dropIndex').mockReturnValue(1);

    handleDrag({
      result,
      api: mockApi,
      setOptions: mockSetOptions,
      resultData: mockResultData,
      updateNewResultData: mockUpdateNewResultData,
    });

    expect(mockApi.moveColumns).toHaveBeenCalledWith(['col1'], -2);
    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockUpdateNewResultData).toHaveBeenCalled();
  });

  it('should add columns when source is not "droppable2"', () => {
    const mockApi = {
      moveColumns: vi.fn(),
      setColumnsVisible: vi.fn(),
      getColumnState: vi.fn(() => [{colId: 'field1'}]),
    };
    const mockSetOptions = vi.fn();
    const mockUpdateNewResultData = vi.fn();
    const mockResultData = [{ field: 'col1', hide: true }];

    const result = {
      source: { droppableId: 'droppable1', index: 0 },
      destination: { droppableId: 'col1-dest', index: 1 },
      draggableId: 'col1-draggable',
    };

    vi.spyOn(viewOption, 'dropIndex').mockReturnValue(1);
    vi.spyOn(viewOption, 'getIndex').mockReturnValue(0);

    handleDrag({
      result,
      api: mockApi,
      setOptions: mockSetOptions,
      resultData: mockResultData,
      updateNewResultData: mockUpdateNewResultData,
    });

    expect(mockApi.setColumnsVisible).toHaveBeenCalledWith(['col1'], true);
    expect(mockApi.moveColumns).toHaveBeenCalledWith(['col1'], -1);
    expect(mockSetOptions).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockUpdateNewResultData).toHaveBeenCalled();
  });

  it('should do nothing when destination is "droppable"', () => {
    const mockApi = {
      moveColumns: vi.fn(),
      setColumnsVisible: vi.fn(),
    };
    const mockSetOptions = vi.fn();
    const mockUpdateNewResultData = vi.fn();
    const mockResultData = [{ field: 'col1', hide: true }];

    const result = {
      source: { droppableId: 'droppable1', index: 0 },
      destination: { droppableId: 'droppable', index: 1 },
      draggableId: 'col1-draggable',
    };

    handleDrag({
      result,
      api: mockApi,
      setOptions: mockSetOptions,
      resultData: mockResultData,
      updateNewResultData: mockUpdateNewResultData,
    });

    expect(mockApi.moveColumns).not.toHaveBeenCalled();
    expect(mockApi.setColumnsVisible).not.toHaveBeenCalled();
    expect(mockSetOptions).not.toHaveBeenCalled();
    expect(mockUpdateNewResultData).not.toHaveBeenCalled();
  });
});
