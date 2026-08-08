import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

export const CASHFLOW_LIST_OPERATION = 'SettlementCashflowDataUltraQuery';
export const CASHFLOW_DETAIL_OPERATION = 'graphCashFlowDetails';

interface CashflowDevRequest {
  readonly method: string;
  readonly pathname: string;
  readonly body?: unknown;
}

interface CashflowDevResponse {
  readonly status: number;
  readonly body: unknown;
}

interface GraphqlRequest {
  readonly operationName?: string;
  readonly query?: string;
  readonly variables?: unknown;
}

const CASHFLOW_FIELDS = [
  ['Cashflow.Cashflow_Id', 'Cashflow ID', 'String'],
  ['Cashflow.Cashflow_State', 'Cashflow State', 'String'],
  ['Cashflow.Cashflow_Version', 'Cashflow Version', 'Number'],
  ['Cashflow.Cashflow_Business_Version', 'Business Version', 'Number'],
  ['Cashflow.Cashflow_Minor_Version', 'Minor Version', 'Number'],
  ['Cashflow.Cashflow_Affirmation_Status', 'Affirmation Status', 'String'],
  ['Cashflow.Cashflow_Sub_State', 'Cashflow Sub State', 'String'],
  ['Cashflow.Cashflow_Sub_State_Type', 'Sub State Type', 'String'],
  ['Cashflow.Payment_Date', 'Value Date', 'Date'],
  ['Cashflow.Payment_Currency', 'Currency', 'String'],
  ['Cashflow.Payment_Amount', 'Payment Amount', 'Number'],
  ['Cashflow.Payment_Cutoff_Time', 'Release Time', 'DateTime'],
  ['Cashflow.Pay_Receive_Indicator', 'Pay/Receive', 'String'],
  ['Trade_Id', 'Trade ID', 'String'],
  ['Parent_Trade_Id', 'Parent Trade ID', 'String'],
  ['Trade_State', 'Trade State', 'String'],
  ['Settlement_Method', 'Settlement Method', 'String'],
  ['Delivery_Method', 'Delivery Method', 'String'],
  ['Entity.Booking_Entity_SCI_FMID', 'Booking Entity FMID', 'String'],
  ['Entity.Booking_Entity_SCI_FMCODE', 'SCB Booking Entity', 'String'],
  ['Entity.Counterparty_SCI_FMCODE', 'Counterparty FMCODE', 'String'],
  ['Portfolio.Booking_Entity_Trade_Portfolio_Name', 'Portfolio', 'String'],
  ['Instrument_Common.ISDA_Taxonomy', 'Product Taxonomy', 'String'],
] as const;

const businessFields = CASHFLOW_FIELDS.map(([indexedTerm, businessTerm, dataType]) => ({
  indexedTerm,
  businessTerm,
  dataType,
  context: ['CASHFLOW_DATA'],
  blotterContext: ['CASHFLOW_DATA'],
  scope: JSON.stringify({ disabledBlotter: [] }),
}));

