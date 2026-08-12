import * as FailedRightMenuModule from "src/Cashflow_CN/Main/workflow/failed/FailedWrap";
import * as ManualSettleRightMenuModule from "src/Cashflow_CN/Main/workflow/manualSettle";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

import * as EarlyMaterializationRightMenuModule from "../../../Main/workflow/earlyMaterialization/EarlyMaterializationWrap";
import * as HoldRightMenuModule from "../../../Main/workflow/hold";
import * as NetCashflowRightMenuModule from "../../../Main/workflow/netCashflow/netCashflowRightMenu";
import * as UnNetCashflowRightMenuModule from "../../../Main/workflow/netCashflow/unNetCashflowRightMenu";
import * as SettlementMethodUpdateRightMenuModule from "../../../Main/workflow/settlementMethodUpdate/utils/rightmenu";
import * as SplittingCashflowRightMenuModule from "../../../Main/workflow/splitting/SplittingCashflowRightMenu";
import * as SwiftSuppressRightMenuModule from "../../../Main/workflow/swiftSuppress/SwiftSuppress";
import * as ViewCashflowDetailsRightMenuModule from "../../../Main/workflow/viewCashflowDetails/viewCashflowDetailsRightMenu";
import * as RightMenuModule from "../../BulkFixExceptions/utils/rightmenu";
import RightClickMenuBuilder from "./RightClickMenuBuilder";

jest.mock("src/Root/common/utils/featureFlagController");

