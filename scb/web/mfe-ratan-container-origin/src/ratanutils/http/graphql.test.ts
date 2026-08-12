import { waitFor } from '@testing-library/react';
import { GridApi } from "ag-grid-community";
import { gql } from "@apollo/client";
import ratanConfig from "../../ratanstatic";
Object.defineProperty(window, 'ratanConfig', {
  value: { ...ratanConfig },
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

jest.mock('@apollo/client', () => {
  const operation = {
    setContext: jest.fn(),
  };
  const forward = jest.fn();
  return {
    ApolloClient: jest.fn(() => {
      return {
        query: jest.fn(() => Promise.resolve({ data: [] })),
        subscribe: jest.fn(() => {
          return {
            subscribe: jest.fn((next) => {
              next && next(res);
            }),
          };
        }),
      };
    }),
    InMemoryCache: jest.fn(() => ''),
    gql: jest.fn(),
    ApolloLink: jest.fn((callback) => callback(operation, forward)),
    HttpLink: jest.fn(),
    from: jest.fn(() => ''),
  };
});

jest.mock('@apollo/client/link/ws', () => {
  return {
    WebSocketLink: jest.fn(() => {
      return {
        subscriptionClient: {
          onDisconnected: jest.fn((callback) => callback()),
          onConnected: jest.fn((callback) => callback()),
        },
      };
    }),
  };
});

jest.mock('../init', () => {
  return {
    getBusinessFieldsFromCache: jest.fn(() => {
      return Promise.resolve({
        tradeFields: [{ indexedTerm: 'Action_Type' }],
        cashflowFields: [{ indexedTerm: 'Action_Type' }],
      });
    }),
  };
});

const api = {
  getAllDisplayedColumns: jest.fn(() => []),
} as unknown as GridApi;

test('handleError', (done) => {
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
  done();
});


test('queryGraphql', (done) => {
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
  queryGraphql("/abc", query, true).then((res) => {
    done();
  });
});


test('queryCustomTradeData', (done) => {
  queryCustomTradeData({ filters: [], results: "" }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCustomTradeData with filters', (done) => {
  queryCustomTradeData({ filters: [{field: "Trade_Id", operator: "=", values: ""}], results: "" }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeDetialsHeader', (done) => {
  queryTradeDetialsHeader({ filters: [], results: "" }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeAllFields', (done) => {
  queryTradeAllFields([]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeAllFields with fields', (done) => {
  queryTradeAllFields([{field: "Trade_Id", operator: "=", values: ""}]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeVersionsData', (done) => {
  queryTradeVersionsData([]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeVersionsData', (done) => {
  queryTradeVersionsData([], undefined, ["a"]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow', (done) => {
  queryCashflow({ filters: [], api }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow filters', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.trade_id",
      operator: "EQ",
      values: "123"
    }], api
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow columnDefs', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: []
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow else', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});


test('queryCashflow isCashflowSettlementCN', (done) => {
  queryCashflow({ filters: [], api, isCashflowSettlementCN: true }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow filters isCashflowSettlementCN', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.trade_id",
      operator: "EQ",
      values: "123"
    }], api, isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow columnDefs isCashflowSettlementCN', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: [], isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflow else isCashflowSettlementCN', (done) => {
  queryCashflow({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }], isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryComponentCashflows', (done) => {
  queryComponentCashflows({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    columnDefs: [],
    isCashflowSettlementCN: true,
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryComponentCashflows With Column Api', (done) => {
  queryComponentCashflows({
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
    done();
  });
});

test('queryComponentCashflows Without aggird', (done) => {
  queryComponentCashflows({
    filters: [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    isCashflowSettlementCN: false,
  }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflowCount CN = true', (done) => {
  queryCashflowCount(
    [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    true
  ).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});
test('queryCashflowCount CN = false', (done) => {
  queryCashflowCount(
    [{
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "123"
    }],
    false
  ).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflowPendingManualAmount', (done) => {
  queryCashflowPendingManualAmount().then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflowPendingManualAmount isCashflowSettlementCN', (done) => {
  queryCashflowPendingManualAmount(true).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTrades', (done) => {
  queryTrades({ filters: [], quickFilterName: 'all', page: 0, api }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
  
});

test('queryTrades with filterString', (done) => {
  queryTrades({ filters: [], quickFilterName: 'all', page: 0, api, filtersString: "Test_Field = 'Test'" }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});




test('queryTrades no api', (done) => {
  queryTrades({ filters: [], quickFilterName: 'all' }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryExceptionListV2', (done) => {
  queryExceptionListV2([]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCounterPartyDetails', (done) => {
  queryCounterPartyDetails('test_fm_id').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCounterPartyDetails version 2', (done) => {
  queryCounterPartyDetails('test_fm_id', true).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});
test('queryCounterPartyDetails CN', (done) => {
  queryCounterPartyDetails_CN('test_fm_id').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});
test('queryCounterPartyDetails_CN with numeric fmId', (done) => {
  const fmId = '123';
  queryCounterPartyDetails_CN(fmId).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});
test('queryCashFlowAuditTrail', (done) => {
  queryCashFlowAuditTrail('test_cashflow_id').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashFlowAuditTrail isCashflowSettlementCN', (done) => {
  queryCashFlowAuditTrail('test_cashflow_id', true).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryFmidOrCounterpartyList', (done) => {
  queryFmidOrCounterpartyList('test_search_term').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflowDialogTradeDetail', (done) => {
  queryCashflowDialogTradeDetail([{ field: 'Trade_Id', operator: 'EQ', values: ["1", "2"] }]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryTradeAuditTrail', (done) => {
  queryTradeAuditTrail('trade_id').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('querySearch', (done) => {
  querySearch('params', 0, api).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('querySearch', (done) => {
  querySearch('params').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryFetchPortfolio', (done) => {
  queryFetchPortfolio('searchTerm').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCounterpartyDynamicList', (done) => {
  queryCounterpartyDynamicList('searchField', 'searchTerm').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('subscribeCashflow', async () => {
  const callback = jest.fn();
  subscribeCashflow([], api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeCashflow isCashflowSettlementCN', async () => {
  const callback = jest.fn();
  subscribeCashflow([], api, callback, callback, callback, true);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeTrades', async () => {
  const callback = jest.fn();
  subscribeTrades([], 'all', api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});
test('subscribeTrades', async () => {
  const callback = jest.fn();
  subscribeTrades([{
    field: "trade_id",
    operator: "EQ",
    values: "123"
  }], 'all', api, callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeSubStatusCashflow', async () => {
  const callback = jest.fn();
  subscribeSubStatusCashflow([], callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('subscribeException', async () => {
  const callback = jest.fn();
  subscribeException([], callback);
  await waitFor(() => expect(callback).toBeCalled());
});

test('refreshExceptions', (done) => {
  refreshExceptions(['searchField', 'searchTerm']).then((res) => {
    expect(res).toEqual([]);
    done();
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

test('queryCashflowDialogCashflowDetail', (done) => {
  queryCashflowDialogCashflowDetail([{
    field: "Cashflow.trade_id",
    operator: "EQ",
    values: "123"
  }]).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryCashflowDialogCashflowDetail isCashflowSettlementCN', (done) => {
  queryCashflowDialogCashflowDetail([{
    field: "Cashflow.trade_id",
    operator: "EQ",
    values: "123"
  }], true).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('connectionParams', () => {
  expect(connectionParams()).toEqual({
    "Single-UI-Authorization": `${getHooks().store?.token}`,
  })
});

test('nextWrap data', async () => {
  const callback = jest.fn();
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
  const callback = jest.fn();
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

test('queryCashFlowDetails', (done) => {
  queryCashFlowDetails('test_cashflow_id').then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryGroupMessages', (done) => {
  queryGroupMessages({ filter: { Cashflow_Id: "test_cashflow_id" }, pagination: { pageNo: 0, pageSize: 10 } }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});

test('queryGroupMessages with filter is {}', (done) => {
  queryGroupMessages({ filter: {}, pagination: { pageNo: 0, pageSize: 10 } }).then((res) => {
    expect(res).toEqual([]);
    done();
  });
});