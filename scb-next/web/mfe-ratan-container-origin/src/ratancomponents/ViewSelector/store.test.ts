import { reducer, defaultState, getViews, getView, saveView, removeView } from './store';
import { getViewList, getViewDetails, putUpdateView, postSaveView, deleteView } from '../../ratanutils/http/api';
import { getUser } from '../../ratanutils/authenticator';
import { getEnable } from '../../ratanutils/componentEnabling';

vi.mock('../../ratanutils/http/api');
vi.mock('../../ratanutils/authenticator');
vi.mock('../../ratanutils/componentEnabling');

describe('store reducer', () => {
  it('should handle UPDATE_VIEWS action', () => {
    const action = { type: 'UPDATE_VIEWS', data: { view1: 'data1' } };
    const newState = reducer(defaultState, action);

    expect(newState.viewList).toEqual({ view1: 'data1' });
  });

  it('should handle UPDATE_CURRENT_VIEW action', () => {
    const action = { type: 'UPDATE_CURRENT_VIEW', data: 'view1' };
    const newState = reducer(defaultState, action);

    expect(newState.currentView).toEqual('view1');
  });

  it('should handle ADD_VIEW action', () => {
    const action = { type: 'ADD_VIEW', data: { type: 'type1', body: '{"key":"value"}' } };
    const newState = reducer({...defaultState, viewList: {
      type1: [{ rowKey: 'rowKey1', body: '{"key":"value"}' }],
    }}, action);

    expect(newState.viewList.type1[0].body).toEqual({ key: 'value' });
    const action2 = { type: 'ADD_VIEW', data: { type: 'type1', body: { "key":"value" } } };

    const newState2 = reducer({...defaultState, viewList: {
      type1: [{ rowKey: 'rowKey1', body: {"key":"value"} }],
    }}, action2);
    expect(newState2.viewList.type1[0].body).toEqual({ key: 'value' });
  });

  it('should handle UPDATE_VIEW action', () => {
    const initialState = {
      ...defaultState,
      viewList: {
        type1: [{ rowKey: 'rowKey1', body: '{"key":"value"}' }],
      },
    };
    const action = { type: 'UPDATE_VIEW', data: { rowKey: 'rowKey1', type: 'type1', body: '{"key":"newValue"}' } };
    const newState = reducer(initialState, action);

    expect(newState.viewList.type1[0].body).toEqual({ key: 'newValue' });

    const action2 = { type: 'UPDATE_VIEW', data: { rowKey: 'rowKey2', type: 'type1', body: '{"key":"newValue"}' } };
    const newState2 = reducer(initialState, action2);
    expect(newState2.viewList.type1[0].body).toEqual("{\"key\":\"value\"}");

    const action3 = { type: 'UPDATE_VIEW', data: { rowKey: 'rowKey2', type: 'type1', body: {"key":"newValue"} } };
    const newState3 = reducer(initialState, action3);
    expect(newState3.viewList.type1[0].body).toEqual("{\"key\":\"value\"}");
  });

  it('should handle REMOVE_VIEW action', () => {
    const initialState = {
      ...defaultState,
      viewList: {
        type1: [{ rowKey: 'rowKey1' }],
      },
    };
    const action = { type: 'REMOVE_VIEW', data: { rowKey: 'rowKey1', viewFieldType: 'type1' } };
    const newState = reducer(initialState, action);

    expect(newState.viewList.type1).toHaveLength(0);
  });

  it('should handle CHANGE_VIEW action', () => {
    const action = { type: 'CHANGE_VIEW', data: 'newView' };
    const newState = reducer(defaultState, action);

    expect(newState.currentView.body).toEqual('newView');

    const newState2 = reducer({...defaultState, currentView: null }, action);
    expect(newState2.currentView.body).toEqual('newView');
  });

  it('should return default state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = reducer(defaultState, action);

    expect(newState).toEqual(defaultState);
  });
});

