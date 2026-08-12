import { waitFor } from '@testing-library/react';
import { GridApi } from "ag-grid-community";
import { gql } from "@apollo/client";
vi.mock("../../ratanstatic", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../ratanstatic")>();
  return {
    default: {
      ...actual.default,
      REACT_APP_SOCKET_URL_TRADES: "http://localhost",
      REACT_APP_SOCKET_URL_EXCEPTIONS: "http://localhost",
      REACT_APP_SOCKET_URL_CASHFLOW: "http://localhost",
      REACT_APP_SOCKET_URL_SUB_STATUS: "http://localhost",
    },
  };
});
import ratanConfig from "../../ratanstatic";
Object.defineProperty(window, 'ratanConfig', {
  value: {
    ...ratanConfig,
    REACT_APP_SOCKET_URL_TRADES: "http://localhost",
    REACT_APP_SOCKET_URL_EXCEPTIONS: "http://localhost",
    REACT_APP_SOCKET_URL_CASHFLOW: "http://localhost",
    REACT_APP_SOCKET_URL_SUB_STATUS: "http://localhost",
  },
  writable: true
});
import {
  handleError,
  queryGraphql,
  queryHandler,
  onDisconnected,
  onConnected,
  timeout,
  queryCustomTradeData,
  queryTradeDetialsHeader,
  queryTradeAllFields,
  queryTradeVersionsData,
  queryCashflow,
  queryComponentCashflows,
  queryCashflowPendingManualAmount,
  queryTrades,
  queryTradeAuditTrail,
  queryExceptionListV2,
  queryCounterPartyDetails,
  queryCounterPartyDetails_CN,
  queryCashFlowAuditTrail,
  queryFmidOrCounterpartyList,
  queryCashflowDialogTradeDetail,
  queryCashFlowDetails,
  queryGroupMessages,
  querySearch,
  queryFetchPortfolio,
  queryCounterpartyDynamicList,
  subscribeCashflow,
  subscribeSubStatusCashflow,
  subscribeTrades,
  subscribeException,
  refreshExceptions,
  judgeDefaultFilter,
  queryCashflowDialogCashflowDetail,
  connectionParams,
  nextWrap,
  queryCashflowCount,
} from './graphql';

import { Hooks } from "../../Root/import";
const { getHooks } = Hooks;

const res = {
  onExceptionEvent: {
    payload: {
      exceptionCode: 'test_exception_code',
      referenceId: 'test_reference_id',
    },
  },
};

vi.mock('@apollo/client', () => {
  const operation = {
    setContext: vi.fn(),
  };
  const forward = vi.fn();
  return {
    ApolloClient: vi.fn(function () {
      return {
        query: vi.fn(() => Promise.resolve({ data: [] })),
        subscribe: vi.fn(() => {
          return {
            subscribe: vi.fn((next) => {
              next && next(res);
            }),
          };
        }),
      };
    }),
    InMemoryCache: vi.fn(function () { return ''; }),
    gql: vi.fn(),
    ApolloLink: vi.fn(function (callback) { return callback(operation, forward); }),
    HttpLink: vi.fn(function () {}),
    from: vi.fn(() => ''),
  };
});

vi.mock('@apollo/client/link/ws', () => {
  return {
    WebSocketLink: vi.fn(function () {
      return {
        subscriptionClient: {
          onDisconnected: vi.fn((callback) => callback()),
          onConnected: vi.fn((callback) => callback()),
        },
      };
    }),
  };
});

vi.mock('../init', () => {
  return {
    getBusinessFieldsFromCache: vi.fn(() => {
      return Promise.resolve({
        tradeFields: [{ indexedTerm: 'Action_Type' }],
        cashflowFields: [{ indexedTerm: 'Action_Type' }],
      });
    }),
  };
});

const api = {
  getAllDisplayedColumns: vi.fn(() => []),
} as unknown as GridApi;

test('handleError', async () => {
  handleError("/abc")({
    graphQLErrors: [{
      message: "",
      // @ts-ignore
      locations: "",
      path: ["Confirmation.Confirmation_Workflow_Status"]
    }],
    networkError: {
      statusCode: 401,
      response: { url: "/abc" }
    } as any
  });
  handleError("/abc")({
    graphQLErrors: [{
      message: "",
      // @ts-ignore
      locations: "",
      path: undefined
    }],
    networkError: {
      statusCode: 401,
      response: {}
    } as any
  });
  // @ts-ignore
  handleError("/abc")({
    graphQLErrors: undefined,
    networkError: {
      statusCode: 500,
      response: {}
    } as any
  });
  // @ts-ignore
  handleError("/abc")({
    graphQLErrors: undefined,
    networkError: {
      statusCode: 500,
      response: undefined
    } as any
  });
  // @ts-ignore
  handleError("/abc")({
    graphQLErrors: undefined,
    networkError: undefined
  });
});


