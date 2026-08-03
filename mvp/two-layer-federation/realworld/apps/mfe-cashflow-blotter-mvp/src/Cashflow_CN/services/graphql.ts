import { ColDef, GridApi } from "ag-grid-community";
import { DocumentNode } from "graphql/language/ast";
import { RatanUltraQuery } from "src/generated/types.generated";
import { getWrappedGraphQLQuery } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import {
  conversionDQSLRequest,
  getBusinessFieldsFromCache,
  getDisplayFields,
  gql,
  handleMultiFieldsQuery,
  holidayDB,
  judgeDefaultFilter,
  queryGraphql as originalQueryGraphQL,
} from "src/Root/import/ratanutils";

import ratanConfig from "../Main/config/ratanConfig";
import {
  getCashflowDefaultFilter,
  PAGE_NUMBER_FOR_CASHFLOW,
  PAGE_SIZE_FOR_CASHFLOW,
} from "../Main/config/UIconfig";
import {
  CashflowDetailsByOpensearchResult,
  CashflowDetailsResult,
  CashflowUltraQueryResult,
  QueryCashflowDetailsResponse,
  QueryCashflowResponse,
  QueryCounterPartyDetailsResult,
} from "./type";

export const graphqlUrl = {
  QUERY_CASHFLOW_SETTLEMENT: "/api/ratan/stmcn/v1/cashflows",
  DA_GRAPHQL: "/api/ratan/da/graphql",
};

type QueryGraphQLType = <T>(
  url: string,
  query: DocumentNode,
  setErrorField?: boolean,
  headers?: Record<string, string>
) => Promise<T>;

export const queryGraphql: QueryGraphQLType =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedGraphQLQuery
    ? getWrappedGraphQLQuery("/cashflow_blotter_cn/cashflow_cn")
    : originalQueryGraphQL;

/**
 * Transforms the response for OpenSearch compatibility.
 * Converts `cashflowQueryByOpenSearch` to `graphCashFlowDetails` and
 * `cashflowAuditTrailByOpenSearch` to `cashflowAuditTrail`.
 *
 * @param response The original response object.
 * @returns The transformed response object.
 */
export const transformResponseForOpenSearch = (
  response: CashflowDetailsByOpensearchResult
): CashflowDetailsResult => {
  if (!response?.cashflowQueryByOpenSearch?.length) {
    return {
      graphCashFlowDetails: [],
    };
  }

  return {
    graphCashFlowDetails: response.cashflowQueryByOpenSearch.map((item) => {
      const { cashflowAuditTrailByOpenSearch, ...rest } = item;
      return {
        ...rest,
        cashflowAuditTrail: cashflowAuditTrailByOpenSearch,
      };
    }),
  };
};

export const getQueryNames = (opensearch?: boolean) => {
  const gqlQueryCashflowListName = opensearch
    ? "SettlementCashflowUltraQueryByOpensearch"
    : "SettlementCashflowDataUltraQuery";
  const gqlQueryCashflowListFn = opensearch
    ? "cashflowUltraQueryByOpensearch"
    : "cashflowUltraQuery";
  const gqlQueryCashflowDetailsName = opensearch
    ? "cashflowQueryByOpenSearch"
    : "graphCashFlowDetails";
  const gqlQueryCashflowAuditTrailName = opensearch
    ? "cashflowAuditTrailByOpenSearch"
    : "cashflowAuditTrail";
  return {
    gqlQueryCashflowListName,
    gqlQueryCashflowListFn,
    gqlQueryCashflowDetailsName,
    gqlQueryCashflowAuditTrailName,
  };
};

interface QueryCashflowEvent {
  filters: FilterItem[];
  page?: number;
  columnDefs?: ColDef[];
  api?: GridApi;
  disabledDefault?: boolean;
  isCashflowSettlementCN?: boolean;
  pageSize?: number;
  requireMandatoryFields?: boolean;
  opensearch?: boolean;
}

/**
 * Executes a GraphQL query to fetch cashflow data based on the provided parameters.
 * params.requireMandatoryFields - Indicates whether to include mandatory fields in the query.
 * params.opensearch - Specifies whether to use the opensearch query.
 * For OpenSearch, the response object name needs to be converted to `cashflowUltraQuery` to avoid changes to the current business code.
 */
