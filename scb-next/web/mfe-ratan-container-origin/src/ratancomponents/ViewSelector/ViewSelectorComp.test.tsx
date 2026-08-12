
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewSelectorComp, { handleCurrentView } from './ViewSelectorComp';
import { Context, defaultState } from './store';
import MfeThemeProvider from '../../Root/component/MfeThemeProvider';
import * as componentEnabling from '../../ratanutils/componentEnabling';

const list = {testType: [
  {
      "rowKey": "e971f4ad-519d-4a6f-b33d-722e0004bdb1",
      "name": "tewt2",
      "body": "[{\"colId\":\"ag-Grid-ControlsColumn\"}]",
      "creator": "1376592",
      "type": "testType",
      "isPublic": false,
      "moduleOwner": null,
      "assignee": null,
      "assigneeList": null
  },
  {
      "rowKey": "9d153670-7397-42eb-ba56-bdcd12abeaff",
      "name": "3355",
      "body": "[{\"colId\":\"ag-Grid-ControlsColumn\"}]",
      "creator": "1376592",
      "type": "testType",
      "isPublic": false,
      "moduleOwner": "FMO_MO_TV",
      "assignee": null,
      "assigneeList": "FMO_MO_TV"
  }
]}
const mockGetViews = vi.fn(() => Promise.resolve(list));
const mockGetView = vi.fn(() => Promise.resolve(list));
const mockRemoveView = vi.fn();
const mockUseViewName = vi.fn();
const mockUseBatchCollect = vi.fn(() => ({
  startTracking: vi.fn(() => () => {}),
}));
const api: any = {
  resetColumnState: vi.fn(),
  getAllDisplayedColumns: vi.fn(() => [{ colId: 'testColId' }]),
  getColumnState: vi.fn(() => [{ colId: 'testColId' }]),
  getColumnStates: vi.fn(() => [{ colId: 'testColId' }]),
  getColumn: vi.fn(() => ({ colDef: { headerName: 'testColId' } })),
  applyColumnState: vi.fn(),
}

vi.mock('./store', async () => ({
  ...(await vi.importActual('./store')),
  getViews: () => mockGetViews(),
  getView: () => mockGetView(),
  removeView: () => mockRemoveView(),
}));

vi.mock('./useViewName', async () => ({ default: () => mockUseViewName() }));
vi.mock('../../packages/Analysis', async () => ({
  useBatchCollect: () => mockUseBatchCollect(),
}));

describe('ViewSelectorComp', () => {
  const renderComponent = (props = {}) => {
    return render(
      <MfeThemeProvider>
        <Context.Provider value={{ state: {...defaultState, currentView: { rowKey: 'testKey'} }, dispatch: vi.fn() }}>
          <ViewSelectorComp
            tradeGridReady={{ api }}
            viewFieldType="testType"
            viewOptions={[]}
            {...props}
          />
        </Context.Provider>
      </MfeThemeProvider>
    );
  };

  it('not ready', () => {
    render(
      <MfeThemeProvider>
        <Context.Provider value={{ state: {...defaultState, currentView: { rowKey: 'testKey'} }, dispatch: vi.fn() }}>
          <ViewSelectorComp
            viewFieldType="testType"
            viewOptions={[]}
          />
        </Context.Provider>
      </MfeThemeProvider>
    );
  })

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Views')).toBeInTheDocument();
  });

  it('displays the select dropdown', () => {
    renderComponent();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('calls getViews on mount', async () => {
    mockGetViews.mockResolvedValueOnce(list);
    renderComponent();
    await waitFor(() => expect(mockGetViews).toHaveBeenCalled());
  });

  it('handles clear button click', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('customView-clear-btn'));
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('handles create or modify button click', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('customView-create-modify-btn'));
    expect(screen.getByText('Create or Modify')).toBeInTheDocument();
  });

  it('handles view selection', async () => {
    const props = { name: 'testName', onSelectName: vi.fn(), setNameList: vi.fn(), onChangedView: vi.fn() };
    renderComponent(props);
    const select = screen.getByTestId('selectView');
    fireEvent.mouseDown(select.firstElementChild as Element);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByRole('option')[0]);
    expect(mockGetView).toHaveBeenCalled();
  });

  it('handles view selection', async () => {
    vi.mocked(mockGetView).mockImplementation(() => Promise.reject({ message: 'JSON'}))
    const props = { name: 'testName', onSelectName: vi.fn(), setNameList: vi.fn(), onChangedView: vi.fn() };
    renderComponent(props);
    const select = screen.getByTestId('selectView');
    fireEvent.mouseDown(select.firstElementChild as Element);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByRole('option')[0]);
    expect(mockGetView).toHaveBeenCalled();
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    const closeBtn = screen.getByTestId('dialog-close');
    fireEvent.click(closeBtn);
  });

  it('generates different options based on role', async () => {
    vi.spyOn(componentEnabling, 'getEnable').mockReturnValue(false);
    renderComponent();
    await waitFor(() => expect(mockGetViews).toHaveBeenCalled());
    expect(screen.getByTestId('selectView')).toBeInTheDocument();
  });
});