test('queryGraphql', async () => {
  queryHandler(true)({ errors: [{ path: ["FMO_Comments"] }], data: { trades: { results: [{ a: "a" }] } } });
  queryHandler(true)({ errors: [{ path: ["NONE"] }], data: { cashflows: { results: [{ a: "a" }] } } });
  queryHandler(true)({ data: { trades: { results: [{ a: "a" }] } } });
  queryHandler(true)({ data: { cashflows: { results: [{ a: "a" }] } } });

  const query = gql`
    query {
      trades() {
        pageInfo {
          totalHits
          pageNo
          pageSize
          lastPage
        }
        results {}  
      }
    }
  `;
  const v = () => { };
  const mockHost = "localhost"
  const url = `ws://${mockHost}/api/ratan/stmcn/v1/cashflows`;
  timeout(url, query, v, v, v, 1)();
  onDisconnected(url, query, v, v, v);
  onConnected(url);
  timeout(url, query, v, v, v, 4)();
  onDisconnected(url, query, v, v, v);
  onConnected(url);
  timeout(url, query, v, v, v, 5)();
  onDisconnected(url, query, v, v, v);
  onConnected(url);
  await queryGraphql("/abc", query, true).then((res) => {
  });
});


test('queryCustomTradeData', async () => {
  await queryCustomTradeData({ filters: [], results: "" }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCustomTradeData with filters', async () => {
  await queryCustomTradeData({ filters: [{field: "Trade_Id", operator: "=", values: ""}], results: "" }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeDetialsHeader', async () => {
  await queryTradeDetialsHeader({ filters: [], results: "" }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeAllFields', async () => {
  await queryTradeAllFields([]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeAllFields with fields', async () => {
  await queryTradeAllFields([{field: "Trade_Id", operator: "=", values: ""}]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeVersionsData', async () => {
  await queryTradeVersionsData([]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeVersionsData', async () => {
  await queryTradeVersionsData([], undefined, ["a"]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow', async () => {
  await queryCashflow({ filters: [], api }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow filters', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.trade_id",
      operator: "EQ",
      values: "123"
    }], api
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow columnDefs', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: []
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow else', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
  }).then((res) => {
    expect(res).toEqual([]);
  });
});


test('queryCashflow isCashflowSettlementCN', async () => {
  await queryCashflow({ filters: [], api, isCashflowSettlementCN: true }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow filters isCashflowSettlementCN', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.trade_id",
      operator: "EQ",
      values: "123"
    }], api, isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow columnDefs isCashflowSettlementCN', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: [], isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflow else isCashflowSettlementCN', async () => {
  await queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }], isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryComponentCashflows', async () => {
  await queryComponentCashflows({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: [],
    isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryComponentCashflows With Column Api', async () => {
  await queryComponentCashflows({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    //@ts-ignores
    api: {
      getAllDisplayedColumns: () => []
    }
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryComponentCashflows Without aggird', async () => {
  await queryComponentCashflows({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    isCashflowSettlementCN: false,
  }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflowCount CN = true', async () => {
  await queryCashflowCount(
    [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    true
  ).then((res) => {
    expect(res).toEqual([]);
  });
});
test('queryCashflowCount CN = false', async () => {
  await queryCashflowCount(
    [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    false
  ).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflowPendingManualAmount', async () => {
  await queryCashflowPendingManualAmount().then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflowPendingManualAmount isCashflowSettlementCN', async () => {
  await queryCashflowPendingManualAmount(true).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTrades', async () => {
  await queryTrades({ filters: [], quickFilterName: 'all', page: 0, api }).then((res) => {
    expect(res).toEqual([]);
  });
  
});

test('queryTrades with filterString', async () => {
  await queryTrades({ filters: [], quickFilterName: 'all', page: 0, api, filtersString: "Test_Field = 'Test'" }).then((res) => {
    expect(res).toEqual([]);
  });
});




test('queryTrades no api', async () => {
  await queryTrades({ filters: [], quickFilterName: 'all' }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryExceptionListV2', async () => {
  await queryExceptionListV2([]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCounterPartyDetails', async () => {
  await queryCounterPartyDetails('test_fm_id').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCounterPartyDetails version 2', async () => {
  await queryCounterPartyDetails('test_fm_id', true).then((res) => {
    expect(res).toEqual([]);
  });
});
test('queryCounterPartyDetails CN', async () => {
  await queryCounterPartyDetails_CN('test_fm_id').then((res) => {
    expect(res).toEqual([]);
  });
});
test('queryCounterPartyDetails_CN with numeric fmId', async () => {
  const fmId = '123';
  await queryCounterPartyDetails_CN(fmId).then((res) => {
    expect(res).toEqual([]);
  });
});
test('queryCashFlowAuditTrail', async () => {
  await queryCashFlowAuditTrail('test_cashflow_id').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashFlowAuditTrail isCashflowSettlementCN', async () => {
  await queryCashFlowAuditTrail('test_cashflow_id', true).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryFmidOrCounterpartyList', async () => {
  await queryFmidOrCounterpartyList('test_search_term').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflowDialogTradeDetail', async () => {
  await queryCashflowDialogTradeDetail([{ field: 'Trade_Id', operator: 'EQ', values: ["1", "2"] }]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryTradeAuditTrail', async () => {
  await queryTradeAuditTrail('trade_id').then((res) => {
    expect(res).toEqual([]);
  });
});

test('querySearch', async () => {
  await querySearch('params', 0, api).then((res) => {
    expect(res).toEqual([]);
  });
});

test('querySearch', async () => {
  await querySearch('params').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryFetchPortfolio', async () => {
  await queryFetchPortfolio('searchTerm').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCounterpartyDynamicList', async () => {
  await queryCounterpartyDynamicList('searchField', 'searchTerm').then((res) => {
    expect(res).toEqual([]);
  });
});

test('subscribeCashflow', async () => {
  const callback = vi.fn();
  subscribeCashflow([], api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeCashflow isCashflowSettlementCN', async () => {
  const callback = vi.fn();
  subscribeCashflow([], api, callback, callback, callback, true);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeTrades', async () => {
  const callback = vi.fn();
  subscribeTrades([], 'all', api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});
test('subscribeTrades', async () => {
  const callback = vi.fn();
  subscribeTrades([{
    field: "trade_id",
    operator: "EQ",
    values: "123"
  }], 'all', api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeSubStatusCashflow', async () => {
  const callback = vi.fn();
  subscribeSubStatusCashflow([], callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeException', async () => {
  const callback = vi.fn();
  subscribeException([], callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('refreshExceptions', async () => {
  await refreshExceptions(['searchField', 'searchTerm']).then((res) => {
    expect(res).toEqual([]);
  });
});

test('judgeDefaultFilter', () => {
  expect(judgeDefaultFilter(true, [{
    field: "trade_id",
    operator: "EQ",
    values: "123"
  }])).toBeTruthy();
  expect(judgeDefaultFilter(false, [{
    field: "trade_id",
    operator: "EQ",
    values: "123"
  }])).toBeFalsy();
  expect(judgeDefaultFilter(undefined, [{
    field: "Cashflow.Cashflow_State",
    operator: "EQ",
    values: "123"
  }])).toBeTruthy();
  expect(judgeDefaultFilter(undefined, [{
    field: "Cashflow.trade_id",
    operator: "EQ",
    values: "123"
  }])).toBeFalsy();
});

test('queryCashflowDialogCashflowDetail', async () => {
  queryCashflowDialogCashflowDetail([{
    field: "Cashflow.trade_id",
    operator: "EQ",
    values: "123"
  }]).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryCashflowDialogCashflowDetail isCashflowSettlementCN', async () => {
  queryCashflowDialogCashflowDetail([{
    field: "Cashflow.trade_id",
    operator: "EQ",
    values: "123"
  }], true).then((res) => {
    expect(res).toEqual([]);
  });
});

test('connectionParams', () => {
  expect(connectionParams()).toEqual({
    "Single-UI-Authorization": `${getHooks().store?.token}`,
  })
});

test('nextWrap data', async () => {
  const callback = vi.fn();
  nextWrap(callback)({
    data: {
      onExceptionEvent: {
        payload: {
          exceptionId: "",
          exceptionCode: ""
        }
      }
    }
  });
  await waitFor(() => expect(callback).toBeCalled());
});

test('nextWrap', async () => {
  const callback = vi.fn();
  nextWrap(callback)({
    onExceptionEvent: {
      payload: {
        exceptionId: "",
        exceptionCode: ""
      }
    }
  });
  await waitFor(() => expect(callback).toBeCalled());
});

test('queryCashFlowDetails', async () => {
  await queryCashFlowDetails('test_cashflow_id').then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryGroupMessages', async () => {
  await queryGroupMessages({ filter: { Cashflow_Id: "test_cashflow_id" }, pagination: { pageNo: 0, pageSize: 10 } }).then((res) => {
    expect(res).toEqual([]);
  });
});

test('queryGroupMessages with filter is {}', async () => {
  await queryGroupMessages({ filter: {}, pagination: { pageNo: 0, pageSize: 10 } }).then((res) => {
    expect(res).toEqual([]);
  });
});

vi.mock('subscriptions-transport-ws', () => ({
  SubscriptionClient: vi.fn(function () {
    return {};
  }),
}));

vi.mock('../holidayDB', () => ({
  default: { clear: vi.fn() },
}));
