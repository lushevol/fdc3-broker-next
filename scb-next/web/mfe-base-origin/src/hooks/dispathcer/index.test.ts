/* eslint-env jest */
export {};
vi.mock('../provider', () => ({ useContext: vi.fn() }));
vi.mock('../../utils/common', () => ({ uuidv4: vi.fn(), storeData: vi.fn() }));

let provider: any;
let common: any;
const { ActionType } = require('../reducer/util/ActionType');

describe('dispatchOpenTile and dispatchOpenCDUPSOutboundBlotter', () => {
  let dispatchMock: vi.Mock;

  beforeEach(() => {
    vi.resetModules();
    // re-require mocked modules after reset
    provider = require('../provider');
    common = require('../../utils/common');
    dispatchMock = vi.fn();
  });

  it('dispatchOpenCDUPSOutboundBlotter appends subtitle when present and calls ADD_WORKSPACE with correct payload', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/confirmations-outbound', title: 'T', subtitle: 'S', meta: 'v' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);
    common.uuidv4
      .mockImplementationOnce(() => 'container-id')
      .mockImplementationOnce(() => 'workspace-id');

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    dispatcher.dispatchOpenCDUPSOutboundBlotter({ foo: 'bar' });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    expect(call.type).toBe(ActionType.ADD_WORKSPACE);
    const workspace = call.data.workspace;
    expect(workspace.id).toBe('workspace-id');
    expect(workspace.containers).toHaveLength(1);
    const container = workspace.containers[0];
    expect(container.id).toBe('container-id');
    expect(container.parameters).toEqual({ foo: 'bar' });
    expect(workspace.label).toBe('T S');
  });

  it('dispatchOpenCDUPSOutboundBlotter delegates to dispatchOpenTile and preserves title when subtitle empty', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/confirmations-outbound', title: 'Outbound', subtitle: '' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);
    common.uuidv4
      .mockImplementationOnce(() => 'container-id-2')
      .mockImplementationOnce(() => 'workspace-id-2');

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    dispatcher.dispatchOpenCDUPSOutboundBlotter({ x: 1 });

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    const call = dispatchMock.mock.calls[0][0];
    expect(call.type).toBe(ActionType.ADD_WORKSPACE);
    const workspace = call.data.workspace;
    expect(workspace.label).toBe('Outbound');
    const container = workspace.containers[0];
    expect(container.parameters).toEqual({ x: 1 });
  });

  it('checkCDUPSOutboundBlotterAccessible returns true when confirmations-outbound tile exists', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/trade', title: 'Trade' },
          ],
        },
        {
          tiles: [
            { tile: '/confirmations-outbound', title: 'Outbound' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkCDUPSOutboundBlotterAccessible()).toBe(true);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('checkCDUPSOutboundBlotterAccessible returns false when confirmations-outbound tile does not exist', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/trade', title: 'Trade' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkCDUPSOutboundBlotterAccessible()).toBe(false);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('checkCDUPSOutboundBlotterAccessible returns false when drawers is empty', () => {
    const store = {
      drawers: [],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkCDUPSOutboundBlotterAccessible()).toBe(false);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('checkRatanTradeBlotterAccessible returns true when trade tile exists', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/confirmations-outbound', title: 'Outbound' },
          ],
        },
        {
          tiles: [
            { tile: '/trade', title: 'Trade' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkRatanTradeBlotterAccessible()).toBe(true);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('checkRatanTradeBlotterAccessible returns false when trade tile does not exist', () => {
    const store = {
      drawers: [
        {
          tiles: [
            { tile: '/confirmations-outbound', title: 'Outbound' },
          ],
        },
      ],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkRatanTradeBlotterAccessible()).toBe(false);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('checkRatanTradeBlotterAccessible returns false when drawers is empty', () => {
    const store = {
      drawers: [],
    } as any;

    provider.useContext.mockReturnValue([store, dispatchMock]);

    const useDispatcher = require('./index').default;
    const dispatcher = useDispatcher();

    expect(dispatcher.checkRatanTradeBlotterAccessible()).toBe(false);
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
