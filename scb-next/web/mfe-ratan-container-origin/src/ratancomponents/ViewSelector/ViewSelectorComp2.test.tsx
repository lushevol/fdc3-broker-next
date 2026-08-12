import { removeView } from "./store";
import { checkRemove, realDiffView } from "./ViewSelectorComp";

vi.mock('./store', () => ({
  removeView: vi.fn(),
}));

describe('checkRemove', () => {
  it('should dispatch REMOVE_VIEW and show success message on successful removal', async () => {
    const setIsLoading = vi.fn();
    const dispatch = vi.fn();
    const newParams = {};
    const rowKey = 'testRowKey';
    const viewFieldType = 'testViewFieldType';

    (removeView as vi.Mock).mockResolvedValueOnce({});

    await checkRemove(setIsLoading, newParams, dispatch, rowKey, viewFieldType);

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(removeView).toHaveBeenCalledWith(newParams, viewFieldType);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE_VIEW',
      data: { rowKey, viewFieldType },
    });
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });

  it('should show error message on failed removal', async () => {
    const setIsLoading = vi.fn();
    const dispatch = vi.fn();
    const newParams = {};
    const rowKey = 'testRowKey';
    const viewFieldType = 'testViewFieldType';

    (removeView as vi.Mock).mockRejectedValueOnce(new Error('Remove failed'));

    await checkRemove(setIsLoading, newParams, dispatch, rowKey, viewFieldType);

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(removeView).toHaveBeenCalledWith(newParams, viewFieldType);
    expect(dispatch).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenCalledWith(true);
  });
});

describe('realDiffView', () => {
  it('should call onChangedView and onNeedChange with new fields when there are changes', () => {
    const api: any = {
      getAllDisplayedColumns: vi.fn(() => [
        { colId: 'col1' },
        { colId: 'col2' },
        { colId: 'col3' },
      ]),
    };
    const lastIds = ['col1'];
    const skipDiff = false;
    const setLastIds = vi.fn();
    const onChangedView = vi.fn();
    const onNeedChange = vi.fn();

    realDiffView({ api, lastIds, skipDiff, setLastIds, onChangedView, onNeedChange});

    expect(api.getAllDisplayedColumns).toHaveBeenCalled();
    expect(setLastIds).toHaveBeenCalledWith(['col1', 'col2', 'col3']);
    expect(onChangedView).toHaveBeenCalledWith(['col2', 'col3']);
    expect(onNeedChange).toHaveBeenCalledWith(true);
    expect(onNeedChange).toHaveBeenCalledWith(false);
  });

  it('should not call onChangedView when there are no changes', () => {
    const api: any = {
      getAllDisplayedColumns: vi.fn(() => [
        { colId: 'col1' },
        { colId: 'col2' },
        { colId: 'col3' },
      ]),
    };
    const lastIds = ['col1', 'col2', 'col3'];
    const skipDiff = false;
    const setLastIds = vi.fn();
    const onChangedView = vi.fn();
    const onNeedChange = vi.fn();

    realDiffView({ api, lastIds, skipDiff, setLastIds, onChangedView, onNeedChange } );

    expect(api.getAllDisplayedColumns).toHaveBeenCalled();
    expect(setLastIds).toHaveBeenCalledWith(['col1', 'col2', 'col3']);
    expect(onChangedView).not.toHaveBeenCalled();
    expect(onNeedChange).toHaveBeenCalledWith(false);
  });

  it('should call onChangedView and onNeedChange when skipDiff is true', () => {
    const api: any = {
      getAllDisplayedColumns: vi.fn(() => [
        { colId: 'col1' },
        { colId: 'col2' },
        { colId: 'col3' },
      ]),
    };
    const lastIds = ['col1'];
    const skipDiff = true;
    const setLastIds = vi.fn();
    const onChangedView = vi.fn();
    const onNeedChange = vi.fn();

    realDiffView({ api, lastIds, skipDiff, setLastIds, onChangedView, onNeedChange });

    expect(api.getAllDisplayedColumns).toHaveBeenCalled();
    expect(setLastIds).toHaveBeenCalledWith(['col1', 'col2', 'col3']);
    expect(onChangedView).toHaveBeenCalledWith(['col2', 'col3']);
    expect(onNeedChange).toHaveBeenCalledWith(true);
    expect(onNeedChange).toHaveBeenCalledWith(false);
  });
});