export const queryCashflow = async ({
  filters,
  page = PAGE_NUMBER_FOR_CASHFLOW,
  columnDefs,
  api,
  disabledDefault,
  pageSize = PAGE_SIZE_FOR_CASHFLOW,
  requireMandatoryFields = true,
  opensearch = false,
}: QueryCashflowEvent): Promise<CashflowUltraQueryResult> => {
  holidayDB?.clear();

  const newFilters = handleMultiFieldsQuery(filters);
  const newParams = judgeDefaultFilter(disabledDefault, newFilters)
    ? newFilters
    : [...getCashflowDefaultFilter(), ...newFilters];

  const filter = newParams.map((item) => {
    return `{field: "${item.field}", operator: ${
      item.operator
    }, values: ${JSON.stringify(item.values)}}`;
  });

  let res;
  if (columnDefs) {
    res = getDisplayFields(
      columnDefs,
      requireMandatoryFields
        ? ratanConfig.cashflow.cashflowSettlementMandatoryFields
        : []
    );
  } else if (api) {
    const columns = api.getAllDisplayedColumns();
    res = getDisplayFields(
      columns,
      ratanConfig.cashflow.cashflowSettlementMandatoryFields
    );
  } else {
    const businessFields = await getBusinessFieldsFromCache("cashflowCN");
    res = conversionDQSLRequest({
      businessFields: businessFields?.cashflowFields,
      isAllFields: true,
    });
  }

  const newFilter = `{
    filters: {
      and: [
        {
          filters: [
            ${filter}
          ]
        }
      ]
    },
    itemsPerPage: ${pageSize},
    orderArgs: [],
    pageIndex: ${page},
    pagingOption: PAGE_INDEX
  }`;

  const { gqlQueryCashflowListName, gqlQueryCashflowListFn } =
    getQueryNames(opensearch);

  const query = gql`
    query ${gqlQueryCashflowListName} {
     ${gqlQueryCashflowListFn}(payload: ${newFilter}) {
        totalResult
        pageIndex
        itemsPerPage
        lastPage
        results {
         ${res}
        }
      }
    }
  `;

  const queryUrl = graphqlUrl.QUERY_CASHFLOW_SETTLEMENT;
  const response = await queryGraphql<QueryCashflowResponse>(
    queryUrl,
    query,
    true
  );
  let result: CashflowUltraQueryResult;

  if (opensearch && "cashflowUltraQueryByOpensearch" in response) {
    result = {
      cashflowUltraQuery: response.cashflowUltraQueryByOpensearch,
    };
  } else if ("cashflowUltraQuery" in response) {
    result = response;
  } else {
    throw new Error(
      "Unexpected response structure from cashflow GraphQL query"
    );
  }
  return result;
};

