import { openSettlementMethodUpdateDialogAction } from "../../../store/actions";
import {
  canBeSettlementMethodUpdate,
  settlementMethodUpdateRightmenuConsistencyValidation,
} from "./filter";
import {
  settlementMethodUpdateAction,
  settlementMethodUpdateRightMenu,
} from "./rightmenu";

vi.mock("./filter", () => ({
  canBeSettlementMethodUpdate: vi.fn(),
  settlementMethodUpdateRightmenuConsistencyValidation: vi.fn(),
}));

vi.mock("../../../store/actions", () => ({
  openSettlementMethodUpdateDialogAction: vi.fn(),
}));

afterAll(() => {
  vi.clearAllMocks();
});

const buildCashflow = (overrides = {}): CNCashflow =>
  ({
    Trade_Id: "7150113553",
    Settlement_Method: "GROSS",
    Cashflow: {
      Cashflow_Id: "007372111189",
      Cashflow_State: "READY",
    },
    ...overrides,
  } as CNCashflow);

const buildParam = (overrides: any = {}) => ({
  node: { data: buildCashflow() },
  api: {
    getSelectedRows: vi.fn().mockReturnValue([]),
    ...overrides.api,
  },
  ...overrides,
});

const buildOptions = (overrides: any = {}) => ({
  messageApi: { error: vi.fn() },
  dispatch: vi.fn(),
  ...overrides,
});

describe("settlementMethodUpdateAction", () => {
  beforeEach(() => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(true);
  });

  it("should return null when cashflows is empty", () => {
    const result = settlementMethodUpdateAction([], vi.fn());
    expect(result).toBeNull();
  });

  it("should return null when not every cashflow can be updated", () => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(false);
    const result = settlementMethodUpdateAction([buildCashflow()], vi.fn());
    expect(result).toBeNull();
  });

  it("should return MenuItemDef with correct name when all cashflows are eligible", () => {
    const result = settlementMethodUpdateAction([buildCashflow()], vi.fn());
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Settlement Method Update");
  });

  it("should return MenuItemDef with action function", () => {
    const result = settlementMethodUpdateAction([buildCashflow()], vi.fn());
    expect(typeof result?.action).toBe("function");
  });

  it("should call callback when action is invoked", () => {
    const callback = vi.fn();
    const result = settlementMethodUpdateAction([buildCashflow()], callback);
    (result?.action as Function)();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should return null when some cashflows are not eligible", () => {
    (canBeSettlementMethodUpdate as vi.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const result = settlementMethodUpdateAction(
      [buildCashflow(), buildCashflow()],
      vi.fn()
    );
    expect(result).toBeNull();
  });

  it("should return MenuItemDef when multiple cashflows are all eligible", () => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(true);
    const result = settlementMethodUpdateAction(
      [buildCashflow(), buildCashflow()],
      vi.fn()
    );
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Settlement Method Update");
  });
});

describe("settlementMethodUpdateRightMenu", () => {
  beforeEach(() => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(true);
    (
      settlementMethodUpdateRightmenuConsistencyValidation as vi.Mock
    ).mockReturnValue({
      valid: true,
      message: "",
    });
  });

  it("should use hoverRow when selectedRows is empty", () => {
    const param = buildParam({
      api: { getSelectedRows: vi.fn().mockReturnValue([]) },
    });
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Settlement Method Update");
  });

  it("should use selectedRows when selectedRows is not empty", () => {
    const selectedRows = [buildCashflow(), buildCashflow()];
    const param = buildParam({
      api: { getSelectedRows: vi.fn().mockReturnValue(selectedRows) },
    });
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );
    expect(result).not.toBeNull();
  });

  it("should use hoverRow when param.api is undefined", () => {
    const param = { node: { data: buildCashflow() }, api: undefined };
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );
    expect(result).not.toBeNull();
  });

  it("should use empty object as hoverRow when param.node is undefined", () => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(false);
    const param = {
      node: undefined,
      api: { getSelectedRows: vi.fn().mockReturnValue([]) },
    };
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );
    expect(result).toBeNull();
  });

  it("should dispatch openSettlementMethodUpdateDialogAction on valid action", () => {
    const param = buildParam();
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );

    (result?.action as Function)();

    expect(options.dispatch).toHaveBeenCalledTimes(1);
    expect(openSettlementMethodUpdateDialogAction).toHaveBeenCalledWith({
      isOpenDialog: true,
      cashflowData: expect.any(Array),
      cashflowDataByTrade: expect.any(Array),
    });
  });

  it("should call messageApi.error and not dispatch when validation fails", () => {
    (
      settlementMethodUpdateRightmenuConsistencyValidation as vi.Mock
    ).mockReturnValue({
      valid: false,
      message: "Settlement Method of selected cashflows are not the same",
    });

    const param = buildParam();
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );

    (result?.action as Function)();

    expect(options.messageApi.error).toHaveBeenCalledWith(
      "Settlement Method of selected cashflows are not the same"
    );
    expect(options.dispatch).not.toHaveBeenCalled();
  });

  it("should NOT call messageApi.error when valid is false but message is empty", () => {
    (
      settlementMethodUpdateRightmenuConsistencyValidation as vi.Mock
    ).mockReturnValue({
      valid: false,
      message: "",
    });

    const param = buildParam();
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );

    (result?.action as Function)();

    expect(options.messageApi.error).not.toHaveBeenCalled();
    expect(options.dispatch).toHaveBeenCalledTimes(1);
  });

  it("should dispatch with correct cashflowData and cashflowDataByTrade", () => {
    const selectedRows = [buildCashflow({ Trade_Id: "7150113553" })];
    const param = buildParam({
      api: { getSelectedRows: vi.fn().mockReturnValue(selectedRows) },
    });
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );

    (result?.action as Function)();

    expect(openSettlementMethodUpdateDialogAction).toHaveBeenCalledWith({
      isOpenDialog: true,
      cashflowData: selectedRows,
      cashflowDataByTrade: selectedRows,
    });
  });

  it("should return null when cashflow is not eligible", () => {
    (canBeSettlementMethodUpdate as vi.Mock).mockReturnValue(false);
    const param = buildParam({
      api: { getSelectedRows: vi.fn().mockReturnValue([buildCashflow()]) },
    });
    const options = buildOptions();
    const result = settlementMethodUpdateRightMenu(
      param as any,
      options as any
    );
    expect(result).toBeNull();
  });
});
