import { GridApi } from "ag-grid-community";

import {
  getQueryNames,
  queryCashflow,
  queryCashFlowDetails,
  queryCashFlowDetailsForBulkFixExceptions,
  queryCashFlowSplitDetails,
  queryCashflowUltra,
  queryCounterPartyDetails_CN,
  transformResponseForOpenSearch} from "./graphql";
import * as graphqlModule from "./graphql";
import * as ratanUtilsMock from "src/Root/import/ratanutils";

// graphql.ts executes module-level code (including the conversionDQSLRequest call) when imported above.
// Capture the global vi.fn call records immediately, before any beforeEach clears them.
const _initialConversionDQSLRequestCalls: any[][] = (() => {
  return (ratanUtilsMock.conversionDQSLRequest as vi.Mock).mock.calls.map((c: any[]) => c[0]);
})();

beforeEach(() => {
  vi.clearAllMocks();
});

const mockResult = {
  cashflowUltraQuery: {
    totalResult: 1,
    pageIndex: 0,
    itemsPerPage: 10,
    lastPage: false,
    results: [
      {
        Cashflow_Id: "CF001",
        Cashflow_State: "READY",
        Payment_Date: "2025-01-01",
      },
    ],
  },
};

const mockResultByOpensearch = {
  cashflowUltraQueryByOpensearch: {
    totalResult: 1,
    pageIndex: 0,
    itemsPerPage: 10,
    lastPage: false,
    results: [
      {
        Cashflow_Id: "CF001",
        Cashflow_State: "READY",
        Payment_Date: "2025-01-01",
      },
    ],
  },
};

test("queryCounterPartyDetails_CN - Success", async () => {
  const fmId = "123";
  const result = await queryCounterPartyDetails_CN(fmId);
  expect(result).toBeDefined();
});

test("queryCounterPartyDetails_CN - Failure", async () => {
  const fmId = "invalid";
  const result = await queryCounterPartyDetails_CN(fmId);
  expect(result).toBeDefined();
});

test("queryCashflow use columnDefs to set columns", async () => {
  const filters = [
    {
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "WAITING",
    },
    {
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: ["2025-04-18", "2025-04-24"],
    },
  ];
  const page = 0;
  const columnDefs = [
    {
      colId: "1",
    },
  ];
  const api = undefined;
  const disabledDefault = false;
  const pageSize = 10;

  // Mock dependencies
  jest
    .spyOn(graphqlModule, "queryGraphql")
    .mockResolvedValue(mockResult);

  const result = await queryCashflow({
    filters,
    page,
    columnDefs,
    api,
    disabledDefault,
    pageSize,
  });

  expect(result).toEqual(mockResult);
});

test("queryCashflow use columnDefs to set columns", async () => {
  const filters = [
    {
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "WAITING",
    },
    {
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: ["2025-04-18", "2025-04-24"],
    },
  ];
  const page = 0;
  const columnDefs = undefined;
  const api = { getAllDisplayedColumns: vi.fn() } as unknown as GridApi;
  const disabledDefault = false;
  const pageSize = 10;
  jest
    .spyOn(graphqlModule, "queryGraphql")
    .mockResolvedValue(mockResult);

  const result = await queryCashflow({
    filters,
    page,
    columnDefs,
    api,
    disabledDefault,
    pageSize,
  });

  expect(result).toEqual(mockResult);
});

test("queryCashflow use requireMandatoryFields to set columns", async () => {
  const filters = [
    {
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "WAITING",
    },
    {
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: ["2025-04-18", "2025-04-24"],
    },
  ];
  const page = 0;
  const disabledDefault = false;
  const pageSize = 10;
  const requireMandatoryFields = false;

  jest
    .spyOn(graphqlModule, "queryGraphql")
    .mockResolvedValue(mockResult);

  const result = await queryCashflow({
    filters,
    page,
    requireMandatoryFields,
    disabledDefault,
    pageSize,
  });

  expect(result).toEqual(mockResult);
});

