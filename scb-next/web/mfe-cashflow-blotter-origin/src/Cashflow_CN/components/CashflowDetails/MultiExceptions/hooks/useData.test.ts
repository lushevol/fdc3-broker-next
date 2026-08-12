
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import cloneDeep from "lodash/cloneDeep";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

import { generateEmptyVostro } from "../common/utils";
import { HistoryDataType } from "../components/ActionHistory/interface";
import useData, { ActionHistoryKeyActions, findMakerFromHistory, Halt_States, handleMissMatchedException, histroyDataHandling, histroyDataHandlingByPesetAction } from "./useData";

vi.mock("src/Root/common/utils/featureFlagController");

const cashflowDetailsData = require("../data/cashflowDetails.json");

beforeEach(() => {
  // @ts-ignore
  featureScopedEnabled.mockImplementation(() => false);
});

afterEach(() => {
  vi.clearAllMocks();
});

const store = configureStore({
  reducer: {
    splittingWorkflow: createReducer({
      splitStatus: "INIT",
      isOpenSplittingDialog: false,
      isOpenLookUpSSIDialog: false,
      targetRowIndex: null,
      isChildCashflowDialogVisible: false,
      sourceCashflow: {},
      targetCashflows: [],
      initialTargetCashflows: [],
      // amountSetting: {
      //   precision: 2,
      //   type: RoundingType.ROUNDING_OFF,
      // },
      // splitAction: SplitActionType.COMPONENT_SPLIT,
    }, () => { }),
  },
});

