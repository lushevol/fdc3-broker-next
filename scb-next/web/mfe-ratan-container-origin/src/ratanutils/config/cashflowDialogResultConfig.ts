export const TRADE_DETAILS_RESULT_CONFIG = `
  Trade_Id
  Trade_Version
  Trade_Date
  Trade_State
  Entity {
    Booking_Entity_SCI_LEID
    Booking_Entity_LEI
    Booking_Entity_SCIFMID
    Booking_Entity_Name
    Counterparty_Long_Name
    Counterparty_SCI_FMID
  }
  Instrument_Common {
    ISDA_Taxonomy
  }
  Trade_Lake_Trade_Major_Version
  Versions{
    Trade_Lake_Trade_Major_Version
    Trade_Lake_Trade_Minor_Version
    Trade_State
  }
`;

export const CASHFLOW_DETAILS_RESULT_CONFIG = `
  Cashflow {
    Cashflow_Id
    Cashflow_State
    Cashflow_Affirmation_Status
    Cashflow_Version
    Cashflow_Business_Version
    Cashflow_Event_Type
    Payment_Type
    Payment_Cutoff_Time
    Payment_Currency
    Payment_Amount
    Payment_Date
    Pay_Receive_Indicator
    Netting_Id
  }
  Delivery_Method
  Trade_Id
  Trade_Version
  BCS_Trade_Id
  FMO_Comments {
    FMO_Comment
    FMO_Comment_Timestamp
    FMO_Comment_Updater
  }
`;
