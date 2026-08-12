export type AccountingDetailResponse = {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  version: number;
  id: string;
  cashflowId: string;
  tradeId: string;
  businessVersion: string;
  cashflowVersion: number;
  minorVersion: number;
  paymentDate: string;
  sourceSystem: string;
  eventType: string;
  cashflowStatus: string;
  currency: string;
  country: string;
  amount: string;
  bookingEntityFmid: string;
  bookingEntityFmcode: string;
  counterpartyFmid: string;
  counterpartyFmcode: string;
  nettingId: string;
  productTaxonomy: string;
  balance: number;
  requestInfo: {
    data: {
      id: string;
      type: string;
      attributes: {
        request: {
          "source-system": string;
          "posting-type": string;
          "transaction-type": string;
          "posting-branch": string;
          "external-system-key": string;
          "transaction-currency": string;
          "transaction-amount": number;
          "transaction entry": {
            narratives: {
              narration1: string;
              narration2: string;
              narration3: string;
              narration4: string;
              narration5: string;
              narration6: string;
            };
            "extended-narratives": {
              "extended-narration1": string;
              "extended-narration2": string;
              "extended-narration3": string;
              "extended-narration4": string;
              "extended-narration5": string;
              "extended-narration6": string;
            };
            "value-date": string;
            "account-number": string;
            "casa-currency-code": string;
            "transaction-code": string;
            "transaction-nature": string;
          }[];
        };
      };
    };
  };
  taskStatus: string;
  externalSystemKey: string;
  retryTimes: number;
  exceptionCode: null;
  reason: null;
  action: string;
  ebbsAccountNumber: string;
  payerParty: string;
  bookingProtfolioName: string;
  comment: string;
};

export type AccountingRepublishResponse = {
  country: string;
  totalTasks: number;
  failInfoMap: {};
  success: boolean;
};

export type ExceptionBundleActionResult = {
  cashflowId: string;
  status: number;
  errorCode: string;
  errorMessage: string;
};

export type QueryTradeResponse = {
  tradeVersions: {
    pageInfo: {
      lastPage: boolean;
      pageNo: number;
      pageSize: number;
      totalHits: number;
    };
    results: Trade_Review[];
  };
};

export type CashflowUltraQueryModal = {
  totalResult: number;
  pageIndex?: number | null;
  itemsPerPage: number;
  lastPage: boolean;
  results: Array<CNCashflow>;
};

export interface CashflowUltraQueryByOpensearchResult {
  cashflowUltraQueryByOpensearch: CashflowUltraQueryModal;
}
export interface CashflowUltraQueryResult {
  cashflowUltraQuery: CashflowUltraQueryModal;
}

export type QueryCashflowResponse =
  | CashflowUltraQueryResult
  | CashflowUltraQueryByOpensearchResult;

export type CashflowDetailsResult = {
  graphCashFlowDetails: GraphqlCashflowDetails[];
};

export type CashflowDetailsByOpensearchResult = {
  cashflowQueryByOpenSearch: GraphqlCashflowDetails[];
};

export type QueryCashflowDetailsResponse =
  | CashflowDetailsResult
  | CashflowDetailsByOpensearchResult;

export type QueryCounterPartyDetailsResult = {
  fmEntity: CounterPartyDetailsFMEntity;
};

export type UploadConfirmationResponse = {
  status: number;
  errorCode?: string;
  errorMessage?: string;
  metadata?: {};
  message?: string;
};