describe('handleCurrentView', () => {
  let mockChangeViewName;
  let mockClear;
  let mockOnSelectName;

  beforeEach(() => {
    mockChangeViewName = vi.fn();
    mockClear = vi.fn();
    mockOnSelectName = vi.fn();
  });

  it('should change view name and call clear when currentView is provided and name is empty', () => {
    const currentView = { name: '' };
    const name = 'someName';
    const selectedViewName = { changeViewName: mockChangeViewName };
    const clear = mockClear;
    const onSelectName = mockOnSelectName;

    handleCurrentView(currentView, name, selectedViewName, clear, onSelectName);

    expect(mockChangeViewName).toHaveBeenCalledWith('');
    expect(mockClear).toHaveBeenCalledWith(true);
    expect(mockOnSelectName).toHaveBeenCalled();
  });

  it('should change view name and not call clear when currentView is provided and name is not empty', () => {
    const currentView = { name: 'viewName' };
    const name = 'someName';
    const selectedViewName = { changeViewName: mockChangeViewName };
    const clear = mockClear;
    const onSelectName = mockOnSelectName;

    handleCurrentView(currentView, name, selectedViewName, clear, onSelectName);

    expect(mockChangeViewName).toHaveBeenCalledWith('viewName');
    expect(mockClear).not.toHaveBeenCalled();
    expect(mockOnSelectName).toHaveBeenCalledWith('viewName');
  });

  it('should not change view name or call clear when currentView is not provided', () => {
    const currentView = null;
    const name = 'someName';
    const selectedViewName = { changeViewName: mockChangeViewName };
    const clear = mockClear;
    const onSelectName = mockOnSelectName;

    handleCurrentView(currentView, name, selectedViewName, clear, onSelectName);

    expect(mockChangeViewName).not.toHaveBeenCalled();
    expect(mockClear).not.toHaveBeenCalled();
    expect(mockOnSelectName).not.toHaveBeenCalled();
  });

  it('should call onSelectName when currentView name is different from provided name', () => {
    const currentView = { name: 'newViewName' };
    const name = 'someName';
    const selectedViewName = { changeViewName: mockChangeViewName };
    const clear = mockClear;
    const onSelectName = mockOnSelectName;

    handleCurrentView(currentView, name, selectedViewName, clear, onSelectName);

    expect(mockChangeViewName).toHaveBeenCalledWith('newViewName');
    expect(mockClear).not.toHaveBeenCalled();
    expect(mockOnSelectName).toHaveBeenCalledWith('newViewName');
  });

  it('should not call onSelectName when currentView name is same from provided name', () => {
    const currentView = { name: 'newViewName' };
    const name = 'newViewName';
    const selectedViewName = { changeViewName: mockChangeViewName };
    const clear = mockClear;
    const onSelectName = mockOnSelectName;

    handleCurrentView(currentView, name, selectedViewName, clear, onSelectName);

    expect(mockChangeViewName).toHaveBeenCalledWith('newViewName');
    expect(mockClear).not.toHaveBeenCalled();
    expect(mockOnSelectName).not.toHaveBeenCalledWith('newViewName');
  });
});