export const queryCashFlowDetails = async (
  cashflowIds: string[],
  opensearch?: boolean
): Promise<CashflowDetailsResult> => {
  const ids = JSON.stringify(cashflowIds);
  const { gqlQueryCashflowDetailsName, gqlQueryCashflowAuditTrailName } =
    getQueryNames(opensearch);
  const query = gql`
    query {
      ${gqlQueryCashflowDetailsName}(cashflowIds: ${ids}) {
        cashflow {
          BCS_Parent_Trade_Id
          BCS_Trade_Id
          Delivery_Method
          Parent_Trade_Id
          Position_Id
          Settlement_Method
          Trade_Id
          Trade_State
          Trade_Version
          Trade_Original_Source_System_Name
          Trade_Date
          Cashflow {
            Cashflow_Id
            Cashflow_Business_Version
            Cashflow_Version
            Cashflow_State
            Cashflow_Affirmation_Status
            Cashflow_Event_Type
            Cashflow_Minor_Version
            Payment_Currency
            Payment_Date
            Payment_Type
            Payment_Cutoff_Time
            Pay_Receive_Indicator
            Payment_Amount
            Netting_Id
            Splitting_Id
            Netting_Cuttoff_Date
            Payment_Receiver_Party_Reference
            Payment_Payer_Party_Reference
            Cashflow_Sub_State
            Cashflow_Sub_State_Type
            Cashflow_Sub_State_Updater
            Status_Event_Type
            Event_Date
            Cashflow_Event_Reason
            Booking_System_Event
            Cashflow_Swift_Message_Standard
          }
          FMO_Comments {
            FMO_Comment
            FMO_Comment_Timestamp
            FMO_Comment_Updater
          }
          Entity {
            Booking_Entity_SCI_FMCODE
            Booking_Entity_SCI_FMID
            Counterparty_SCI_FMID
            Counterparty_SCI_FMCODE
            Counterparty_CIF_Code
            Counterparty_Source_System_Entity_Id
            General_Ledger_Business_Unit_Name
            Booking_Entity_General_Ledger_Business_Unit_Id
          }
          Instrument_Common {
            CFI_Code
            ISDA_Taxonomy
            Source_System_Instrument_Sub_Type
            Financial_Instrument_Code
          }
          Settlement_Instruction {
            Account {
              SCB_Nostro_Account_Number
              SCB_Nostro_Account_Type
              Beneficiary_BIC_code
              Beneficiary_Account_Name
              Beneficiary_Account_Name_2
              Beneficiary_Street_Address
              Beneficiary_City
              Beneficiary_Account_Number
              Intermediary_BIC_code
              Intermediary_Account_Name
              Intermediary_Street_Address
              Intermediary_City
              Intermediary_Account_Number
              Beneficiary_Bank_BIC_code
              Beneficiary_Bank_Account_Name
              Beneficiary_Bank_Street_Address
              Beneficiary_Bank_City
              Beneficiary_Bank_Account_Number
              Beneficiary_Correspondent_BIC_code
              Beneficiary_Correspondent_Account_Name
              Beneficiary_Correspondent_Street_Address
              Beneficiary_Correspondent_City
              Beneficiary_Correspondent_Account_Number
              Ordering_Customer_BIC_Code
              Ordering_Customer_Account_Name
              Ordering_Customer_Street_Address
              Ordering_Customer_City
              Ordering_Customer_Account_Number
              Counterparty_CMS_Account_Number
              EBBS_Bridge_Account_Number
              EBBS_Account_Number
              Booking_Entity_Correspondent_BIC_code
              Booking_Entity_Correspondent_Account_Name
              Booking_Entity_Correspondent_Street_Address
              Booking_Entity_Correspondent_City
              Booking_Entity_Correspondent_Account_Number
              POP_Dubai
            }
            SSI_Id
            SSI_Unique_Id
            SSI_Source
            SSI_Priority
            Settlement_Code
            Settlement_Method
            Swift_Message_Type
            CFI_Code
            Payment_Currency
            Counterparty_SCI_FMID
            SCB_Entity_SCI_FMID
            Remittance_Information_1
            Remittance_Information_2
            Remittance_Information_3
            Remittance_Information_4
            Sender_To_Receiver_Information_1
            Sender_To_Receiver_Information_2
            Sender_To_Receiver_Information_3
            Sender_To_Receiver_Information_4
            Sender_To_Receiver_Information_5
            Sender_To_Receiver_Information_6
            Is_Third_Party_Payment
            Swift_Payment_Method
            Swift_Payment_Date
            Charge_Bearer
            Nostro_Swift_Message_Type
            Nostro_Type
          }
          Portfolio {
            Booking_Entity_Trade_Portfolio_Name
          }
          Data_Flow {
            Data_Source_System
          }
        }
        ${gqlQueryCashflowAuditTrailName} {
          Action_Date_Time
          User_PSID
          Cashflow {
            Cashflow_Id
            Cashflow_State
            Cashflow_Sub_State_Type
            Cashflow_Sub_State
            Cashflow_Business_Version
            Cashflow_Version
            Cashflow_Minor_Version
            Cashflow_Event_Type
            Exception_Reason
            NSTP_Reason
            NSTP_Exception
          }
          FMO_Comments {
            FMO_Comment
            FMO_Comment_Timestamp
            FMO_Comment_Updater
          }
          Action
          Action_Time
          Exception_Type
          Value_Change {
            Field_Name
            Old_Value
            New_Value
          }
          Comments_Change {
            Field_Name
            Old_Value {
              FMO_Comment
              FMO_Comment_Updater
              FMO_Comment_Timestamp
            }
            New_Value {
              FMO_Comment
              FMO_Comment_Updater
              FMO_Comment_Timestamp
            }
          }
        }
        ratanException {
          Id
          Original_Exception_Id
          Exception_Code
          Exception_Category
          Exception_Type
          Description
          Status
          Bulk_Eligible
          Actions {
            Api_Url
            Api_Method
            Action_Name
            Action_Type
            Component_Url
            Component_Name
          }
          Stashing {
            Maker_Request_Body
            Maker_Id
            Checker_Request_Body
            Checker_Id
          }
        }
                
        ratanVostroCandidates {
          Account {
            SCB_Nostro_Account_Number
            SCB_Nostro_Account_Type
            Beneficiary_BIC_code
            Beneficiary_Account_Name
            Beneficiary_Account_Name_2
            Beneficiary_Street_Address
            Beneficiary_City
            Beneficiary_Account_Number
            Intermediary_BIC_code
            Intermediary_Account_Name
            Intermediary_Street_Address
            Intermediary_City
            Intermediary_Account_Number
            Beneficiary_Bank_BIC_code
            Beneficiary_Bank_Account_Name
            Beneficiary_Bank_Street_Address
            Beneficiary_Bank_City
            Beneficiary_Bank_Account_Number
            Beneficiary_Correspondent_BIC_code
            Beneficiary_Correspondent_Account_Name
            Beneficiary_Correspondent_Street_Address
            Beneficiary_Correspondent_City
            Beneficiary_Correspondent_Account_Number
            Ordering_Customer_BIC_Code
            Ordering_Customer_Account_Name
            Ordering_Customer_Street_Address
            Ordering_Customer_City
            Ordering_Customer_Account_Number
            Counterparty_CMS_Account_Number
            EBBS_Bridge_Account_Number
            EBBS_Account_Number
            Booking_Entity_Correspondent_BIC_code
            Booking_Entity_Correspondent_Account_Name
            Booking_Entity_Correspondent_Street_Address
            Booking_Entity_Correspondent_City
            Booking_Entity_Correspondent_Account_Number
          }
          SSI_Id
          SSI_Unique_Id
          SSI_Source
          SSI_Priority
          Settlement_Code
          Settlement_Method
          Swift_Message_Type
          CFI_Code
          Payment_Currency
          Counterparty_SCI_FMID
          SCB_Entity_SCI_FMID
          Remittance_Information_1
          Remittance_Information_2
          Remittance_Information_3
          Remittance_Information_4
          Sender_To_Receiver_Information_1
          Sender_To_Receiver_Information_2
          Sender_To_Receiver_Information_3
          Sender_To_Receiver_Information_4
          Sender_To_Receiver_Information_5
          Sender_To_Receiver_Information_6
          Is_Third_Party_Payment
          Swift_Payment_Method
          Swift_Payment_Date
          Charge_Bearer
          Nostro_Swift_Message_Type
          BranchId_Murex3Id
        }
        ratanNostroCandidates {
          Account {
            SCB_Nostro_Account_Number
            SCB_Nostro_Account_Type
            Beneficiary_BIC_code
            Beneficiary_Account_Name
            Beneficiary_Account_Name_2
            Beneficiary_Street_Address
            Beneficiary_City
            Beneficiary_Account_Number
            Intermediary_BIC_code
            Intermediary_Account_Name
            Intermediary_Street_Address
            Intermediary_City
            Intermediary_Account_Number
            Beneficiary_Bank_BIC_code
            Beneficiary_Bank_Account_Name
            Beneficiary_Bank_Street_Address
            Beneficiary_Bank_City
            Beneficiary_Bank_Account_Number
            Beneficiary_Correspondent_BIC_code
            Beneficiary_Correspondent_Account_Name
            Beneficiary_Correspondent_Street_Address
            Beneficiary_Correspondent_City
            Beneficiary_Correspondent_Account_Number
            Ordering_Customer_BIC_Code
            Ordering_Customer_Account_Name
            Ordering_Customer_Street_Address
            Ordering_Customer_City
            Ordering_Customer_Account_Number
            Counterparty_CMS_Account_Number
            EBBS_Bridge_Account_Number
            EBBS_Account_Number
            Booking_Entity_Correspondent_BIC_code
            Booking_Entity_Correspondent_Account_Name
            Booking_Entity_Correspondent_Street_Address
            Booking_Entity_Correspondent_City
            Booking_Entity_Correspondent_Account_Number
          }
          SSI_Id
          SSI_Unique_Id
          SSI_Source
          SSI_Priority
          Swift_Message_Type
          CFI_Code
          Payment_Currency
          Counterparty_SCI_FMID
          SCB_Entity_SCI_FMID
          Remittance_Information_1
          Remittance_Information_2
          Remittance_Information_3
          Remittance_Information_4
          Sender_To_Receiver_Information_1
          Sender_To_Receiver_Information_2
          Sender_To_Receiver_Information_3
          Sender_To_Receiver_Information_4
          Sender_To_Receiver_Information_5
          Sender_To_Receiver_Information_6
          Is_Third_Party_Payment
          Swift_Payment_Method
          Swift_Payment_Date
          Charge_Bearer
          Nostro_Swift_Message_Type
          Nostro_Type
          Dedicated {
            Portfolio
          }
        }
        ratanAffirmation {
          Affirmed_By
          Phone_Email
          Affirmed_At
        }    
      }
    }
  `;

  const queryUrl = graphqlUrl.QUERY_CASHFLOW_SETTLEMENT;
  const response = await queryGraphql<QueryCashflowDetailsResponse>(
    queryUrl,
    query
  );
  let result: CashflowDetailsResult;

  if (opensearch && "cashflowQueryByOpenSearch" in response) {
    return transformResponseForOpenSearch(response);
  } else if ("graphCashFlowDetails" in response) {
    result = response;
  } else {
    throw new Error(
      "Unexpected response structure from cashflowDetails GraphQL query"
    );
  }
  return result;
};