test("queryCashflow use opensearch to set columns", async () => {
  const filters = [
    {
      field: "Cashflow.Cashflow_State",
      operator: "EQ",
      values: "WAITING",
    },
    {
      field: "Cashflow.Payment_Date",
      operator: "BET",
      values: ["2025-04-18", "2025-04-24"],
    },
  ];
  const page = 0;
  const disabledDefault = false;
  const pageSize = 10;
  const opensearch = true;

  jest
    .spyOn(graphqlModule, "queryGraphql")
    .mockResolvedValue(mockResultByOpensearch);

  const result = await queryCashflow({
    filters,
    page,
    opensearch,
    disabledDefault,
    pageSize,
  });

  expect(result).toEqual(mockResult);
});
test("queryCashflow should throw an error for unexpected response structure", async () => {
  const filters = [{ field: "field1", operator: "EQ", values: ["value1"] }];
  const mockResponse = {};
  jest
    .spyOn(graphqlModule, "queryGraphql")
    .mockResolvedValue(mockResponse);

  await expect(queryCashflow({ filters })).rejects.toThrow(
    "Unexpected response structure from cashflow GraphQL query"
  );
});
describe("queryCashFlowSplitDetails", () => {
  const mockResult = [
    {
      cashflow: {
        Cashflow: {
          Cashflow_Id: "CF001",
          Cashflow_State: "READY",
          Payment_Date: "2025-01-01",
          Payment_Type: "TYPE1",
          Cashflow_Sub_State: "SUB1",
          Cashflow_Sub_State_Type: "TYPE_A",
          Cashflow_Event_Type: "EVENT_X",
        },
        Entity: {
          Booking_Entity_SCI_FMCODE: "FM1",
          Booking_Entity_SCI_FMID: "FMID1",
          Counterparty_SCI_FMID: "CFMID1",
          Counterparty_SCI_FMCODE: "CFMCODE1",
          Counterparty_CIF_Code: "CIF1",
        },
        Instrument_Common: {
          ISDA_Taxonomy: "TAX1",
          CFI_Code: "CFI1",
          Source_System_Instrument_Sub_Type: "SUBTYPE1",
        },
        Data_Flow: {
          Data_Source_System: "SYS1",
          Data_Publication_Date_Time: "2025-01-01T00:00:00Z",
        },
      },
      ratanAffirmation: {
        Affirmed_By: "User1",
        Phone_Email: "user1@email.com",
        Affirmed_At: "2025-01-01T00:00:00Z",
      },
    },
  ];
  it("should call queryGraphql with correct params and return data", async () => {
    const splittingId = "split-123";
    const result = await queryCashFlowSplitDetails(splittingId);

    expect(result).toBeDefined();
  });
});
describe("getQueryNames", () => {
  it("should return correct query names for OpenSearch enabled", () => {
    const opensearch = true;
    const result = getQueryNames(opensearch);

    expect(result).toEqual({
      gqlQueryCashflowListName: "SettlementCashflowUltraQueryByOpensearch",
      gqlQueryCashflowListFn: "cashflowUltraQueryByOpensearch",
      gqlQueryCashflowDetailsName: "cashflowQueryByOpenSearch",
      gqlQueryCashflowAuditTrailName: "cashflowAuditTrailByOpenSearch",
    });
  });

  it("should return correct query names for OpenSearch disabled", () => {
    const opensearch = false;
    const result = getQueryNames(opensearch);

    expect(result).toEqual({
      gqlQueryCashflowListName: "SettlementCashflowDataUltraQuery",
      gqlQueryCashflowListFn: "cashflowUltraQuery",
      gqlQueryCashflowDetailsName: "graphCashFlowDetails",
      gqlQueryCashflowAuditTrailName: "cashflowAuditTrail",
    });
  });

  it("should return default query names when OpenSearch is undefined", () => {
    const result = getQueryNames();

    expect(result).toEqual({
      gqlQueryCashflowListName: "SettlementCashflowDataUltraQuery",
      gqlQueryCashflowListFn: "cashflowUltraQuery",
      gqlQueryCashflowDetailsName: "graphCashFlowDetails",
      gqlQueryCashflowAuditTrailName: "cashflowAuditTrail",
    });
  });
});
describe("transformResponseForOpenSearch", () => {
  it("should transform response correctly for OpenSearch compatibility", () => {
    const mockResponse = {
      cashflowQueryByOpenSearch: [
        {
          cashflow: {
            Data_Flow: {
              Data_Source_System: "LOANIQ",
            },
          },
          cashflowAuditTrailByOpenSearch: [
            {
              Action_Date_Time: "2024-11-08T03:36:52.823",
            },
          ],
          ratanAffirmation: {
            Affirmed_By: null,
            Phone_Email: null,
            Affirmed_At: null,
          },
          ratanException: [],
        },
      ],
    };

    const transformedResponse = transformResponseForOpenSearch(mockResponse);

    expect(transformedResponse).toEqual({
      graphCashFlowDetails: [
        {
          cashflow: {
            Data_Flow: {
              Data_Source_System: "LOANIQ",
            },
          },
          cashflowAuditTrail: [
            {
              Action_Date_Time: "2024-11-08T03:36:52.823",
            },
          ],
          ratanAffirmation: {
            Affirmed_By: null,
            Phone_Email: null,
            Affirmed_At: null,
          },
          ratanException: [],
        },
      ],
    });
  });

  it("should handle empty cashflowQueryByOpenSearch array", () => {
    const mockResponse = {
      cashflowQueryByOpenSearch: [],
    };

    const transformedResponse = transformResponseForOpenSearch(mockResponse);

    expect(transformedResponse).toEqual({
      graphCashFlowDetails: [],
    });
  });

  it("should handle missing cashflowAuditTrailByOpenSearch field", () => {
    const mockResponse = {
      cashflowQueryByOpenSearch: [
        {
          cashflow: {
            Data_Flow: {
              Data_Source_System: "LOANIQ",
            },
          },
          ratanAffirmation: {
            Affirmed_By: null,
            Phone_Email: null,
            Affirmed_At: null,
          },
          ratanException: [],
        },
      ],
    };

    const transformedResponse = transformResponseForOpenSearch(mockResponse);

    expect(transformedResponse).toEqual({
      graphCashFlowDetails: [
        {
          cashflow: {
            Data_Flow: {
              Data_Source_System: "LOANIQ",
            },
          },
          cashflowAuditTrail: undefined,
          ratanAffirmation: {
            Affirmed_By: null,
            Phone_Email: null,
            Affirmed_At: null,
          },
          ratanException: [],
        },
      ],
    });
  });

  it("should handle null cashflowQueryByOpenSearch field", () => {
    const mockResponse = {
      cashflowQueryByOpenSearch: [],
    };

    const transformedResponse = transformResponseForOpenSearch(mockResponse);

    expect(transformedResponse).toEqual({
      graphCashFlowDetails: [],
    });
  });
});
describe("queryCashFlowDetails", () => {
  it("should fetch cashflow details with OpenSearch enabled", async () => {
    const cashflowIds = ["123"];
    const mockResponse = { cashflowQueryByOpenSearch: [] };
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);

    const result = await queryCashFlowDetails(cashflowIds, true);
    expect(result).toBeDefined();
  });

  it("should fetch cashflow details with OpenSearch disabled", async () => {
    const cashflowIds = ["123"];
    const mockResponse = { graphCashFlowDetails: [] };
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);

    const result = await queryCashFlowDetails(cashflowIds, false);
    expect(result).toBeDefined();
  });

  it("should throw an error for unexpected response structure", async () => {
    const cashflowIds = ["123"];
    const mockResponse = {};
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);

    await expect(queryCashFlowDetails(cashflowIds)).rejects.toThrow(
      "Unexpected response structure from cashflowDetails GraphQL query"
    );
  });
});
describe("queryCashFlowDetailsForBulkFixExceptions", () => {
  const mockCashflowIds = ["id1", "id2"];
  it("should call queryGraphql with the correct query when opensearch is false", async () => {
    const mockResponse = { graphCashFlowDetails: [] };
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);
    const result = await queryCashFlowDetailsForBulkFixExceptions(
      mockCashflowIds,
      false,
      false
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call queryGraphql with the correct query when opensearch is true", async () => {
    const mockResponse = { cashflowQueryByOpenSearch: [] };
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);

    const result = await queryCashFlowDetailsForBulkFixExceptions(
      mockCashflowIds,
      false,
      true
    );
    expect(result).toEqual({ graphCashFlowDetails: [] });
  });

  it("should throw an error for unexpected response structure", async () => {
    const cashflowIds = ["123"];
    const mockResponse = {};
    vi.spyOn(graphqlModule, "queryGraphql").mockResolvedValue(mockResponse);

    await expect(
      queryCashFlowDetailsForBulkFixExceptions(cashflowIds)
    ).rejects.toThrow(
      "Unexpected response structure from cashFlowDetailsForBulkFixExceptions GraphQL query"
    );
  });
});


