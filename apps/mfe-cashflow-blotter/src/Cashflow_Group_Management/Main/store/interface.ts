import { GridReadyEvent } from "ag-grid-community";

export interface BlotterDataType {
  Id: string;
  Group_Id: string;
  Group_Status: string;
  Group_Event: string;
  Trade_Id: string;
  Major_Version: number;
  Cashflow_Id: string;
  Cashflow_Count: number;
  Cashflow_Sequence: number;
  Cashflow_Event_Reason: string;
  Booking_System_Event: string;
  Bussiness_Event: string;
  Status: string;
  Create_At: string;
  Update_At: string;
  Updated_By: string;
  Is_Group_Locked: boolean;
  Is_Trade_Validated: boolean;
  Mxg_Trade_Id: string;
  Cashflow_Status: string;
  Booking_Entity_Id: string;
  Counterparty_Fm_Id: string;
  Client_Domicile_Country?: string;
  Counterparty_Fm_Code?: string;
  Booking_Entity_Fm_Code?: string;
  Commodity_Flag?: string | null;
  ISDA_Taxonomy: string;
  Pay_Direction: string;
  Value_Date: string;
  ratanException?: [RatanException];
  // Pending_Reason?: string,
  // Payment_Currency: string,
  // Payment_Amount?: string | number,
  // Original_Payment_Id?: string | number,
}

export interface SearchCriteria {
  Cashflow_Id?: string;
  Trade_Id?: string;
  Major_Version?: number;
  Status?: string[];
  Cashflow_Status?: string;
  Group_Status?: string[];
  Booking_Entity_Id?: string[];
  Value_Date?: string;
}

export interface RatanPagination {
  lastPage: boolean;
  totalHits: number;
  pageNo: number;
  pageSize: number;
}

export type FmIdDetailMappingType = Record<
  string,
  { countryCode: string; fmCode: string; bookingEntityFmCode: string }
>;

export interface RootState {
  // blotter list aggrid handler
  blotterGridEvent:
    | GridReadyEvent
    | {
        api: undefined;
      };
  // blotter list data
  blotterDatas: BlotterDataType[];
  // indicate whether blotter query is finished. true: success, false: failed.
  blotterQueryStatus: Promise<boolean>;
  // query id, to avoid race condition when multiple queries are sent
  blotterQueryId: number;
  // blotter list pagination
  blotterPagination: RatanPagination;
  // quick search
  quickSearch: SearchCriteria;
  // fmid country code mapping
  fmIdDetailMapping: FmIdDetailMappingType;
  // is loading next page
  isLoadingNextPage: boolean;
}

export type GroupBlotterRootState = {
  groupBlotter: RootState;
};
