import { UtilizationRuleRow } from "../../services/api.type";
import { RuleStatusType } from "../../state/types";

export const mockUtilizationRules: UtilizationRuleRow[] = [
  {
    id: 100,
    counterpartyFmId: "1001",
    counterpartyFmCode: "SCB BOMBAY*MMB",
    entityFmId: "400703596",
    entityFmCode: "PROFUTURO PR F 1*LIM",
    autoUtil: "Yes",
    dataStatus: RuleStatusType.SavedConfirm,
    makerId: "2006148",
    checkerId: "1632737",
    createdAt: "2024-08-29T18:54:17.539018Z",
    updatedAt: "2024-09-06T08:28:35.887763Z",
    settlementMeans: "FXBRREC",
    settlementAccount: "FXBRREC",
  },
];