export const queryCashFlowDetailsForBulkFixExceptions = async (
  cashflowIds: string[],
  isChecker?: boolean,
  opensearch?: boolean
): Promise<CashflowDetailsResult> => {
  const ids = JSON.stringify(cashflowIds);
  const { gqlQueryCashflowDetailsName, gqlQueryCashflowAuditTrailName } =
    getQueryNames(opensearch);

  const query = gql`
    query {
      ${gqlQueryCashflowDetailsName}(cashflowIds: ${ids}) {
        cashflow {
          Trade_Id
          Cashflow {
            Cashflow_Id
            Cashflow_Business_Version
            Cashflow_Version
            Cashflow_State
            Cashflow_Affirmation_Status
            Cashflow_Event_Type
            Cashflow_Minor_Version
            Payment_Currency
            Payment_Date
            Payment_Type
            Payment_Cutoff_Time
            Pay_Receive_Indicator
            Payment_Amount
            Cashflow_Sub_State
            Cashflow_Sub_State_Type
            Cashflow_Sub_State_Updater
          }
          Entity {
            Booking_Entity_SCI_FMCODE
            Booking_Entity_SCI_FMID
            Counterparty_SCI_FMID
            Counterparty_SCI_FMCODE
          }
        }
        ${
          isChecker
            ? `
        ${gqlQueryCashflowAuditTrailName} {
          Action_Date_Time
          User_PSID
          Cashflow {
            Cashflow_Id
            Cashflow_State
            Cashflow_Sub_State_Type
            Cashflow_Sub_State
            Cashflow_Business_Version
            Cashflow_Version
            Cashflow_Minor_Version
            Cashflow_Event_Type
            Exception_Reason
            NSTP_Reason
          }
          FMO_Comments {
            FMO_Comment
            FMO_Comment_Timestamp
            FMO_Comment_Updater
          }
          Action
          Action_Time
          Exception_Type
          Value_Change {
            Field_Name
            Old_Value
            New_Value
          }
          Comments_Change {
            Field_Name
            Old_Value {
              FMO_Comment
              FMO_Comment_Updater
              FMO_Comment_Timestamp
            }
            New_Value {
              FMO_Comment
              FMO_Comment_Updater
              FMO_Comment_Timestamp
            }
          }
        }`
            : ""
        }
        ratanException {
          Id
          Original_Exception_Id
          Exception_Code
          Exception_Category
          Exception_Type
          Description
          Status
          Bulk_Eligible
          Actions {
            Api_Url
            Api_Method
            Action_Name
            Action_Type
            Component_Url
            Component_Name
          }
          Stashing {
            Maker_Request_Body
            Maker_Id
            Checker_Request_Body
            Checker_Id
          }
        }
        ratanAffirmation {
          Affirmed_By
          Phone_Email
          Affirmed_At
        }    
      }
    }
  `;

  const queryUrl = graphqlUrl.QUERY_CASHFLOW_SETTLEMENT;
  const response = await queryGraphql<QueryCashflowDetailsResponse>(
    queryUrl,
    query
  );
  let result: CashflowDetailsResult;

  if (opensearch && "cashflowQueryByOpenSearch" in response) {
    return transformResponseForOpenSearch(response);
  } else if ("graphCashFlowDetails" in response) {
    result = response;
  } else {
    throw new Error(
      "Unexpected response structure from cashFlowDetailsForBulkFixExceptions GraphQL query"
    );
  }
  return result;
};

