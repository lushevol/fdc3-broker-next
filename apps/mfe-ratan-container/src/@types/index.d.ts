declare interface Window {
  localStorage: any;
  token: string;
  ratanConfig: any;
}

declare interface MapType {
  [key: string]: any;
}
declare interface ActionType {
  type: string;
  data: any;
  userId?: string;
}
declare interface Filter {
  field: string;
  operator: string;
  values: any;
  label?: string;
}
declare interface CascaderFilter {
  field: string[];
  operator: string;
  values: any;
  name: string;
}
declare interface ActionType {
  type: string;
  data: any;
}
declare interface NostroSSI {
  id: string;
  createdAt: string;
  updatedAt: string;
  legalEntity: string;
  legalEntityFmid: string;
  settlementCurrency: string;
  ebbsNostroAccount: string;
  settlementMeans: string;
  settlementAccount: string;
  sendersCorrespondent53Swift: string;
  sendersCorrespondent53Fullname: string;
  sendersCorrespondent53Address: string;
  sendersCorrespondent53City: string;
  sendersCorrespondent53Postcode: string;
  sendersCorrespondent53Account: string;
  noticeToReceive: string;
}
declare module "flat";

declare module "babel-plugin-relay/macro";

// standard cashflow data modaling from Rosetta
declare interface CashflowDataModal {
  Position_Id?: string | null;
  Bcs_Trade_Id?: string | null;
  Trade_Id?: string | null;
  Trade_State?: string | null;
  Settlement_Method?: string | null;
  Delivery_Method?: string | null;
  Parent_Trade_Id?: string | null;
  Bcs_Parent_Trade_Id?: string | null;
  Trade_Version?: number;
  Entity?: EntityInfo;
  Instrument_Common?: InstrumentCommon;
  Portfolio?: Portfolio;
  Data_Flow?: DataFlow;
  Trade?: Trade;
  Cashflow?: CashflowInfo;
  FMO_Comments: FMOComments[] | null;
  Settlement_Instruction?: SSI;
  Confirmation?: Confirmation;
}

declare interface CNCashflow extends CashflowDataModal {}

interface InstrumentCommon {
  ISDA_Taxonomy?: string | null;
  CFI_Code?: string | null;
  Source_System_Instrument_Sub_Type?: string | null;
  Equity_Instrument_Reference?: string | null;
  Parent_Trade_Instrument?: string | null;
}

interface CashflowInfo {
  Cashflow_Version?: number;
  Cashflow_Business_Version?: number;
  Cashflow_Event_Type?: string | null;
  NSTP_Reason?: string | null;
  Payer_Name?: string | null;
  Netting_Id?: string | null;
  Payment_Date?: string | null;
  Is_STP_RATAN?: string | null;
  Is_STP?: string | null;
  Payment_Type?: string | null;
  Event_Date?: string | null;
  Cashflow_Sub_State_Updater?: string | null;
  Cashflow_Id?: string | null;
  Payment_Date_Business_Day_Convention?: string | null;
  Payment_Receiver_Party_Reference?: string | null;
  Cashflow_Sub_State_Type?: string | null;
  Next_Cashflow_Id?: string | null;
  Exception_Reason?: string | null;
  STP_Cutoff_Date_Time?: string | null;
  Prev_Cashflow_Id?: string | null;
  Validation_Status?: string | null;
  Payment_Payer_Party_Reference?: string | null;
  Status_Event_Type?: string | null;
  Payment_Currency?: string | null;
  Payment_Amount?: string | null;
  Cashflow_State?: string | null;
  Is_Private_Banking_Cashflow?: boolean;
  Is_Amended_Post_Settlement?: string | null;
  Is_Cashflow_Unnet?: boolean;
  Transaction_Details?: string | null;
  Pay_Receive_Indicator?: string | null;
  Execution_Date_Time?: string | null;
  Cashflow_Sub_State?: string | null;
  Cashflow_Affirmation_Status?: string | null;
  Cashflow_Minor_Version?: number;
  Bypass_Workflow_Indicator?: string | null;
  Is_Payment_Intent_To_Settle?: boolean;
  Netting_Cuttoff_Date?: string | null;
  Booking_Entity_SCI_FMCODE?: string | null;
  Payment_Cutoff_Time?: string | null;
  Cashflow_Audit_Version?: string | null;
  Minor_Version_Description?: string | null;
  FMO_Comment?: string | null;
  FMO_Comment_Updater?: string | null;
  FMO_Comment_Timestamp?: string | null;
}

