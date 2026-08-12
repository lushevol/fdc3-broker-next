import { renderHook, act } from '@testing-library/react';
import useViewNameController from './useViewNameController';
import { Context } from '../store';

vi.mock("../../../ratanutils/authenticator", () => {
    return {
      __esModule: true,
      hasPrivatePermission: ()=>true,
      hasPublicPermission: ()=>true,
      getUser:()=>({
        id: "1234567",
        entitlements: ["TEST_TILE:Test_Entitlement_Code"],
      }),
    };
  });

const mockMessageApi = {
  success: vi.fn(),
  error: vi.fn(),
};

const mockProps = {
  viewFieldType: 'testType',
  tradeGridReady: {
    api: {
      getColumnState: vi.fn(() => ({})),
    },
  },
};

const mockState = {
  currentView: {
    rowKey: '123',
    name: 'OldName',
    isPublic: true,
    body: {},
  },
  viewList: {
    testType: [
      { name: 'ExistingName'},
    ],
  },
};

describe('useViewNameController', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = ({ children }) => (
      <Context.Provider value={{ state: mockState, dispatch: vi.fn() }}>
        {children}
      </Context.Provider>
    );
  });

  it('should save a new view when newName is unique', async () => {
    const { result } = renderHook(() => useViewNameController(mockProps, mockMessageApi), { wrapper });

    act(() => {
      result.current.setNewName('NewName');
      result.current.saveBuilder();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should show error when newName already exists', async () => {
    const { result } = renderHook(() => useViewNameController(mockProps, mockMessageApi), { wrapper });

    act(() => {
      result.current.setNewName('ExistingName');
      result.current.saveBuilder();
    });
    
    expect(result.current.isModify).toBe(false);
    expect(result.current.thisViewHasPermission()).toBe(true);
  });

  it('should remove a view', async () => {
    const { result } = renderHook(() => useViewNameController(mockProps, mockMessageApi), { wrapper });

    act(() => {
      result.current.removeBuilder();
    });

    expect(result.current.isRemoveLoading).toBe(true);
  });

});