export const counterpartyQueryStrForCN = conversionDQSLRequest({
  businessFields: [
    {
      indexedTerm: "fmEntity.fmAccount.fmId",
    },
    {
      indexedTerm: "fmEntity.fmAccount.fmLongName",
    },
    {
      indexedTerm: "fmEntity.fmAddress.addrType",
    },
    {
      indexedTerm: "fmEntity.fmAddress.addrLine1",
    },
    {
      indexedTerm: "fmEntity.fmAddress.city",
    },
    {
      indexedTerm: "fmEntity.fmAddress.country",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.addrLine",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.mediumUsage",
    },
    {
      indexedTerm: "fmEntity.fmSysContact.mediumCode",
    },
  ],
  isAllFields: true,
});

export const queryCounterPartyDetails_CN = (fmId: string) => {
  fmId = Number.isNaN(Number(fmId)) ? `"${fmId}"` : fmId;
  const str2 = `fmEntity(fmId: ${fmId}){`;
  const str = counterpartyQueryStrForCN.replace("fmEntity{", str2);
  const query = gql`query {
        ${str}
      }`;

  const queryUrl = graphqlUrl.DA_GRAPHQL;
  return queryGraphql<QueryCounterPartyDetailsResult>(queryUrl, query);
};

export const queryCashFlowSplitDetails = (
  splittingId: string
): Promise<{ graphCashFlowDetails: GraphqlCashflowDetails[] }> => {
  const id = JSON.stringify(splittingId);
  const query = gql`
    query {
      graphCashFlowDetails(splitting_id: ${id}) {
        cashflow {
          Cashflow {
            Cashflow_Id
            Cashflow_State
            Payment_Date
            Payment_Type
            Cashflow_Sub_State
            Cashflow_Sub_State_Type
            Cashflow_Event_Type
          }
          Entity {
            Booking_Entity_SCI_FMCODE
            Booking_Entity_SCI_FMID
            Counterparty_SCI_FMID
            Counterparty_SCI_FMCODE
            Counterparty_CIF_Code
          }
          Instrument_Common {
            ISDA_Taxonomy
            CFI_Code
            Source_System_Instrument_Sub_Type
          }
            Data_Flow{
            Data_Source_System
            Data_Publication_Date_Time
            }
        }
        ratanAffirmation {
          Affirmed_By
          Phone_Email
          Affirmed_At
        }    
      }
    }
  `;

  const queryUrl = graphqlUrl.QUERY_CASHFLOW_SETTLEMENT;
  return queryGraphql(queryUrl, query);
};