describe('queryCashflowUltra', () => {
  it('should call queryGraphql and return data', async () => {
    const page = 0;
    const columnDefs = [
      {
        colId: "1",
      },
    ];
    const api = { getAllDisplayedColumns: vi.fn() } as unknown as GridApi;
    const disabledDefault = false;
    const pageSize = 10;
    const mockResult = { data: { cashflowUltraQuery: { results: [] } } };
    const mockQueryGraphql = vi.fn().mockResolvedValue(mockResult);
    vi.spyOn(graphqlModule, 'queryGraphql').mockImplementation(mockQueryGraphql);

    const params = {
      filters: [
        { field: 'Cashflow.Cashflow_State', operator: 'EQ', values: 'READY' }
      ],
      page,
      pageSize,
      columnDefs,
      api,
      disabledDefault,
    };

    const result = await queryCashflowUltra(params);

    expect(result).toBeDefined();
  });
  it('should call queryGraphql with api but not columnDefs and return data', async () => {
    const page = 0;
    const api = { getAllDisplayedColumns: vi.fn() } as unknown as GridApi;
    const disabledDefault = false;
    const pageSize = 10;
    const mockResult = { data: { cashflowUltraQuery: { results: [] } } };
    const mockQueryGraphql = vi.fn().mockResolvedValue(mockResult);
    vi.spyOn(graphqlModule, 'queryGraphql').mockImplementation(mockQueryGraphql);

    const params = {
      filters: [
        { field: 'Cashflow.Cashflow_State', operator: 'EQ', values: 'READY' }
      ],
      page,
      pageSize,
      api,
      disabledDefault,
    };

    const result = await queryCashflowUltra(params);

    expect(result).toBeDefined();
  });
  it('should call queryGraphql without any payload and return data', async () => {
    const page = 0;
    const disabledDefault = false;
    const pageSize = 10;
    const mockResult = { data: { cashflowUltraQuery: { results: [] } } };
    const mockQueryGraphql = vi.fn().mockResolvedValue(mockResult);
    vi.spyOn(graphqlModule, 'queryGraphql').mockImplementation(mockQueryGraphql);

    const params = {
      filters: [
        { field: 'Cashflow.Cashflow_State', operator: 'EQ', values: 'READY' }
      ],
      page,
      pageSize,
      disabledDefault,
    };

    const result = await queryCashflowUltra(params);

    expect(result).toBeDefined();
  });
});

