import { LayoutAvailableActions } from "../../hooks/interface";

export interface NostroSectionProps {
  listData: NostroListDataType[];
  detailsData?: NostroFormDetails;
  onSelectRecord: (record: NostroListDataType) => void;
}
export type NostroListDataType = SSI;
export type NostroFormDetails = {
  id: string;
  legalEntity: string;
  legalEntityFmid: string;
  settlementCurrency: string;
  settlementMeans: string;
  settlementAccount: string;
  nostroType: string;
  dedicatedPortfolio: string;
  noticeToReceive: string;
  nostroSettlementMessageType: string;

  ebbsNostroAccount: string;
  ebbsBridgeAccount: string;
  sendersCorrespondent53Swift: string;
  sendersCorrespondent53Fullname: string;
  sendersCorrespondent53Address: string;
  sendersCorrespondent53City: string;
  sendersCorrespondent53PostCode: string;
  sendersCorrespondent53Account: string;

  createdAt: string;
  updatedAt: string;

  primaryFlag: string;
};

export interface NostroListProps {
  data: NostroListDataType[];
  onSelectRow: (record: NostroListDataType) => void;
}

export interface NostroFormProps {
  data?: NostroFormDetails;
  disable: boolean;
  actions: LayoutAvailableActions[];
  onTriggerAction: (a: LayoutAvailableActions) => void;
}