describe("RightClickMenuBuilder", () => {
  let params: any;
  let options: any;

  beforeEach(() => {
    params = {
      api: {
        getSelectedRows: jest.fn(),
      },
      node: {
        data: { Settlement_Method: "NORMAL" },
      },
    };

    const dispatch = jest.fn();
    const modalApi = { open: jest.fn(), close: jest.fn() };
    const messageApi = { show: jest.fn(), hide: jest.fn() };

    options = {
      dispatch,
      modalApi,
      messageApi,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add bulk right menu", () => {
    jest
      .spyOn(RightMenuModule, "bulkRightMenu")
      .mockImplementation(() => ({ name: "Bulk Action" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addBulkRightMenu().toResult();

    expect(result).toEqual([{ name: "Bulk Action" }]);
  });

  it("should handle bulkRightMenu being null", () => {
    jest.spyOn(RightMenuModule, "bulkRightMenu").mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addBulkRightMenu().toResult();

    expect(result).toEqual([]);
    expect(RightMenuModule.bulkRightMenu).toHaveBeenCalled();
  });

  it("should add net cashflow right menu if excludeMenus is false", () => {
    jest
      .spyOn(NetCashflowRightMenuModule, "netCashflowRightMenu")
      .mockImplementation(() => ({ name: "Net Cashflow" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addNetCashflowRightMenu().toResult();

    expect(result).toEqual([{ name: "Net Cashflow" }]);
  });

  it("should not add net cashflow right menu if excludeMenus is true", () => {
    jest
      .spyOn(NetCashflowRightMenuModule, "netCashflowRightMenu")
      .mockImplementation(() => ({ name: "Net Cashflow" }));
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addNetCashflowRightMenu().toResult();

    expect(result).toEqual([]);
    expect(NetCashflowRightMenuModule.netCashflowRightMenu).toHaveBeenCalled();
  });

  it("should add unNet cashflow right menu", () => {
    jest
      .spyOn(UnNetCashflowRightMenuModule, "unNetCashflowRightMenu")
      .mockImplementation(() => ({ name: "UnNet Cashflow" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addUnNetCashflowRightMenu().toResult();

    expect(result).toEqual([{ name: "UnNet Cashflow" }]);
  });

  it("should not add unNet cashflow right menu being null", () => {
    jest
      .spyOn(UnNetCashflowRightMenuModule, "unNetCashflowRightMenu")
      .mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addUnNetCashflowRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      UnNetCashflowRightMenuModule.unNetCashflowRightMenu
    ).toHaveBeenCalled();
  });

  it("should add hold right menu", () => {
    jest
      .spyOn(HoldRightMenuModule, "holdRightMenu")
      .mockImplementation(() => [{ name: "Hold Action" }]);

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addHoldRightMenu().toResult();

    expect(result).toEqual([{ name: "Hold Action" }]);
    expect(HoldRightMenuModule.holdRightMenu).toHaveBeenCalledWith(
      params,
      options
    );
  });

  it("should add early materialization right menu if excludeMenus is false", () => {
    jest
      .spyOn(
        EarlyMaterializationRightMenuModule,
        "earlyMaterializationRightMenu"
      )
      .mockImplementation(() => ({ name: "Early Release" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addEarlyMaterializationRightMenu().toResult();

    expect(result).toEqual([{ name: "Early Release" }]);
  });

  it("should not add early materialization right menu if excludeMenus is true and menu name is excluded", () => {
    jest
      .spyOn(
        EarlyMaterializationRightMenuModule,
        "earlyMaterializationRightMenu"
      )
      .mockImplementation(() => ({ name: "Early Release" }));
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addEarlyMaterializationRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      EarlyMaterializationRightMenuModule.earlyMaterializationRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should add early materialization right menu if excludeMenus is true but menu name is not excluded", () => {
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);
    jest
      .spyOn(
        EarlyMaterializationRightMenuModule,
        "earlyMaterializationRightMenu"
      )
      .mockImplementation(() => ({ name: "Non-Excluded Menu" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addEarlyMaterializationRightMenu().toResult();

    expect(result).toEqual([{ name: "Non-Excluded Menu" }]);
    expect(
      EarlyMaterializationRightMenuModule.earlyMaterializationRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should not add early materialization right menu if earlyMaterializationRightMenu returns null", () => {
    jest
      .spyOn(
        EarlyMaterializationRightMenuModule,
        "earlyMaterializationRightMenu"
      )
      .mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addEarlyMaterializationRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      EarlyMaterializationRightMenuModule.earlyMaterializationRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should add adhoc comment right menu", () => {
    jest
      .spyOn(EarlyMaterializationRightMenuModule, "adhocCommentRightMenu")
      .mockImplementation(() => ({ name: "Adhoc Comment" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addAdhocCommentRightMenu().toResult();

    expect(result).toEqual([{ name: "Adhoc Comment" }]);
    expect(
      EarlyMaterializationRightMenuModule.adhocCommentRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should handle adhoc comment being null", () => {
    jest
      .spyOn(EarlyMaterializationRightMenuModule, "adhocCommentRightMenu")
      .mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addAdhocCommentRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      EarlyMaterializationRightMenuModule.adhocCommentRightMenu
    ).toHaveBeenCalled();
  });
  it("should add failed right menu if excludeMenus is false", () => {
    jest
      .spyOn(FailedRightMenuModule, "failedRightMenu")
      .mockImplementation(() => ({ name: "Failed Action" }));
    params.api.getSelectedRows.mockReturnValue([]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addFailedRightMenu().toResult();

    expect(result).toEqual([{ name: "Failed Action" }]);
    expect(FailedRightMenuModule.failedRightMenu).toHaveBeenCalledWith(
      params,
      options
    );
  });

  it("should not add failed right menu if excludeMenus is true", () => {
    jest
      .spyOn(FailedRightMenuModule, "failedRightMenu")
      .mockImplementation(() => ({ name: "Failed Action" }));
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addFailedRightMenu().toResult();

    expect(result).toEqual([]);
    expect(FailedRightMenuModule.failedRightMenu).toHaveBeenCalled();
  });

  it("should add manual settle right menu", () => {
    jest
      .spyOn(ManualSettleRightMenuModule, "manualSettleRightMenu")
      .mockImplementation(() => ({ name: "Manual Settle" }));

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addManualSettleRightMenu().toResult();

    expect(result).toEqual([{ name: "Manual Settle" }]);
    expect(
      ManualSettleRightMenuModule.manualSettleRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should handle adhoc comment being null", () => {
    jest
      .spyOn(ManualSettleRightMenuModule, "manualSettleRightMenu")
      .mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addManualSettleRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      ManualSettleRightMenuModule.manualSettleRightMenu
    ).toHaveBeenCalled();
  });

  it("should add swift suppress right menu", () => {
    jest
      .spyOn(SwiftSuppressRightMenuModule, "swiftSuppressRightMenu")
      .mockImplementation(() => [{ name: "Swift Suppress" }]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSwiftSuppressRightMenu().toResult();

    expect(result).toEqual([{ name: "Swift Suppress" }]);
    expect(
      SwiftSuppressRightMenuModule.swiftSuppressRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should not add swift suppress right menu if excludeMenus is true", () => {
    jest
      .spyOn(SwiftSuppressRightMenuModule, "swiftSuppressRightMenu")
      .mockImplementation(() => [{ name: "Swift Suppress" }]);
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSwiftSuppressRightMenu().toResult();

    expect(result).toEqual([]);
  });

  it("should add view trade details right menu when Trade_Id is present", () => {
    const nodeData = {
      Trade_Id: "12345",
      Cashflow: { Cashflow_State: "NORMAL", Netting_Id: null },
    };
    params.node.data = nodeData;

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewTradeDetailsRightMenu().toResult();

    expect(result).toEqual([
      {
        name: "View Trade Details",
        disabled: false,
        tooltip: "",
        action: expect.any(Function),
      },
    ]);
  });

  it("should not add view trade details right menu when Trade_Id is null", () => {
    const nodeData = {
      Trade_Id: null,
      Cashflow: { Cashflow_State: "NORMAL", Netting_Id: null },
    };
    params.node.data = nodeData;

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewTradeDetailsRightMenu().toResult();

    expect(result).toEqual([
      {
        name: "View Trade Details",
        disabled: true,
        tooltip: "Trade Id is null",
        action: expect.any(Function),
      },
    ]);
  });

  it("should not add view trade details right menu when node is null", () => {
    params.node.data = null;
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewTradeDetailsRightMenu().toResult();

    expect(result).toEqual([]);
  });

  it("should add view swift message right menu ", () => {
    jest
      .spyOn(ViewCashflowDetailsRightMenuModule, "isShowSwiftMessage")
      .mockImplementation(() => true);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewSwiftMessage().toResult();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "View Swift Message" }),
      ])
    );
  });

  it("should not add view swift message right menu when node is null", () => {
    params.node.data = null;
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewSwiftMessage().toResult();

    expect(result).toEqual([]);
  });
  it("should add view cashflow details and history right menus when node data is present", () => {
    const nodeData = { id: "12345" };
    params.node.data = nodeData;

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewCashflowDetailsRightMenu().toResult();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "View Cashflow Details",
          action: expect.any(Function),
        }),
        expect.objectContaining({
          name: "View Cashflow History",
          action: expect.any(Function),
        }),
      ])
    );
  });

  it("should not add view cashflow details and history right menus when node data is null", () => {
    params.node.data = null;

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addViewCashflowDetailsRightMenu().toResult();

    expect(result).toEqual([]);
  });
  it("should filter out null values in toResult", () => {
    const builder = new RightClickMenuBuilder(params, options);
    builder["result"] = [{ name: "Valid Menu" }];
    const result = builder.toResult();

    expect(result).toEqual([{ name: "Valid Menu" }]);
  });
  it("should not add splitting cashflow right menu when feature flag is disabled", () => {
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => false);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSplittingCashflowRightMenu().toResult();

    expect(result).toEqual([]);
  });

  it("should add splitting cashflow right menu when feature flag is enabled and excludeMenus is false", () => {
    jest
      .spyOn(SplittingCashflowRightMenuModule, "splittingCashflowRightMenu")
      .mockImplementation(() => [{ name: "Splitting Action" }]);
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => true);

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSplittingCashflowRightMenu().toResult();

    expect(result).toEqual([{ name: "Splitting Action" }]);
    expect(
      SplittingCashflowRightMenuModule.splittingCashflowRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should not add splitting cashflow right menu when excludeMenus is true", () => {
    jest
      .spyOn(SplittingCashflowRightMenuModule, "splittingCashflowRightMenu")
      .mockImplementation(() => [{ name: "Splitting Action" }]);
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => true);
    params.api.getSelectedRows.mockReturnValue([{ Settlement_Method: "UTIL" }]);

    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSplittingCashflowRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      SplittingCashflowRightMenuModule.splittingCashflowRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should add settlement method update right menu", () => {
    jest
      .spyOn(SettlementMethodUpdateRightMenuModule, "settlementMethodUpdateRightMenu")
      .mockImplementation(() => ({ name: "Settlement Method Update" }));
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSettlementMethodUpdateRightMenu().toResult();

    expect(result).toEqual([{ name: "Settlement Method Update" }]);
    expect(
      SettlementMethodUpdateRightMenuModule.settlementMethodUpdateRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should handle settlementMethodUpdateRightMenu returning null", () => {
    jest
      .spyOn(SettlementMethodUpdateRightMenuModule, "settlementMethodUpdateRightMenu")
      .mockImplementation(() => null);
    const builder = new RightClickMenuBuilder(params, options);
    const result = builder.addSettlementMethodUpdateRightMenu().toResult();

    expect(result).toEqual([]);
    expect(
      SettlementMethodUpdateRightMenuModule.settlementMethodUpdateRightMenu
    ).toHaveBeenCalledWith(params, options);
  });

  it("should return builder instance for chaining from addSettlementMethodUpdateRightMenu", () => {
    jest
      .spyOn(SettlementMethodUpdateRightMenuModule, "settlementMethodUpdateRightMenu")
      .mockImplementation(() => ({ name: "Settlement Method Update" }));
    const builder = new RightClickMenuBuilder(params, options);
    const returnValue = builder.addSettlementMethodUpdateRightMenu();

    expect(returnValue).toBe(builder);
  });
});