interface EntityInfo {
  Person?: {
    Trader_PSID?: string | null;
    Event_Execution_Marketer_PSID?: string | null;
    Event_Coverage_Marketer_PSID?: string | null;
    Booking_Marketer_PSID?: string | null;
    Event_Booking_Marketer_PSID?: string | null;
    Event_Trader_PSID?: string | null;
    Coverage_Marketer_PSID?: string | null;
    Execution_Marketer_PSID?: string | null;
  };
  Booking_Entity_General_Ledger_Business_Unit_Id?: string | null;
  Counterparty_Source_System_Entity_Id?: string | null;
  General_Ledger_Business_Unit_Name?: string | null;
  Booking_Entity_SCI_FMCODE?: string | null;
  Booking_Entity_SCI_FMID?: string | null;
  Counterparty_SCI_FMID?: string | null;
  Counterparty_SCI_FMCODE?: string | null;
  Counterparty_CIF_Code?: string | null;
  Counterparty_Client_Type?: string | null;
}

interface DataFlow {
  Data_Type?: string | null;
  Data_Sender?: string | null;
  Data_Source_System_Country_Code?: string | null;
  Data_Source_System_Domain_Name?: string | null;
  Data_Publication_Date_Time?: string | null;
  Unique_Identifier_Message_Id?: string | null;
  Data_Publication_Id?: string | null;
  Data_Source_System?: string | null;
}

interface Trade {
  Action_Type?: string | null;
  Trade_Lake_Raw_Event_Date_Time?: string | null;
  Trade_Lake_Valid_From_Date_Time?: string | null;
  Trade_Lake_Transaction_From_Date_Time?: string | null;
  Trade_Lake_Latest_Event_Date_Time?: string | null;
  Trade_Original_Source_System_Name?: string | null;
  Trade_Lake_Transaction_To_Date_Time?: string | null;
  Event_Physical_Status?: string | null;
  Trade_Lake_Valid_To_Date_Time?: string | null;
  Resultant_Position_Id?: string | null;
}

interface Portfolio {
  Booking_Entity_Trade_Portfolio_Unique_Name?: string | null;
  Booking_Entity_Trade_Portfolio_Name?: string | null;
}

interface FMOComments {
  FMO_Comment?: string | null;
  FMO_Comment_Updater?: string | null;
  FMO_Comment_Timestamp?: string | null;
}

interface Confirmation {
  Confirmation_Status: string;
}

interface SSI_Account extends SSI_Account_Extension {
  SCB_Nostro_Account_Number: string | null;
  SCB_Nostro_Account_Type: string | null;
  Beneficiary_BIC_code: string | null;
  Beneficiary_Account_Name: string | null;
  Beneficiary_Account_Name_2: string | null;
  Beneficiary_Street_Address: string | null;
  Beneficiary_City: string | null;
  Beneficiary_Account_Number: string | null;
  Intermediary_BIC_code: string | null;
  Intermediary_Account_Name: string | null;
  Intermediary_Street_Address: string | null;
  Intermediary_City: string | null;
  Intermediary_Account_Number: string | null;
  Beneficiary_Bank_BIC_code: string | null;
  Beneficiary_Bank_Account_Name: string | null;
  Beneficiary_Bank_Street_Address: string | null;
  Beneficiary_Bank_City: string | null;
  Beneficiary_Bank_Account_Number: string | null;
  Beneficiary_Correspondent_BIC_code: string | null;
  Beneficiary_Correspondent_Account_Name: string | null;
  Beneficiary_Correspondent_Street_Address: string | null;
  Beneficiary_Correspondent_City: string | null;
  Beneficiary_Correspondent_Account_Number: string | null;
  Ordering_Customer_BIC_Code: string | null;
  Ordering_Customer_Account_Name: string | null;
  Ordering_Customer_Street_Address: string | null;
  Ordering_Customer_City: string | null;
  Ordering_Customer_Account_Number: string | null;
  Counterparty_CMS_Account_Number: string | null;
  EBBS_Bridge_Account_Number: string | null;
  EBBS_Account_Number: string | null;
  Booking_Entity_Correspondent_BIC_code: string | null;
  Booking_Entity_Correspondent_Account_Name: string | null;
  Booking_Entity_Correspondent_Street_Address: string | null;
  Booking_Entity_Correspondent_City: string | null;
  Booking_Entity_Correspondent_Account_Number: string | null;
}

interface SSI_Account_Extension {
  Beneficiary_Country_Name: string | null;
  Cash_Correspondent_Account_Number: string | null;
  Cash_Correspondent_BIC_code: string | null;
  Cash_Correspondent_Sub_Account_Number: string | null;
  Cash_Custodian_Account_Name: string | null;
  Cash_Custodian_Account_Number: string | null;
  Cash_Custodian_BIC_code: string | null;
  Cash_Custodian_City: string | null;
  Cash_Custodian_Street_Address: string | null;
  Cash_Local_Agent_Account_Name: string | null;
  Cash_Local_Agent_Account_Number: string | null;
  Cash_Local_Agent_BIC_code: string | null;
  Cash_Local_Agent_City: string | null;
  Cash_Local_Agent_Street_Address: string | null;
  Cash_Local_Agent_Sub_Account_Number: string | null;
  Counterparty_BIC_Code: string | null;
  Counterparty_Has_CMS_Account: string | null;
  Has_Beneficiary_Account: string | null;
  Has_Cash_Correspondent_Account: string | null;
  Has_Cash_Custodian_Account: string | null;
  Has_Cash_Local_Agent_Account: string | null;
  Sender_Correspondent_Account_Number: string | null;
  Sender_Correspondent_BIC_Code: string | null;
}