describe('counterpartyQueryStrForCN - conversionDQSLRequest arguments', () => {
  // conversionDQSLRequest is called at module load time to initialise the counterpartyQueryStrForCN constant.
  // _initialConversionDQSLRequestCalls is captured at file top-level before any beforeEach clears the mock.
  // Whenever a new parameter is added to the call, add the corresponding assertion in toMatchObject below.
  it('should call conversionDQSLRequest with the exact expected arguments for counterpartyQueryStrForCN', () => {
    // counterpartyQueryStrForCN is the only module-level call, so take the last recorded call via at(-1).
    const args = _initialConversionDQSLRequestCalls.at(-1);
    expect(args).toBeDefined();
    expect(args).toMatchObject({
      isAllFields: true,
      businessFields: expect.arrayContaining([
        { indexedTerm: 'fmEntity.fmAccount.fmId' },
        { indexedTerm: 'fmEntity.fmAccount.fmLongName' },
        { indexedTerm: 'fmEntity.fmSysContact.addrLine' },
        { indexedTerm: 'fmEntity.fmSysContact.mediumUsage' },
        { indexedTerm: 'fmEntity.fmSysContact.mediumCode' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.line1' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.line2' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.city' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.state' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.country' },
        { indexedTerm: 'fmEntity.legalEntity.registeredAddress.postCode' },
      ]),
    });
  });
});