const cashflowRows = [
  {
    BCS_Trade_Id: 'TRD-CN-90001',
    BCS_Parent_Trade_Id: 'TRD-CN-90001',
    Trade_Id: 'TRD-CN-90001',
    Parent_Trade_Id: 'TRD-CN-90001',
    Trade_Version: 1,
    Trade_State: 'VALIDATED',
    Trade_Date: '2026-07-27',
    Trade_Original_Source_System_Name: 'Murex',
    Settlement_Method: 'CNAPS',
    Delivery_Method: 'GROSS',
    Cashflow: {
      Cashflow_Id: 'CF-CN-24001',
      Cashflow_Business_Version: 1,
      Cashflow_Version: 3,
      Cashflow_Minor_Version: 0,
      Cashflow_State: 'WAITING',
      Cashflow_Affirmation_Status: 'AFFIRMED',
      Cashflow_Event_Type: 'NEW',
      Cashflow_Sub_State: 'Pending Verification',
      Cashflow_Sub_State_Type: 'Pending Operator',
      Payment_Date: '2026-07-29',
      Payment_Currency: 'USD',
      Payment_Amount: '1250000',
      Payment_Type: 'Principal',
      Payment_Cutoff_Time: '2026-07-29T09:00:00Z',
      Pay_Receive_Indicator: 'Pay',
      Payment_Payer_Party_Reference: 'SCB-SH',
      Payment_Receiver_Party_Reference: 'CP-SH',
      Netting_Id: '',
    },
    Entity: {
      Booking_Entity_SCI_FMID: 'FM Shanghai',
      Booking_Entity_SCI_FMCODE: 'FM Shanghai',
      Counterparty_SCI_FMCODE: 'Shanghai Clearing House',
    },
    Portfolio: {
      Booking_Entity_Trade_Portfolio_Name: 'CN Rates Operations',
    },
    Instrument_Common: {
      ISDA_Taxonomy: 'Foreign Exchange:Forward',
      Financial_Instrument_Code: 'FWD',
    },
    Data_Flow: {
      Data_Source_System: 'Murex',
      Data_Publication_Date_Time: '2026-07-28T08:30:00Z',
    },
    FMO_Comments: 'Priority settlement',
  },
  {
    BCS_Trade_Id: 'TRD-CN-90002',
    BCS_Parent_Trade_Id: 'TRD-CN-90002',
    Trade_Id: 'TRD-CN-90002',
    Parent_Trade_Id: 'TRD-CN-90002',
    Trade_Version: 2,
    Trade_State: 'VALIDATED',
    Trade_Date: '2026-07-27',
    Trade_Original_Source_System_Name: 'Calypso',
    Settlement_Method: 'SWIFT',
    Delivery_Method: 'GROSS',
    Cashflow: {
      Cashflow_Id: 'CF-CN-24002',
      Cashflow_Business_Version: 2,
      Cashflow_Version: 4,
      Cashflow_Minor_Version: 1,
      Cashflow_State: 'WAITING',
      Cashflow_Affirmation_Status: 'PENDING',
      Cashflow_Event_Type: 'AMEND',
      Cashflow_Sub_State: 'Pending Operator',
      Cashflow_Sub_State_Type: 'Settlement Review',
      Payment_Date: '2026-07-30',
      Payment_Currency: 'CNY',
      Payment_Amount: '8600000',
      Payment_Type: 'Interest',
      Payment_Cutoff_Time: '2026-07-30T07:00:00Z',
      Pay_Receive_Indicator: 'Receive',
      Payment_Payer_Party_Reference: 'CP-BJ',
      Payment_Receiver_Party_Reference: 'SCB-SH',
      Netting_Id: '',
    },
    Entity: {
      Booking_Entity_SCI_FMID: 'FM Shanghai',
      Booking_Entity_SCI_FMCODE: 'FM Shanghai',
      Counterparty_SCI_FMCODE: 'Beijing Markets Ltd',
    },
    Portfolio: {
      Booking_Entity_Trade_Portfolio_Name: 'CN Rates Operations',
    },
    Instrument_Common: {
      ISDA_Taxonomy: 'Interest Rate:Swap',
      Financial_Instrument_Code: 'IRS',
    },
    Data_Flow: {
      Data_Source_System: 'Calypso',
      Data_Publication_Date_Time: '2026-07-28T08:35:00Z',
    },
    FMO_Comments: 'Checker review required',
  },
] as const;

const savedFilter = {
  rowKey: 'filter-usd-pending',
  name: 'USD pending verification',
  owner: 'test',
  creator: 'test',
  moduleOwner: 'portal-host',
  assigneeList: [],
  type: 'STRATEGIC_CASHFLOW_FILTER_BUILDER',
  isPublic: false,
  body: JSON.stringify({
    combinator: 'and',
    rules: [
      {
        field: 'Cashflow.Payment_Date',
        operator: '=',
        value: '2026-07-29',
      },
      {
        field: 'Cashflow.Cashflow_State',
        operator: '=',
        value: 'WAITING',
      },
      {
        field: 'Entity.Booking_Entity_SCI_FMID',
        operator: '=',
        value: 'FM Shanghai',
      },
      {
        field: 'Cashflow.Payment_Currency',
        operator: '=',
        value: 'USD',
      },
      {
        field: 'Cashflow.Cashflow_Sub_State',
        operator: '=',
        value: 'Pending Verification',
      },
    ],
  }),
};

const savedView = {
  rowKey: 'view-operations',
  name: 'Operations essentials',
  owner: 'test',
  creator: 'test',
  moduleOwner: 'portal-host',
  assigneeList: [],
  type: 'CASHFLOW_CN_VIEW_BUILDER',
  isPublic: false,
  body: JSON.stringify([
    { colId: 'Cashflow.Cashflow_Id', hide: false },
    { colId: 'Cashflow.Cashflow_State', hide: false },
    { colId: 'Cashflow.Payment_Date', hide: false },
    { colId: 'Cashflow.Payment_Currency', hide: false },
    { colId: 'Cashflow.Payment_Amount', hide: false },
    { colId: 'Trade_Id', hide: false },
    { colId: 'Entity.Booking_Entity_SCI_FMCODE', hide: false },
  ]),
};

function isGraphqlRequest(body: unknown): body is GraphqlRequest {
  return typeof body === 'object' && body !== null;
}

