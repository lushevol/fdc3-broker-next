import { graphqlUrl } from "src/Cashflow_CN/services/graphql";
import { getWrappedGraphQLQuery } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import {
  gql,
  queryGraphql as originalQueryGraphQL,
} from "src/Root/import/ratanutils";

import { SearchCriteria } from "../Main/store/interface";

const queryGraphql =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedGraphQLQuery
    ? getWrappedGraphQLQuery("/cashflow_blotter_cn/cashflow_group_management")
    : originalQueryGraphQL;

export interface QueryGroupMessagesProps {
  filter: SearchCriteria;
  pagination: {
    pageNo: number;
    pageSize: number;
  };
}

export const queryGroupMessages: (
  p: QueryGroupMessagesProps
) => Promise<any> = ({ filter, pagination: { pageNo, pageSize } }) => {
  const filterCriterias = Object.keys(filter)
    .map((k) => (filter[k] ? `${k}: ${JSON.stringify(filter[k])}` : ""))
    .filter(Boolean)
    .join(", ");
  const filterStr = filterCriterias ? `, filter:{ ${filterCriterias} }` : "";
  const query = gql`
      query {
        groupMessages(page:${pageNo},size:${pageSize}${filterStr}){
          pageInfo{
            pageNo
            pageSize
            lastPage
            totalHits
          }
          results{
            Id
            Group_Id
            Trade_Id
            Cashflow_Id
            Group_Event
            Group_Status
            Booking_System_Event
            Status
            Cashflow_Count
            Cashflow_Sequence
            Cashflow_Event_Reason
            Create_At
            Update_At
            Is_Group_Locked
            Major_Version
            ratanException{
              Description
            }
            Cashflow_Status
            Booking_Entity_Id
            Counterparty_Fm_Id
            Commodity_Flag
            ISDA_Taxonomy
            Pay_Direction
            Value_Date
            Is_Trade_Validated
            Mxg_Trade_Id
            Updated_By
            Payment_Currency
            Payment_Amount
            Original_Payment_Id
            Pending_Reason
          }
        }
      }
    `;

  const queryUrl = graphqlUrl.QUERY_CASHFLOW_SETTLEMENT;
  return queryGraphql(queryUrl, query);
};