interface SSI_Extension {
  Beneficiary_Account_Name: string | null;
  Beneficiary_Account_Number: string | null;
  Beneficiary_BIC_code: string | null;
  Booking_Entity_BIC_Code: string | null;
  Booking_Entity_Custodian_Account_Name: string | null;
  Booking_Entity_Custodian_Account_Number: string | null;
  Booking_Entity_Custodian_BIC_Code: string | null;
  CFI_Code: string | null;
  Cash_SSI_Id: string | null;
  Comments: string | null;
  Counterparty_Beneficiary_Account_Name: string | null;
  Counterparty_Custodian_Account_Name: string | null;
  Counterparty_Custodian_Account_Number: string | null;
  Counterparty_Custodian_BIC_Code: string | null;
  Counterparty_SCI_FMID: string | null;
  Debit_Credit: string | null;
  Effective_Date: string | null;
  Event_Type: string | null;
  ISDA_Taxonomy: string | null;
  Is_Default_SSI: string | null;
  Payment_Currency: string | null;
  Primary_Asset_Class: string | null;
  SCB_Entity_SCI_FMID: string | null;
  SSI_Id: string | null;
  SSI_Status: string | null;
  Security_Custodian_Account_Name: string | null;
  Security_Custodian_Account_Number: string | null;
  Security_SSI_Id: string | null;
  Settlement_Code: string | null;
  Settlement_Flow_Nature: string | null;
  Settlement_Location_Country_ISO_Code: string | null;
  Settlement_Method: string | null;
  Settlement_Type: string | null;
  Source_System_Instrument_Id: string | null;
  Source_System_Settlement_Location: string | null;
  Swift_Payment_Date: string | null;
  Usual_Id: string | null;
}

interface SSI extends SSI_Extension {
  Account: SSI_Account;
  SSI_Unique_Id: string | null;
  SSI_Source: string | null;
  SSI_Priority: string | null;
  Swift_Message_Type: string | null;
  Remittance_Information_1: string | null;
  Remittance_Information_2: string | null;
  Remittance_Information_3: string | null;
  Remittance_Information_4: string | null;
  Sender_To_Receiver_Information_1: string | null;
  Sender_To_Receiver_Information_2: string | null;
  Sender_To_Receiver_Information_3: string | null;
  Sender_To_Receiver_Information_4: string | null;
  Sender_To_Receiver_Information_5: string | null;
  Sender_To_Receiver_Information_6: string | null;
  Is_Third_Party_Payment: string | null;
  Swift_Payment_Method: string | null;
  Charge_Bearer: string | null;
  Nostro_Swift_Message_Type: string | null;
}

interface ValueChange {
  Field_Name: string;
  Old_Value: string;
  New_Value: string;
}

interface CommentsChange {
  Field_Name: string;
  Old_Value: FMOComments[];
  New_Value: FMOComments[];
}

declare interface CashflowAuditTrail {
  Action_Date_Time: string;
  User_PSID: string;
  Cashflow: CashflowInfo;
  Trade: Trade;
  Action: string;
  Action_Time: string;
  Exception_Type: string;
  Entity: EntityInfo;
  Portfolio: Portfolio;
  Instrument_Common: InstrumentCommon;
  Settlement_Instruction: SSI;
  Value_Change: ValueChange[];
  FMO_Comments: FMOComments[];
  Comments_Change: CommentsChange[];
}

interface RatanException {
  Id: string | null;
  Original_Exception_Id: string | null;
  Exception_Code: string | null;
  Exception_Category: string | null;
  Exception_Type: string | null;
  Entity_Id: string | null;
  Entity_Version: number;
  Description: string | null;
  Actions: {
    Api_Url: string | null;
    Api_Method: string | null;
    Action_Name: string | null;
    Action_Type: string | null;
    Component_Url: string | null;
    Component_Name: string | null;
    Request_Body: string | null;
  }[];
  Status: string | null;
  Stashing: RatanStashing;
}

interface RatanStashing {
  Request_Body: string;
  Maker_Id: string;
}

interface RatanAffirmation {
  Affirmed_By: string | null;
  Phone_Email: string | null;
  Affirmed_At: string | null;
}

declare interface GraphqlCashflowDetails {
  cashflow: CashflowDataModal;
  cashflowAuditTrail: CashflowAuditTrail[];
  ratanException: RatanException[];
  ratanVostroCandidates: SSI[];
  ratanNostroCandidates: SSI[];
  ratanAffirmation: RatanAffirmation | null;
}

declare interface FilterItem {
  field: string;
  operator: string;
  values: string | number | string[] | DateType | DateType[];
}