function graphqlResponse(body: GraphqlRequest | undefined): CashflowDevResponse {
  const operationName = body?.operationName ?? '';
  const query = body?.query ?? '';

  if (operationName === CASHFLOW_LIST_OPERATION || query.includes('cashflowUltraQuery')) {
    const requestText = JSON.stringify(body);
    let results = requestText.includes('"USD"')
      ? cashflowRows.filter(({ Cashflow }) => Cashflow.Payment_Currency === 'USD')
      : cashflowRows;
    const requestedCashflowIds = cashflowRows
      .map(({ Cashflow }) => Cashflow.Cashflow_Id)
      .filter((cashflowId) => requestText.includes(JSON.stringify(cashflowId)));
    if (requestedCashflowIds.length > 0) {
      results = results.filter(({ Cashflow }) =>
        requestedCashflowIds.includes(Cashflow.Cashflow_Id),
      );
    }
    return {
      status: 200,
      body: {
        data: {
          cashflowUltraQuery: {
            totalResult: results.length,
            pageIndex: 0,
            itemsPerPage: 1000,
            lastPage: true,
            results,
          },
        },
      },
    };
  }

  if (query.includes(CASHFLOW_DETAIL_OPERATION)) {
    return {
      status: 200,
      body: {
        data: {
          graphCashFlowDetails: [
            {
              cashflow: cashflowRows[0],
              cashflowAuditTrail: [
                {
                  ...cashflowRows[0],
                  Cashflow: {
                    ...cashflowRows[0].Cashflow,
                    Cashflow_State: 'CREATED',
                    Cashflow_Sub_State: 'Pending Operator',
                  },
                },
                cashflowRows[0],
              ],
              ratanException: [],
              ratanAffirmation: [],
            },
          ],
        },
      },
    };
  }

  return { status: 200, body: { data: {} } };
}

export function resolveCashflowDevResponse({
  method,
  pathname,
  body,
}: CashflowDevRequest): CashflowDevResponse | undefined {
  if (method === 'GET' && pathname === '/api/ratan/rule/v1/fields/versions') {
    return {
      status: 200,
      body: {
        ratan_suppression_fields_config: { activedVersion: 'local-v1' },
        ratan_suppression_fields: { activedVersion: 'local-v1' },
      },
    };
  }
  if (method === 'GET' && pathname === '/api/ratan/rule/v1/fields') {
    return {
      status: 200,
      body: {
        version: {
          fieldsConfig: 'local-v1',
          fields: 'local-v1',
        },
        fields: businessFields,
      },
    };
  }
  if (method === 'POST' && pathname === '/api/ratan/stmcn/v1/cashflows') {
    return graphqlResponse(isGraphqlRequest(body) ? body : undefined);
  }
  if (method === 'POST' && pathname === '/api/ratan/da/graphql') {
    return { status: 200, body: { data: { fmEntity: null } } };
  }
  if (method === 'GET' && /^\/api\/ratan\/v[23]\/customview\/filters$/.test(pathname)) {
    return { status: 200, body: [savedFilter] };
  }
  if (
    method === 'GET' &&
    /^\/api\/ratan\/v[23]\/customview\/filters\/filter-usd-pending$/.test(pathname)
  ) {
    return { status: 200, body: savedFilter };
  }
  if (method === 'GET' && /^\/api\/ratan\/v[23]\/customview\/views$/.test(pathname)) {
    return { status: 200, body: [savedView] };
  }
  if (
    method === 'GET' &&
    /^\/api\/ratan\/v[23]\/customview\/views\/view-operations$/.test(pathname)
  ) {
    return { status: 200, body: savedView };
  }
  if (method === 'GET' && pathname === '/api/ratan/notification/subscriptions') {
    return { status: 200, body: { subscriptions: [] } };
  }
  if (method === 'POST' && pathname === '/api/ratan/v1/ratan/lifecycle/hold') {
    return {
      status: 200,
      body: {
        success: true,
        status: 200,
        state: 'HOLD',
        cashflowIds: ['CF-CN-24001'],
      },
    };
  }
  if (method === 'POST' && pathname === '/api/ratan/v1/cashflow/country/countryInfo') {
    return { status: 200, body: { countryInfoList: [] } };
  }
  return undefined;
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return undefined;
  const content = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(content);
  } catch {
    return undefined;
  }
}

function sendJson(response: ServerResponse, fixture: CashflowDevResponse) {
  response.statusCode = fixture.status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(fixture.body));
}

export function cashflowDevApiPlugin(): Plugin {
  return {
    name: 'cashflow-cn-local-contracts',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
        const body =
          request.method === 'POST' || request.method === 'PUT'
            ? await readJsonBody(request)
            : undefined;
        const fixture = resolveCashflowDevResponse({
          method: request.method ?? 'GET',
          pathname,
          body,
        });
        if (!fixture) {
          next();
          return;
        }
        sendJson(response, fixture);
      });
    },
  };
}