describe("MultiExceptions component", () => {
  it("SI Checker with payload", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    const siExp = tempCashflowDetailsData.ratanException.find(
      (e) => e.Id === "1679339382269915136"
    );
    siExp.Stashing.Checker_Id = "123456";
    siExp.Stashing.Checker_Request_Body = siExp.Stashing.Maker_Request_Body;

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("SI Checker without payload", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    const siExp = tempCashflowDetailsData.ratanException.find(
      (e) => e.Id === "1679339382269915136"
    );
    siExp.Stashing.Checker_Id = "123456";

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("SI Checker (enhanced view) with payload", () => {
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => true);
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    const siExp = tempCashflowDetailsData.ratanException.find((e) => e.Id === "1679339382269915136");
    siExp.Stashing.Checker_Id = "123456";
    siExp.Stashing.Checker_Request_Body = siExp.Stashing.Maker_Request_Body;

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    ); const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("SI Checker (enhanced view) without payload", () => {
    // @ts-ignore
    featureScopedEnabled.mockImplementation(() => true);
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    const siExp = tempCashflowDetailsData.ratanException.find((e) => e.Id === "1679339382269915136");
    siExp.Stashing.Checker_Id = "123456";

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    ); const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("SI Maker", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    const siExp = tempCashflowDetailsData.ratanException.find(
      (e) => e.Id === "1679339382269915136"
    );
    siExp.Stashing.Maker_Id = "123456";
    tempCashflowDetailsData.ratanException![0].Exception_Code =
      "Missing Nostro";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Status Check", () => {
    expect(ActionHistoryKeyActions.length).toBe(1);
    expect(Halt_States.length).toBe(1);
  });
  it("handleMissMatchedException", () => {
    const stampedVostro = generateEmptyVostro();
    stampedVostro.ssiId = "test_id";
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    mockCashflowDetailsWithMissMatchExp.ratanVostroCandidates![0].SSI_Id =
      "test_id";
    handleMissMatchedException({
      stampedVostro,
      cashflowDetails: mockCashflowDetailsWithMissMatchExp,
    });
  });
  it("Checker MissMatchedException", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Checker Other Exception", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "Adhoc SSI";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp }), { wrapper }
    );

    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Maker MissMatchedException", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    mockCashflowDetailsWithMissMatchExp.cashflow!.Cashflow!.Cashflow_Sub_State =
      "Pending Operator";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
});
describe("Cashflow Details MultiExceptions useData", () => {
  it("handleMissMatchedException", () => {
    const stampedVostro = generateEmptyVostro();
    stampedVostro.ssiId = "test_id";
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    mockCashflowDetailsWithMissMatchExp.ratanVostroCandidates![0].SSI_Id =
      "test_id";
    handleMissMatchedException({
      stampedVostro,
      cashflowDetails: mockCashflowDetailsWithMissMatchExp,
    });
  });
  it("handleMissMatchedException without candidates", () => {
    const stampedVostro = generateEmptyVostro();
    stampedVostro.ssiId = "test_id";
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    mockCashflowDetailsWithMissMatchExp.ratanVostroCandidates = undefined;
    handleMissMatchedException({
      stampedVostro,
      cashflowDetails: mockCashflowDetailsWithMissMatchExp,
    });
  });
  it("Checker MissMatchedException", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "SI Mismatch";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Checker Other Exception", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code =
      "Adhoc SSI";
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp, isSplittingScene: false }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Checker no Exception", () => {
    const mockCashflowDetailsWithMissMatchExp = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    mockCashflowDetailsWithMissMatchExp.ratanException![0].Exception_Code = "";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetailsWithMissMatchExp }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("handleHistroyData", () => {
    const data = [
      {
        Action_Date_Time: "2024-06-18T01:06:29.628899",
        User_PSID: "1639796",
        Cashflow: {
          Cashflow_Id: "004360868718",
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Pending Exception",
          Cashflow_Sub_State: "Pending Operator",
          Cashflow_Business_Version: 0,
          Cashflow_Version: 0,
          Cashflow_Minor_Version: 4,
          Cashflow_Event_Type: "New",
          Exception_Reason: null,
          NSTP_Reason: "",
        },
        FMO_Comments: [
          {
            FMO_Comment: "Affirmed by 1639796",
            FMO_Comment_Timestamp: "2024-06-18 00:00:00.0",
            FMO_Comment_Updater: "1639796",
          },
        ],
        Action: "Affirmed",
        Action_Time: "2024-06-18T01:06:29.628899",
      },
      {
        Action_Date_Time: "2024-06-18T01:06:29.628899",
        User_PSID: "1639796",
        Cashflow: {
          Cashflow_Id: "004360868718",
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Pending Exception",
          Cashflow_Sub_State: "Pending Operator",
          Cashflow_Business_Version: 0,
          Cashflow_Version: 0,
          Cashflow_Minor_Version: 4,
          Cashflow_Event_Type: "New",
          Exception_Reason: null,
          NSTP_Reason: "",
        },
        FMO_Comments: [
          {
            FMO_Comment: "Affirmed by 1639796",
            FMO_Comment_Timestamp: "2024-06-18 00:00:00.0",
            FMO_Comment_Updater: "1639796",
          },
        ],
        Action: "Release",
        Action_Time: "2024-06-18T01:06:29.628899",
      },
      {
        Action_Date_Time: "2024-06-18T01:06:31.839445",
        User_PSID: "1639796",
        Cashflow: {
          Cashflow_Id: "004360868718",
          Cashflow_State: "READY",
          Cashflow_Sub_State_Type: "NA",
          Cashflow_Sub_State: "NA",
          Cashflow_Business_Version: 0,
          Cashflow_Version: 0,
          Cashflow_Minor_Version: 5,
          Cashflow_Event_Type: "New",
          Exception_Reason: null,
          NSTP_Reason: "",
        },
        FMO_Comments: [
          {
            FMO_Comment: "1",
            FMO_Comment_Timestamp: "2024-06-18 00:00:00.0",
            FMO_Comment_Updater: "1639796",
          },
        ],
        Action: "ApproveOnlyMaker",
        Action_Time: "2024-06-18T01:06:31.839445",
      },
      {
        Action_Date_Time: "2024-06-18T01:06:32.042634",
        User_PSID: "1639796",
        Cashflow: {
          Cashflow_Id: "004360868718",
          Cashflow_State: "READY",
          Cashflow_Sub_State_Type: "Pending Ack",
          Cashflow_Sub_State: "NA",
          Cashflow_Business_Version: 0,
          Cashflow_Version: 0,
          Cashflow_Minor_Version: 6,
          Cashflow_Event_Type: "New",
          Exception_Reason: null,
          NSTP_Reason: "",
        },
        FMO_Comments: [],
        Action: "SentToRazor",
        Action_Time: "2024-06-18T01:06:32.042634",
      },
      {
        Action_Date_Time: "2024-06-18T01:10:42.580191",
        User_PSID: "Razor",
        Cashflow: {
          Cashflow_Id: "004360868718",
          Cashflow_State: "RELEASED",
          Cashflow_Sub_State_Type: "NA",
          Cashflow_Sub_State: "NA",
          Cashflow_Business_Version: 0,
          Cashflow_Version: 0,
          Cashflow_Minor_Version: 7,
          Cashflow_Event_Type: "New",
          Exception_Reason: null,
          NSTP_Reason: "",
        },
        FMO_Comments: [
          {
            FMO_Comment: "Received Razor ack msg.",
            FMO_Comment_Timestamp: "2024-06-18 00:00:00.0",
            FMO_Comment_Updater: "Razor",
          },
        ],
        Action: "Release",
        Action_Time: "2024-06-18T01:10:42.580191",
      },
    ];
    const histroyData = histroyDataHandling(data);
    expect(histroyData).toHaveLength(4);
  });
  it("histroyDataHandling - empty case", () => {
    expect(histroyDataHandling([])).toEqual([]);
  });
  it("histroyDataHandling - invlaid case", () => {
    expect(histroyDataHandling(null as unknown as HistoryDataType[])).toEqual([]);
  });
  it("histroyDataHandlingByPesetAction - invlaid case", () => {
    expect(histroyDataHandlingByPesetAction(null as unknown as HistoryDataType[])).toEqual([]);
  });
  it("userRole Maker", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow.Cashflow_Sub_State =
      "Pending Operator";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("userRole Maker_Of_Ready_State", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow.Cashflow_Sub_State =
      "Pending Ack";
    tempCashflowDetailsData.cashflow.Cashflow.Cashflow_State = "READY";
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Affirmation Exception - PENDING_VERIFICATION", () => {
    const tempCashflowDetailsData = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    const affirmationExp = tempCashflowDetailsData.ratanException!.find(
      (e) => e.Exception_Code === "Pending Affirmation"
    );
    affirmationExp!.Status = "PENDING_VERIFICATION";

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("Affirmation Exception - PENDING_OPERATOR", () => {
    const tempCashflowDetailsData = cloneDeep(
      cashflowDetailsData
    ) as GraphqlCashflowDetails;
    const affirmationExp = tempCashflowDetailsData.ratanException!.find(
      (e) => e.Exception_Code === "Pending Affirmation"
    );
    affirmationExp!.Status = "PENDING_OPERATOR";

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    const { vostroDetailsData } = result.current;
    expect(vostroDetailsData).not.toBeNull();
  });
  it("should set empty nostro/vostro when calling initUnAutoPopSIData", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;

    const mockVostro = { settlementAccount: "vostro-acc", settlementMeans: "vostro-means" };
    const mockNostro = { settlementAccount: "nostro-acc", settlementMeans: "nostro-means" };

    const mockSplittingData = {
      ...mockCashflow1,
      nostroAccount: mockVostro,
      vostroAccount: mockNostro
    };
    const { result } = renderHook(() => useData({ cashflowDetails: tempCashflowDetailsData, isSplittingScene: true, isSplittingDataAvailable: true, currentSplittingData: mockSplittingData }));
    expect(result.current.nostroDetailsData).toEqual(mockVostro);
    expect(result.current.vostroDetailsData).toEqual(
      mockNostro
    );
  });
});

describe("findMakerFromHistory", () => {
  it("should return maker and key action PSIDs when both are present", () => {
    const actionHistoryListData = [
      { Action: "SETTLEASGROSS", User_PSID: "12345" },
      { Action: "APPROVE", User_PSID: "67890" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual(["12345", "67890"]);
  });

  it("should return only maker PSID when key action is not present", () => {
    const actionHistoryListData = [
      { Action: "APPROVE", User_PSID: "67890" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual([undefined, "67890"]);
  });

  it("should return only key action PSID when maker action is not present", () => {
    const actionHistoryListData = [
      { Action: "SETTLEASGROSS", User_PSID: "12345" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual(["12345", undefined]);
  });

  it("should return [undefined, undefined] when no matching actions are found", () => {
    const actionHistoryListData = [
      { Action: "OTHER_ACTION", User_PSID: "99999" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual([undefined, undefined]);
  });

  it("should handle an empty actionHistoryListData array", () => {
    const actionHistoryListData: any[] = [];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual([undefined, undefined]);
  });

  it("should handle case-insensitive action matching", () => {
    const actionHistoryListData = [
      { Action: "settleasgross", User_PSID: "12345" },
      { Action: "approve", User_PSID: "67890" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual(["12345", "67890"]);
  });

  it("should return the first matching maker and key action PSIDs when multiple matches exist", () => {
    const actionHistoryListData = [
      { Action: "SETTLEASGROSS", User_PSID: "12345" },
      { Action: "SETTLEASGROSS", User_PSID: "54321" },
      { Action: "APPROVE", User_PSID: "67890" },
      { Action: "APPROVE", User_PSID: "09876" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual(["12345", "67890"]);
  });

  it("should handle null or undefined actions gracefully", () => {
    const actionHistoryListData = [
      { Action: null, User_PSID: "12345" },
      { Action: undefined, User_PSID: "67890" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual([undefined, undefined]);
  });

  it("should handle missing User_PSID fields gracefully", () => {
    const actionHistoryListData = [
      { Action: "SETTLEASGROSS" },
      { Action: "APPROVE" },
    ];
    const result = findMakerFromHistory({ actionHistoryListData });
    expect(result).toEqual([undefined, undefined]);
  });
});
