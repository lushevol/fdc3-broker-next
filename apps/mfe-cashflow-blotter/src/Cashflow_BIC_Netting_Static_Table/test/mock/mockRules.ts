import { BicNettingRuleRow } from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import { RuleStatusType } from "src/Cashflow_BIC_Netting_Static_Table/state/types";

export const mockBicNettingRules: BicNettingRuleRow[] = [
  {
    id: 100,
    entityFmId: "10075222",
    family: "CURR",
    group: "FXD",
    type: "XSW",
    typology: "NDF",
    strategy: "SWAP",
    beneficiaryBic: "BOFAUS6NGFAAX",
    dataStatus: RuleStatusType.SavedConfirm,
    makerId: "2006148",
    checkerId: "1632737",
    updateRecordId: null,
    createdAt: "2024-08-29T18:54:17.539018Z",
    updatedAt: "2024-09-06T08:28:35.887763Z",
  },
];
