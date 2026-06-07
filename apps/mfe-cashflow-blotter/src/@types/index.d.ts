declare interface Window {
  ratanConfig: any;
  localStorage: any;
  token: string;
  reactDispatch: any;
  __RATAN_NOTIFICATION_DEBUGGER__: any[];
  experimentalNotification: boolean;
  notificationPool: CashflowNotificationPool<NotifiedCashflow>;
  splittingConfig: any;
}

declare interface MapType {
  [key: string]: any;
}

declare interface ActionType {
  type: string;
  data: any;
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

// copied from ratantyping
interface QuickSearchItemConfig {
  label?: string;
  field?: string;
  disabled?: boolean;
  disableLabel?: boolean;
  component: string;
  valueList?: string[] | { label: string; value: string }[];
  searchFun?: string;
  searchField?: string;
  selectMode?: string;
  placeholder?: string;
  manyInOne?: ManyInOneConfig[];
}

declare interface AggridFilterTag {
  colId: string;
  headerName?: string;
}

declare enum CashflowState {
  NA = "NA",
  PROJECTED = "PROJECTED",
  QUEUED = "QUEUED",
  WAITING = "WAITING",
  HOLD = "HOLD",
  READY = "READY",
  RELEASED = "RELEASED",
  SETTLED = "SETTLED",
  NOSTRO_MATCHED = "NOSTRO_MATCHED",
  NETTED = "NETTED",
  CASHFLOW_SUPPRESSED = "CASHFLOW_SUPPRESSED",
  SWIFT_SUPPRESSED = "SWIFT_SUPPRESSED",
  DEAD = "DEAD",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  SPLIT = "SPLIT",
}

// standard cashflow data modaling from Rosetta
declare interface CashflowDataModal {
  Position_Id?: string | null;
  BCS_Trade_Id?: string | null;
  Trade_Id?: string | null;
  Trade_State?: string | null;
  Settlement_Method?: string | null;
  Delivery_Method?: string | null;
  Parent_Trade_Id?: string | null;
  BCS_Parent_Trade_Id?: string | null;
  Trade_Version?: number | null;
  Entity?: EntityInfo;
  Instrument_Common?: InstrumentCommon;
  Portfolio?: Portfolio;
  Data_Flow?: DataFlow;
  Trade?: Trade;
  Cashflow?: CashflowInfo;
  FMO_Comments?: FMOComments[] | null;
  Settlement_Instruction?: SSI;
  Confirmation?: Confirmation | null;
  Trade_Original_Source_System_Name?: string | null;
}

declare interface CNCashflow extends CashflowDataModal {}

declare interface SplitTargetCashflow extends CNCashflow {
  vostroAccount?: any;
  nostroAccount?: any;
}

interface InstrumentCommon {
  ISDA_Taxonomy?: string | null;
  CFI_Code?: string | null;
  Source_System_Instrument_Sub_Type?: string | null;
  Equity_Instrument_Reference?: string | null;
  Parent_Trade_Instrument?: string | null;
  Murex_Product_Strategy?: string | null;
  Financial_Instrument_Code?: string | null;
}

interface CashflowInfo {
  Cashflow_Version?: number;
  Cashflow_Business_Version?: number;
  Cashflow_Event_Type?: string | null;
  NSTP_Reason?: string | null;
  Payer_Name?: string | null;
  Netting_Id?: string | null;
  Splitting_Id?: string | null;
  Payment_Date?: string | null;
  Is_STP_RATAN?: string | null;
  Is_STP?: string | null;
  Payment_Type?: string | null;
  Event_Date?: string | null;
  Cashflow_Sub_State_Updater?: string | null;
  Cashflow_Id?: string | null;
  Payment_Date_Business_Day_Convention?: string | null;
  Payment_Receiver_Party_Reference?: string | null;
  Booking_System_Event?: string | null;
  Cashflow_Event_Reason?: string | null;
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
  Cashflow_Swift_Message_Standard?: string | null;
  Cashflow_Swift_Status?: string | null;
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
  Counterparty_SCI_BIC_Net_Flag?: string | null;
  Counterparty_SCI_BIC_Code?: string | null;
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
  Confirmation_Status?: string | null;
}

interface SSI_Account extends SSI_Account_Extension {
  SCB_Nostro_Account_Number?: string | null;
  SCB_Nostro_Account_Type?: string | null;
  Beneficiary_BIC_code?: string | null;
  Beneficiary_Account_Name?: string | null;
  Beneficiary_Account_Name_2?: string | null;
  Beneficiary_Street_Address?: string | null;
  Beneficiary_City?: string | null;
  Beneficiary_Account_Number?: string | null;
  Intermediary_BIC_code?: string | null;
  Intermediary_Account_Name?: string | null;
  Intermediary_Street_Address?: string | null;
  Intermediary_City?: string | null;
  Intermediary_Account_Number?: string | null;
  Beneficiary_Bank_BIC_code?: string | null;
  Beneficiary_Bank_Account_Name?: string | null;
  Beneficiary_Bank_Street_Address?: string | null;
  Beneficiary_Bank_City?: string | null;
  Beneficiary_Bank_Account_Number?: string | null;
  Beneficiary_Correspondent_BIC_code?: string | null;
  Beneficiary_Correspondent_Account_Name?: string | null;
  Beneficiary_Correspondent_Street_Address?: string | null;
  Beneficiary_Correspondent_City?: string | null;
  Beneficiary_Correspondent_Account_Number?: string | null;
  Ordering_Customer_BIC_Code?: string | null;
  Ordering_Customer_Account_Name?: string | null;
  Ordering_Customer_Street_Address?: string | null;
  Ordering_Customer_City?: string | null;
  Ordering_Customer_Account_Number?: string | null;
  Counterparty_CMS_Account_Number?: string | null;
  EBBS_Bridge_Account_Number?: string | null;
  EBBS_Account_Number?: string | null;
  Booking_Entity_Correspondent_BIC_code?: string | null;
  Booking_Entity_Correspondent_Account_Name?: string | null;
  Booking_Entity_Correspondent_Street_Address?: string | null;
  Booking_Entity_Correspondent_City?: string | null;
  Booking_Entity_Correspondent_Account_Number?: string | null;
  Nostro_Type?: string | null;
}

interface SSI_Account_Extension {
  Beneficiary_Country_Name?: string | null;
  Cash_Correspondent_Account_Number?: string | null;
  Cash_Correspondent_BIC_code?: string | null;
  Cash_Correspondent_Sub_Account_Number?: string | null;
  Cash_Custodian_Account_Name?: string | null;
  Cash_Custodian_Account_Number?: string | null;
  Cash_Custodian_BIC_code?: string | null;
  Cash_Custodian_City?: string | null;
  Cash_Custodian_Street_Address?: string | null;
  Cash_Local_Agent_Account_Name?: string | null;
  Cash_Local_Agent_Account_Number?: string | null;
  Cash_Local_Agent_BIC_code?: string | null;
  Cash_Local_Agent_City?: string | null;
  Cash_Local_Agent_Street_Address?: string | null;
  Cash_Local_Agent_Sub_Account_Number?: string | null;
  Counterparty_BIC_Code?: string | null;
  Counterparty_Has_CMS_Account?: string | null;
  Has_Beneficiary_Account?: string | null;
  Has_Cash_Correspondent_Account?: string | null;
  Has_Cash_Custodian_Account?: string | null;
  Has_Cash_Local_Agent_Account?: string | null;
  Sender_Correspondent_Account_Number?: string | null;
  Sender_Correspondent_BIC_Code?: string | null;
}

interface SSI_Extension {
  Beneficiary_Account_Name?: string | null;
  Beneficiary_Account_Number?: string | null;
  Beneficiary_BIC_code?: string | null;
  Booking_Entity_BIC_Code?: string | null;
  Booking_Entity_Custodian_Account_Name?: string | null;
  Booking_Entity_Custodian_Account_Number?: string | null;
  Booking_Entity_Custodian_BIC_Code?: string | null;
  CFI_Code?: string | null;
  Cash_SSI_Id?: string | null;
  Comments?: string | null;
  Counterparty_Beneficiary_Account_Name?: string | null;
  Counterparty_Custodian_Account_Name?: string | null;
  Counterparty_Custodian_Account_Number?: string | null;
  Counterparty_Custodian_BIC_Code?: string | null;
  Counterparty_SCI_FMID?: string | null;
  Debit_Credit?: string | null;
  Effective_Date?: string | null;
  Event_Type?: string | null;
  ISDA_Taxonomy?: string | null;
  Is_Default_SSI?: string | null;
  Payment_Currency?: string | null;
  Primary_Asset_Class?: string | null;
  SCB_Entity_SCI_FMID?: string | null;
  SSI_Id?: string | null;
  SSI_Status?: string | null;
  Security_Custodian_Account_Name?: string | null;
  Security_Custodian_Account_Number?: string | null;
  Security_SSI_Id?: string | null;
  Settlement_Code?: string | null;
  Settlement_Flow_Nature?: string | null;
  Settlement_Location_Country_ISO_Code?: string | null;
  Settlement_Method?: string | null;
  Settlement_Type?: string | null;
  Source_System_Instrument_Id?: string | null;
  Source_System_Settlement_Location?: string | null;
  Swift_Payment_Date?: string | null;
  Usual_Id?: string | null;
  BranchId_Murex3Id?: string | null;
}

interface SSI extends SSI_Extension {
  Account?: SSI_Account;
  SSI_Unique_Id?: string | null;
  SSI_Source?: string | null;
  SSI_Priority?: string | null;
  Swift_Message_Type?: string | null;
  Remittance_Information_1?: string | null;
  Remittance_Information_2?: string | null;
  Remittance_Information_3?: string | null;
  Remittance_Information_4?: string | null;
  Sender_To_Receiver_Information_1?: string | null;
  Sender_To_Receiver_Information_2?: string | null;
  Sender_To_Receiver_Information_3?: string | null;
  Sender_To_Receiver_Information_4?: string | null;
  Sender_To_Receiver_Information_5?: string | null;
  Sender_To_Receiver_Information_6?: string | null;
  Is_Third_Party_Payment?: string | null;
  Swift_Payment_Method?: string | null;
  Charge_Bearer?: string | null;
  Nostro_Swift_Message_Type?: string | null;
  Nostro_Type?: string | null;
  Dedicated?: {
    Portfolio: string;
  };
}

interface ValueChange {
  Field_Name?: string | null;
  Old_Value?: string | null;
  New_Value?: string | null;
}

interface CommentsChange {
  Field_Name?: string | null;
  Old_Value?: FMOComments[];
  New_Value?: FMOComments[];
}

declare interface CashflowAuditTrail {
  Action_Date_Time?: string | null;
  User_PSID?: string | null;
  Cashflow?: CashflowInfo;
  Trade?: Trade;
  Action?: string | null;
  Action_Time?: string | null;
  Exception_Type?: string | null;
  Entity?: EntityInfo;
  Portfolio?: Portfolio;
  Instrument_Common?: InstrumentCommon;
  Settlement_Instruction?: SSI;
  Value_Change?: ValueChange[];
  FMO_Comments?: FMOComments[];
  Comments_Change?: CommentsChange[] | null;
}

interface RatanException {
  Id?: string | null;
  Original_Exception_Id?: string | null;
  Exception_Code?: string | null;
  Exception_Category?: string | null;
  Exception_Type?: string | null;
  Entity_Id?: string | null;
  Entity_Version?: number;
  Bulk_Eligible?: boolean | null;
  Description?: string | null;
  Actions?: {
    Api_Url?: string | null;
    Api_Method?: string | null;
    Action_Name?: string | null;
    Action_Type?: string | null;
    Component_Url?: string | null;
    Component_Name?: string | null;
    Request_Body?: string | null;
  }[];
  Status?: string | null;
  Stashing?: RatanStashing | null;
}

interface RatanStashing {
  Maker_Request_Body?: string | null;
  Maker_Id?: string | null;
  Checker_Request_Body?: string | null;
  Checker_Id?: string | null;
}

interface RatanAffirmation {
  Affirmed_By?: string | null;
  Phone_Email?: string | null;
  Affirmed_At?: string | null;
}

declare interface GraphqlCashflowDetails {
  cashflow?: CashflowDataModal;
  cashflowAuditTrail?: CashflowAuditTrail[];
  cashflowAuditTrailByOpenSearch?: CashflowAuditTrail[];
  ratanException?: RatanException[];
  ratanVostroCandidates?: SSI[];
  ratanNostroCandidates?: SSI[];
  ratanAffirmation?: RatanAffirmation | null;
}

interface Trade_Review {
  Trade_Id?: string;
  Trade_State?: string;
  Trade_Version?: number;
  Trade_Date?: string;
  Trade_Lake_Trade_Major_Version?: number;
  Trade_Lake_Trade_Minor_Version?: number;
  Entity?: {
    Booking_Entity_SCI_LEID?: string;
    Counterparty_SCI_FMID?: string;
    Booking_Entity_LEI?: string;
  };
  Portfolio?: {
    Booking_Entity_Trade_Portfolio_Name?: string;
  };
  Instrument_Common?: {
    ISDA_Taxonomy?: string;
  };
}

declare interface SelectOptionData {
  label: string;
  value: string | number | [];
  key: string | number;
  testId?: string;
  className?: string;
}

declare interface SelectOptionMapType {
  [key: string]: SelectOptionData[];
}

declare interface CounterPartyDetailsFMEntity {
  legalEntity?: {
    legalName?: string | null;
    shortName?: string | null;
    regulatoryInfo?: {
      regulatoryTypeValue?: string | null;
      regulatoryFields?: string | null;
      regulatoryField2Value?: string | null;
      regulatoryFieldText?: string | null;
    }[];
    leId?: string | null;
    legalEntityOrgDetails?: {
      empRelationship?: {
        empCode?: string | null;
      }[];
      clientTax?: {
        typeOfDocumentValue?: string | null;
        expiryDateOfDocument?: string | null;
      }[];
      domicileCountry?: string | null;
      officialAddress?: {
        line1?: string | null;
        line2?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        postCode?: string | null;
        phone?: string | null;
        email?: string | null;
        fax?: string | null;
      }[];
    }[];
    incorporatedCountry?: string | null;
    subSegmentCodeValue?: string | null;
    registeredAddress?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      postCode?: string | null;
    };
    creditGrade?:
      | {
          creditGradeCodeValue?: string | null;
        }[]
      | null;
    scbGroupEntity?: string | null;
    doddFrankDetails?: {
      dfComplaint?: string | null;
      doddFrankEntityTypeValue?: string | null;
      usPerson?: string | null;
      tradestatusvalue?: string | null;
      intialMarginMethod?: string | null;
    };
    dfIncCntryIsoCode?: string | null;
    mifidClntClasValue?: string | null;
  };
  fmAccount?: {
    fmId?: string | null;
    fmCode?: string | null;
    fmType?: string | null;
    fmLongName?: string | null;
    subProfileId?: string | null;
    omgAlertId?: string | null;
    rmfFlag?: string | null;
    clsEigibility?: string | null;
    clsStartDate?: string | null;
    dvpCustInd?: string | null;
    leId?: string | null;
    fmProfileShortName?: string | null;
    fmProfileStatus?: string | null;
    fmLongName1?: string | null;
    ultParentFmId?: string | null;
    fmLimitType?: string | null;
    ccilMemberId?: string | null;
    ccilAbbreviatedName?: string | null;
    equivalentCCILCounterpartyAtlasID?: string | null;
    markitWireId?: string | null;
    omgOgdId?: string | null;
    iceLinkId?: string | null;
    omgCtmId?: string | null;
    omgCtmAccount?: string | null;
    btsId?: string | null;
    scbClassCode?: string | null;
    opicsClassCode?: string | null;
    fmClassCode?: string | null;
    finInstType?: string | null;
    InstSector?: string | null;
    clsCustType?: string | null;
    brokerId?: string | null;
    pbFlag?: string | null;
    rpOverride?: string | null;
    valuationStatement?: string | null;
    setupToClear?: string | null;
    nameMaskingRequired?: string | null;
    fundCode?: string | null;
  };
  fmSysContact?: {
    addrLine?: string | null;
    mediumUsage?: string | null;
    fmSysContSysGenId?: string | null;
    mediumCode?: string | null;
    confirmationText?: string | null;
  }[];
  fmAddress?: {
    fmAddrSysGenId?: string | null;
    addrType?: string | null;
    addrLine1?: string | null;
    addrLine2?: string | null;
    state?: string | null;
    city?: string | null;
    country?: string | null;
    postCode?: string | null;
    email?: string | null;
    phone?: string | null;
  }[];
  fmHierarchy?: {
    parentFmId?: string | null;
  };
  fmScbInfo?: {
    nettingAllowed?: string | null;
  };
}
declare interface FilterItem {
  field: string;
  operator: string;
  values: string | number | string[] | DateType | DateType[];
}