describe('store actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch views', async () => {
    const mockResponse = [{ name: 'view1' }];
    (getViewList as vi.Mock).mockResolvedValue(mockResponse);
    (getUser as vi.Mock).mockReturnValue({ id: 'user1', role: 'role1' });
    (getEnable as vi.Mock).mockReturnValue(true);

    const result = await getViews('type1');

    expect(getViewList).toHaveBeenCalledWith({
      type: 'type1',
      creator: 'user1',
      assignee: 'role1',
      moduleOwner: 'role1',
      searchAll: true,
    });
    expect(result.type1).toEqual(mockResponse);
  });

  it('should fetch view details', async () => {
    const mockResponse = { body: '{"key":"value"}' };
    (getViewDetails as vi.Mock).mockResolvedValue(mockResponse);

    const result = await getView('rowKey1', 'type1');

    expect(getViewDetails).toHaveBeenCalledWith('rowKey1', 'type1');
    expect(result.body).toEqual({ key: 'value' });
  });

  it('should save view', async () => {
    (postSaveView as vi.Mock).mockResolvedValue({});
    (putUpdateView as vi.Mock).mockResolvedValue({});
    (getUser as vi.Mock).mockReturnValue({ id: 'user1' });
    (getEnable as vi.Mock).mockReturnValue(true);

    const params = {
      rowKey: null,
      name: 'view1',
      assigneeList: [],
      moduleOwner: 'owner1',
      body: { key: 'value' },
      viewFieldType: 'type1',
      chooseAuthority: true,
    };

    await saveView(params);

    expect(postSaveView).toHaveBeenCalledWith({
      name: 'view1',
      creator: 'user1',
      body: '{"key":"value"}',
      type: 'type1',
      assigneeList: [],
      moduleOwner: 'owner1',
      isPublic: false,
    });
  });

  it('should remove view', async () => {
    (deleteView as vi.Mock).mockResolvedValue({});
    (getUser as vi.Mock).mockReturnValue({ id: 'user1' });
    (getEnable as vi.Mock).mockReturnValue(true);

    await removeView({ rowKey: 'rowKey1', moduleOwner: 'owner1' }, 'type1');

    expect(deleteView).toHaveBeenCalledWith({
      rowKey: 'rowKey1',
      creator: 'user1',
      moduleOwner: 'owner1',
    }, 'type1');
  });

  it('should remove view', async () => {
    (deleteView as vi.Mock).mockResolvedValue({});
    (getUser as vi.Mock).mockReturnValue({ id: 'user1' });
    (getEnable as vi.Mock).mockReturnValue(false);
    
    await removeView({ rowKey: 'rowKey1', moduleOwner: 'owner1' }, 'type1');
    expect(deleteView).toHaveBeenCalledWith("rowKey1", "type1");
  });
});

describe('getViews', () => {
  it('should return sorted and parsed view list', async () => {
    const mockResponse = [
      { name: 'View2', body: '{"key": "value2"}' },
      { name: 'View1', body: '{"key": "value1"}' },
    ];
    (getViewList as vi.Mock).mockResolvedValue(mockResponse);

    const type = 'some-type';
    const result = await getViews(type);

    expect(result[type]).toEqual([
      { name: 'View1', body: { key: 'value1' } },
      { name: 'View2', body: { key: 'value2' } },
    ]);
  });

  it('should handle empty view list', async () => {
    // Mocking an empty response
    (getViewList as vi.Mock).mockResolvedValue([]);

    const type = 'some-type';
    const result = await getViews(type);

    expect(result[type]).toEqual([]);
  });

  it('should return sorted and parsed view list', async () => {
    const mockResponse = [
      { body: '{"key": "value2"}' },
      { body: '{"key": "value1"}' },
    ];
    // Mocking an empty response
    (getViewList as vi.Mock).mockResolvedValue(mockResponse);

    const type = 'some-type';
    const result = await getViews(type);

    expect(result[type]).toEqual([
      { body: { key: 'value2' } },
      { body: { key: 'value1' } },
    ]);
  });

  it('should handle non-array response', async () => {
    // Mocking a non-array response
    (getViewList as vi.Mock).mockResolvedValue(null);

    const type = 'some-type';
    const result = await getViews(type);

    expect(result[type]).toEqual([]);
  });
});

describe('saveView', () => {
  it('should call putUpdateView with correct params when rowKey is provided', async () => {
    (getEnable as vi.Mock).mockReturnValue(true);
    const rowKey = 'some-row-key';
    const viewParams = {
      rowKey,
      name: 'ViewName',
      assigneeList: ['assignee1', 'assignee2'],
      moduleOwner: 'moduleOwner',
      body: { key: 'value' },
      viewFieldType: 'fieldType',
      chooseAuthority: false,
    };

    await saveView(viewParams);

    expect(putUpdateView).toHaveBeenCalledWith("some-row-key", {"assigneeList": ["assignee1", "assignee2"], "body": "{\"key\":\"value\"}", "creator": "user1", "isPublic": false, "moduleOwner": "moduleOwner", "name": "ViewName", "type": "fieldType"});
  });

  it('should call postSaveView with correct params when rowKey is not provided', async () => {
    const viewParams = {
      rowKey: null,
      name: 'ViewName',
      assigneeList: ['assignee1', 'assignee2'],
      moduleOwner: 'moduleOwner',
      body: { key: 'value' },
      viewFieldType: 'fieldType',
      chooseAuthority: true,
    };

    await saveView(viewParams);

    expect(postSaveView).toHaveBeenCalledWith({
      name: 'ViewName',
      assigneeList: ['assignee1', 'assignee2'],
      body: '{"key":"value"}',
      creator: "user1",
      type: 'fieldType',
      isPublic: false,
      moduleOwner: 'moduleOwner',
    });
  });

  it('should call postSaveView with correct params when rowKey is not provided', async () => {
    const viewParams = {
      rowKey: null,
      name: 'ViewName',
      assigneeList: ['assignee1', 'assignee2'],
      moduleOwner: 'moduleOwner',
      body: { key: 'value' },
      viewFieldType: 'fieldType',
      chooseAuthority: true,
    };

    (getEnable as vi.Mock).mockReturnValue(false);
    await saveView(viewParams);

    expect(postSaveView).toHaveBeenCalledWith({
      name: 'ViewName',
      owner: 'user1',
      body: '{"key":"value"}',
      type: 'fieldType',
      isPublic: false,
    });
  });
});