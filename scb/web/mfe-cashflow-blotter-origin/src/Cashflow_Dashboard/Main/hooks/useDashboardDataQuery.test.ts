import { getEmptyRuleGroup } from "src/Cashflow_CN/Main/utils/query-convertor";
import { generateTemplateFilterRecord } from "src/Root/import/ratancomponents";
import { act, ReduxProviderWrapper, renderHook } from "src/test/test-utils";

import { store } from "../store-redux";
import { useDashboardDataQuery, useDashboardDataQueryAPI } from "./useDashboardDataQuery";

describe("useDashboardDataQuery", () => {
  it("should combine advancedSearch and quickSearch into globalQuery", () => {
    const mockAdvancedSearch = generateTemplateFilterRecord();
    const mockQuickSearch = {};

    jest.spyOn(require("../store-redux"), "useAppSelector").mockReturnValue({
      advancedSearch: mockAdvancedSearch,
      quickSearch: mockQuickSearch,
    });

    const combineRuleGroupsMock = jest.spyOn(
      require("src/Cashflow_CN/Main/utils/query-convertor"),
      "combineRuleGroups"
    );

    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() => useDashboardDataQuery(), { wrapper });

    expect(combineRuleGroupsMock).toHaveBeenCalledWith(
      getEmptyRuleGroup(),
      getEmptyRuleGroup(),
    );
    expect(result.current.triggerQuery).toBeDefined();
  });
});

describe("useDashboardDataQueryAPI", () => {
  const mockDispatch = jest.fn();
  const mockQueryCashflowCount = jest.fn();
  const mockQueryGroupCount = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("../store-redux"), "useAppDispatch").mockReturnValue(mockDispatch);
    jest.spyOn(
      require("src/Cashflow_CN/schema/ultra-cashflow-query-count.generated"),
      "useLazySettlementCashflowDataUltraQueryCountQuery"
    ).mockReturnValue([mockQueryCashflowCount]);
    jest.spyOn(
      require("src/Cashflow_Group_Management/schema/group-message-query.generated"),
      "useLazySettlementGroupMessageCountQuery"
    ).mockReturnValue([mockQueryGroupCount]);
  });

  it("should dispatch loading and success actions for cashflow queries", async () => {
    const mockGlobalQuery = { combinator: "and", rules: [] };
    const mockStatusConfig = {
      key: "cashflow1",
      getfilters: jest.fn().mockReturnValue({}),
    };

    jest.mock("src/Cashflow_Dashboard/components/StatusIndicator", () => ({
      StatusList: [mockStatusConfig],
    }));
    mockQueryCashflowCount.mockResolvedValue({
      unwrap: jest.fn().mockResolvedValue({
        cashflowUltraQueryCount: { count: 20 },
      }),
    });

    const { result } = renderHook(() => useDashboardDataQueryAPI(mockGlobalQuery));
    const { triggerQuery } = result.current;

    await act(async () => {
      await triggerQuery();
    });

    expect(mockDispatch).toHaveBeenCalled();
  });
});
