import { ExceptionItem } from "../../common/interface";
import { LayoutAvailableActions } from "../../hooks/interface";
import { NostroFormDetails } from "../Nostro/interface";

export interface VostroSectionProps {
  listData: VostroListDataType[];
  detailsData?: VostroFormDetails;
  exceptions?: ExceptionItem[];
  onSelectRecord: (item: VostroListDataType) => void;
  onResetFormValidationStatus: (n: string, payload: any) => void;
  setVostroFormFieldsValue: (p: { [f: string]: any }) => void;
  counterPartyDetails?: CounterPartyDetailsFMEntity;
  cashflowDetails?: GraphqlCashflowDetails;
  nostroDetailsData?: NostroFormDetails;
  isLookUpOnly?: boolean;
}

export type VostroListDataType = SSI;
export type VostroFormDetails = {
  settlementCode: string;
  ssiSource: string;
  ssiStatus: string;
  effectiveDate: string;
  fmid: string;
  counterpartName: string;
  swiftType: string;
  country: string;
  security: string;
  debitCredit: string;
  settlementMethod: string;
  deliveryMethod: string;
  settlementMeans: string;
  settlementType: string;
  systemCode: string;
  ssiId: string;
  entity: string;
  tradingCurrency: string;
  typology: string;
  ssiType: string;
  settlementAccount: string;
  productGroup: string;
  productFamily: string;
  productType: string;
  coveredPayment: string;
  cmsAccount: string;
  charges: string;
  isThirdpartyPayment: string;

  beneficiaryBic: string;
  beneficiaryName: string;
  beneficiaryName2: string;
  beneficiaryAddress: string;
  beneficiaryCity: string;
  beneficiaryPostcode: string;
  beneficiaryAccount: string;

  accountWithInstitutionBic: string;
  accountWithInstitutionName: string;
  accountWithInstitutionAddress: string;
  accountWithInstitutionCity: string;
  accountWithInstitutionPostcode: string;
  accountWithInstitutionAccount: string;

  receiversCorrespondentBic: string;
  receiversCorrespondentName: string;
  receiversCorrespondentAddress: string;
  receiversCorrespondentCity: string;
  receiversCorrespondentPostcode: string;
  receiversCorrespondentAccount: string;

  intermediaryBic: string;
  intermediaryName: string;
  intermediaryAddress: string;
  intermediaryCity: string;
  intermediaryPostcode: string;
  intermediaryAccount: string;

  orderCustomerBic: string;
  orderCustomerName: string;
  orderCustomerAddress: string;
  orderCustomerCity: string;
  orderCustomerPostcode: string;
  orderCustomerAccount: string;

  remittanceInformation1: string;
  remittanceInformation2: string;
  remittanceInformation3: string;
  remittanceInformation4: string;

  senderToReceiver1: string;
  senderToReceiver2: string;
  senderToReceiver3: string;
  senderToReceiver4: string;
  senderToReceiver5: string;
  senderToReceiver6: string;

  eventRowKey: string;
  bookingEntity: string;
  cfiCode: string;
  popDubai: string;
};

export interface VostroListProps {
  data: VostroListDataType[];
  onSelectRow: (record: VostroListDataType) => void;
}

export interface VostroFormProps {
  data?: VostroFormDetails;
  disable: boolean;
  actions: LayoutAvailableActions[];
  onTriggerAction: (a: LayoutAvailableActions) => void;
  counterPartyDetails?: CounterPartyDetailsFMEntity;
  setVostroFormFieldsValue: (p: { [f: string]: any }) => void;
  cashflowDetails?: GraphqlCashflowDetails;
  nostroDetailsData?: NostroFormDetails;
}

export type VostroExceptionType =
  | "Missing Vostro"
  | "Multi Vostro"
  | "Adhoc SI";