declare interface CustomFormConfigProps {
  field: string;
  label: string;
  componentType?: string;
  hasDivider?: boolean;
  title?: string;
  options?: {
    label: string;
    value: string | boolean;
  }[];
  hasBr?: boolean;
  placeholder?: any;
  onSearch?: Function;
  onChange?: any;
  onClick?: any;
  buttonText?: string;
  isRequired?: boolean;
  disabled?: boolean;
  notSubmit?: boolean;
  hidden?: boolean;
  itemRules?: any[];
  defaultValue?: any;
  validationRules?: any;
  tooltipText?: string | React.ReactNode;
}

declare let ratanConfig: any;

declare let splittingConfig: any;

declare type PrimitiveNotNilValue = string | number | boolean;
declare type PrimitiveNilValue = null | undefined;
declare type PrimitiveValue = PrimitiveNotNilValue | PrimitiveNilValue;
declare type SimpleObject = {
  [k: string]: PrimitiveValue | SimpleObject;
};
declare type SimpleNotNilObject = {
  [k: string]: PrimitiveNotNilValue | SimpleObject;
};
declare type PlainObject = {
  [k: string]: PrimitiveValue;
};

declare interface swiftmessageList {
  sequence: number;
  mxType: string;
  mxMessage: string | null;
}

declare interface MultiSwiftMessageProps {
  swiftMessages: swiftmessageList[];
  cashflowId: string;
}