interface QueryCashflowUltraProps {
  filters: string[] | Filter[];
  payload?: RatanUltraQuery;
  page?: number;
  columnDefs?: ColDef[];
  api?: GridApi;
  disabledDefault?: boolean;
  isCashflowSettlementCN?: boolean;
  pageSize?: number;
}

/**
 * This query export and also used by third application, be carefully before change
 */
export const queryCashflowUltra = async ({
  filters,
  payload,
  page = PAGE_NUMBER_FOR_CASHFLOW,
  columnDefs,
  api,
  disabledDefault,
  pageSize = PAGE_SIZE_FOR_CASHFLOW,
}: QueryCashflowUltraProps): Promise<CNCashflow[]> => {
  const newFilters = handleMultiFieldsQuery(filters);
  const newParams = judgeDefaultFilter(disabledDefault, newFilters)
    ? newFilters
    : [...getCashflowDefaultFilter(), ...newFilters];

  const filter = newParams.map((item) => {
    return `{field: "${item.field}", operator: ${
      item.operator
    }, values: ${JSON.stringify(item.values)}}`;
  });

  let res;
  if (columnDefs) {
    res = getDisplayFields(
      columnDefs,
      ratanConfig.cashflow.cashflowSettlementMandatoryFields
    );
  } else if (api) {
    const columns = api.getAllDisplayedColumns();
    res = getDisplayFields(
      columns,
      ratanConfig.cashflow.cashflowSettlementMandatoryFields
    );
  } else if (payload) {
    res = payload;
  } else {
    const businessFields = await getBusinessFieldsFromCache("cashflowCN");
    res = conversionDQSLRequest({
      businessFields: businessFields?.cashflowFields,
      isAllFields: true,
    });
  }
  const newFilter = `{
    filters: {
      and: [
        {
          filters: [${filter}]
        }
      ]
    },
    itemsPerPage: ${pageSize},
    orderArgs: [],
    pageIndex: ${page},
    pagingOption: PAGE_INDEX
    }`;

  const query = gql`
    query SettlementCashflowDataUltraQuery {
      cashflowUltraQuery(payload: ${newFilter}) {
        totalResult
        pageIndex
        itemsPerPage
        lastPage
        results {
         ${res}
        }
      }
    }
  `;

  return queryGraphql(graphqlUrl.QUERY_CASHFLOW_SETTLEMENT, query);
};
