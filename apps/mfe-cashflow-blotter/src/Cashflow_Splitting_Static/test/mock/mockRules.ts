import { StaticRuleRow } from "src/Cashflow_Splitting_Static/services/api.type";
import { RuleStatusType } from "src/Cashflow_Splitting_Static/state/types";

export const mockSplittingStaticRules: StaticRuleRow[] = [
  {
    id: 100,
    ruleUniqueId: 100,
    entityFmId: "10075222",
    entityFmCode: "SCB Test Entity Code",
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
    amount: "",
    currency: "",
    limitation: "",
    nostroAgent: "",
    threshold: "",
  },
];
