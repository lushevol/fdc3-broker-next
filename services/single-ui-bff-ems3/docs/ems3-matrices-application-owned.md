# Proposed EMS3 Matrices: Each Application Manages Its Own Registration

Prepared: 7 October 2026.

[Read the explanation and data flow](/Users/lushevol/.codex/worktrees/ems3-single-ui-bff/fdc3-broker-next/services/single-ui-bff-ems3/docs/ems3-three-application-report.md)

Every supplied role/feature/action grant is included below. Exact spellings, spaces and case are preserved.

A row is an allow-list: only the listed actions are granted by that role for that feature. A missing role/feature row grants nothing in this export. This is a definition matrix, not a list of assigned users.

The registration and assignment owner is the respective application team. Permissions are preserved; ownership does not add permissions.

RATAN and Stamp retain their complete EMS2 matrices. FlowZero retains the supplied EMS3 pilot catalogue pending owner confirmation of completeness and any legacy claim compatibility.

| Application | EMS3 app name (proposed) | Registration ID | Logical app UID | Portal entity |
| --- | --- | --- | --- | --- |
| RATAN | `RATAN_ENTITLEMENT_RULE` | `RATAN_ID_TBC` | `RATAN_UID_TBC` | `X_RATANONE` |
| FlowZero | `FLOWZERO` | `FLOWZERO_ID_TBC` | `FLOWZERO_UID_TBC` | `FLOW_ZERO` |
| Stamp | `STAMP` | `STAMP_ID_TBC` | `STAMP_UID_TBC` | `STAMP_STATIC` |

All IDs are placeholders requiring EMS3 confirmation. App names and UIDs remain distinct even when a registration ID is shared. Stamp is shown as a future target; it is not switched in the worked example.

| Application | Roles | Subjects / features | Actions | Grants |
| --- | ---: | ---: | ---: | ---: |
| RATAN | 25 | 25 | 51 | 806 |
| FlowZero | 39 | 8 | 11 | 398 |
| Stamp | 4 | 32 | 6 | 458 |

## RATAN

Portal entity: `X_RATANONE`. EMS2 XML: 806 grants. The supplied EMS3 user sample is incomplete for parity.

Status: proposed EMS3 definitions. These tables are not evidence of completed registration.

### `RATAN_AUTO_NETTING_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_CASHFLOW_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `ACCESS_ID_TEST`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Nostro_Initiate`, `F_Ad_Hoc_Nostro_Verify`, `F_Ad_Hoc_SSI_Initiate`, `F_Ad_Hoc_SSI_Verify`, `F_Ad_Hoc_Suppress`, `F_Add_Settlement_Comment`, `F_Cashflow_Affirmation_Status_Change`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |

### `RATAN_CASHFLOW_GROUP_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Cashflow_Status_Change_Release`, `F_ManualStp` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_CA_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Exception_Addtional_Info_Update`, `F_Manually_Close_Exception` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Exception_Addtional_Info_Update`, `F_Exception_Label_Management`, `F_Manually_Close_Exception` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_CA_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_ENTITLEMENT_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_FLOW_ZERO`

| Role | Allowed actions |
| --- | --- |
| `FMO_COO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_BPMN_DESIGNER`, `F_WORKFLOW_QUERY` |
| `FMO_COO_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_BPMN_DESIGNER`, `F_WORKFLOW_INSTANCE_REQUEST`, `F_WORKFLOW_QUERY`, `F_WORKFLOW_STA_CKR`, `F_WORKFLOW_STA_MKR` |
| `FMO_MO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_BPMN_DESIGNER`, `F_WORKFLOW_INSTANCE_REQUEST`, `F_WORKFLOW_QUERY`, `F_WORKFLOW_STA_CKR`, `F_WORKFLOW_STA_MKR` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_QUERY` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_INSTANCE_REQUEST`, `F_WORKFLOW_QUERY` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_BPMN_DESIGNER`, `F_WORKFLOW_INSTANCE_REQUEST`, `F_WORKFLOW_QUERY`, `F_WORKFLOW_STA_CKR`, `F_WORKFLOW_STA_MKR` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_WORKFLOW_BPMN_DESIGNER`, `F_WORKFLOW_INSTANCE_REQUEST`, `F_WORKFLOW_QUERY`, `F_WORKFLOW_STA_CKR`, `F_WORKFLOW_STA_MKR` |

### `RATAN_FM_COO_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_COO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Exception_Addtional_Info_Update`, `F_Manually_Close_Exception` |
| `FMO_COO_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Exception_Addtional_Info_Update`, `F_Export_Data`, `F_Manually_Close_Exception` |

### `RATAN_FM_COO_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_COO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_COO_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |

### `RATAN_KR_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_KR_OPS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Manually_Close_Exception`, `F_Replay_Exception` |
| `KR_PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_MO_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Exception_Addtional_Info_Update`, `F_Manually_Close_Exception` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Exception_Addtional_Info_Update`, `F_Exception_Label_Management`, `F_Manually_Close_Exception` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Exception_Addtional_Info_Update`, `F_Manually_Close_Exception` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Exception_Addtional_Info_Update`, `F_Exception_Label_Management`, `F_Manually_Close_Exception` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_MO_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_NETTING_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify`, `UI_View_Rule_Audit_History` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `UI_View_Rule_Audit_History` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_NOSTRO_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_OPTION_EXPIRY_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Option_Expiry_Read` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Option_Expiry_Read`, `F_Option_Expiry_Update` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Import_Data`, `F_Option_Expiry_Read`, `F_Option_Expiry_Update` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Option_Expiry_Read` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Option_Expiry_Read` |

### `RATAN_PROFILE_LIMITS`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_RULE_ENGINE`

| Role | Allowed actions |
| --- | --- |
| `FMO_COO` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_COO_SUP` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_RO` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_TE` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_TE_SUP` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_TV` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_MO_TV_SUP` | `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |

### `RATAN_SETTLEMENT_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Replay_Exception` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Replay_Exception` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Replay_Exception` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Manually_Close_Exception`, `F_Replay_Exception` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Manually_Close_Exception`, `F_Replay_Exception` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Manually_Close_Exception`, `F_Replay_Exception` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Input_Delete_Modify_SI_Initiate`, `F_Input_Delete_Modify_SI_Verify`, `F_Manual_Fix`, `F_Replay_Exception` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Manual_Fix`, `F_Manually_Close_Exception`, `F_Replay_Exception` |

### `RATAN_SETTLEMENT_STP_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_STRATEGIC_CASHFLOW_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Multi_Exception_Verify`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate`, `F_Un_Hold` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Multi_Exception_Verify`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate`, `F_Un_Hold` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_ManualStp`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Multi_Exception_Verify`, `F_Multi_Exception_Verify_High_Risk`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate`, `F_Un_Hold` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_ManualStp`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Multi_Exception_Verify`, `F_Multi_Exception_Verify_High_Risk`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate`, `F_Un_Hold` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_ManualStp`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Multi_Exception_Verify`, `F_Multi_Exception_Verify_High_Risk`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Perform_Un_Net_Verify`, `F_Reinstate`, `F_Un_Hold` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Fail` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Ad_Hoc_Suppress`, `F_Cashflow_Status_Change_Release`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Fail`, `F_Hold`, `F_Modify_Settlement_Means`, `F_Multi_Exception_Initiate`, `F_Perform_Ad_Hoc_Netting`, `F_Perform_Cashflow_Split`, `F_Perform_Un_Net_Initiate`, `F_Reinstate` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Reinstate` |

### `RATAN_SUPPRESSION_RULE`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate`, `F_Input_Delete_Modify_Verify` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Input_Delete_Modify_Initiate` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_TEST_PORTAL_RATAN`

| Role | Allowed actions |
| --- | --- |
| `FMO_RATAN_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_TEST_PORTAL_VPA`

| Role | Allowed actions |
| --- | --- |
| `FMO_VPA_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `RATAN_TRADE_BLOTTER`

| Role | Allowed actions |
| --- | --- |
| `FMO_COO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Export_Data` |
| `FMO_COO_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Export_Data` |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch`, `F_Trade_Affirmation_Status_Change` |
| `FMO_MO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_TRADE_REVIEW_READ` |
| `FMO_MO_TE` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_TRADE_REVIEW_READ`, `F_TRADE_REVIEW_UPDATE` |
| `FMO_MO_TE_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_TRADE_REVIEW_READ`, `F_TRADE_REVIEW_UPDATE` |
| `FMO_MO_TV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_FX_REPLICATION_REPLAY`, `F_TRADE_REVIEW_READ`, `F_TRADE_REVIEW_UPDATE` |
| `FMO_MO_TV_SUP` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_FX_REPLICATION_FORCE_REPLAY`, `F_FX_REPLICATION_REPLAY`, `F_TRADE_REVIEW_READ`, `F_TRADE_REVIEW_UPDATE` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data`, `F_Retrigger_Confirmation_Dispatch` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_Query_Builder`, `F_Custom_View_Builder_Private`, `F_Export_Data` |

### `RATAN_VALIDATION_EXCEPTION`

| Role | Allowed actions |
| --- | --- |
| `FMO_ID_OPS_TEST` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Replay_Exception`, `F_Trade_Affirmation_Status_Change` |
| `FMO_OPS_BO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOC` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOL` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Manually_Close_Exception`, `F_Replay_Exception`, `F_Trade_Affirmation_Status_Change` |
| `FMO_OPS_BOM` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_BOS` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private`, `F_Custom_View_Builder_Public`, `F_Manually_Close_Exception`, `F_Replay_Exception`, `F_Trade_Affirmation_Status_Change` |
| `FMO_OPS_INV` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_OPS_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Custom_View_Builder_Private` |
| `FMO_STA_CKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `FMO_STA_MKR` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `NON_FMO_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `F_Manually_Close_Exception`, `F_Replay_Exception` |

## FlowZero

Portal entity: `FLOW_ZERO`. EMS3 pilot catalogue sample: 398 grants. No FlowZero EMS2 matrix was supplied; this is the known pilot configuration, not a recovered EMS2 baseline.

Status: proposed EMS3 definitions. These tables are not evidence of completed registration.

### `FIELD_CONFIGURATION`

| Role | Allowed actions |
| --- | --- |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `FORM_MANAGEMENT`

| Role | Allowed actions |
| --- | --- |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `HOMEPAGE`

| Role | Allowed actions |
| --- | --- |
| `Bangladesh_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Bangladesh_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `China_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `China_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `FLOWZERO Bangladesh & Global Except_Onboard_Ops` | `VIEW_HOMEPAGE` |
| `FLOWZERO India & Germany  & Global Except_Onboard_Ops` | `VIEW_HOMEPAGE` |
| `FLOWZERO India & Global except _Onboard_Ops` | `VIEW_HOMEPAGE` |
| `FLOWZERO Indonesia & Global Except_Onboard_Ops` | `VIEW_HOMEPAGE` |
| `FLOWZERO Indonesia & India & Global except _Onboard_Ops` | `VIEW_HOMEPAGE` |
| `FLOWZERO Taiwan (Province of China) &  Global Except_Onboard_Ops` | `VIEW_HOMEPAGE` |
| `Flowzero Korea & Global Except_Onboard_Ops` | `VIEW_HOMEPAGE` |
| `Flowzero Pakistan & India & Global except _Onboard_Ops` | `VIEW_HOMEPAGE` |
| `Germany_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Germany_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global Except_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global Except_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global_Designer` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global_Designer_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Global_Onboard_Ops_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `India_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `India_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Indonesia_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Indonesia_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Korea_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Korea_Onboard__BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Pakistan_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Pakistan_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Taiwan (Province of China)_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |
| `Taiwan (Province of China)_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_HOMEPAGE` |

### `RAISE_REQUEST`

| Role | Allowed actions |
| --- | --- |
| `Bangladesh_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Bangladesh_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `China_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `China_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO Bangladesh & Global Except_Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO India & Germany  & Global Except_Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO India & Global except _Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO Indonesia & Global Except_Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO Indonesia & India & Global except _Onboard_Ops` | `VIEW_PUBLISHEDWORKFLOW` |
| `FLOWZERO Taiwan (Province of China) &  Global Except_Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Flowzero Korea & Global Except_Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Flowzero Pakistan & India & Global except _Onboard_Ops` | `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Germany_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Germany_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Global Except_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Global Except_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Global_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Global_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Global_Onboard_Ops_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_PUBLISHEDWORKFLOW` |
| `India_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `India_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Indonesia_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Indonesia_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Korea_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Korea_Onboard__BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_PUBLISHEDWORKFLOW` |
| `Pakistan_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Pakistan_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Taiwan (Province of China)_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `BATCH_IMPORT`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |
| `Taiwan (Province of China)_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `RAISE_NEW_REQUEST`, `VIEW_PUBLISHEDWORKFLOW` |

### `REQUEST_CENTRE`

| Role | Allowed actions |
| --- | --- |
| `Bangladesh_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Bangladesh_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `China_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `China_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `FLOWZERO Bangladesh & Global Except_Onboard_Ops` | `EDIT_COMMENT` |
| `FLOWZERO India & Germany  & Global Except_Onboard_Ops` | `EDIT_COMMENT` |
| `FLOWZERO India & Global except _Onboard_Ops` | `EDIT_COMMENT` |
| `FLOWZERO Indonesia & Global Except_Onboard_Ops` | `EDIT_COMMENT` |
| `FLOWZERO Taiwan (Province of China) &  Global Except_Onboard_Ops` | `EDIT_COMMENT` |
| `Flowzero Korea & Global Except_Onboard_Ops` | `EDIT_COMMENT` |
| `Flowzero Pakistan & India & Global except _Onboard_Ops` | `EDIT_COMMENT` |
| `Germany_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Germany_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Global Except_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Global Except_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Global_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Global_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Global_Onboard_Ops_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `India_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `India_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Indonesia_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Indonesia_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Korea_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Korea_Onboard__BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `Pakistan_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Pakistan_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Taiwan (Province of China)_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |
| `Taiwan (Province of China)_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `EDIT_COMMENT` |

### `TODO`

| Role | Allowed actions |
| --- | --- |
| `Bangladesh_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Bangladesh_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `China_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `China_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `FLOWZERO Bangladesh & Global Except_Onboard_Ops` | `APPROVE_TASK`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `FLOWZERO India & Germany  & Global Except_Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `FLOWZERO India & Global except _Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `FLOWZERO Indonesia & Global Except_Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `FLOWZERO Indonesia & India & Global except _Onboard_Ops` | `EDIT_COMMENT` |
| `FLOWZERO Taiwan (Province of China) &  Global Except_Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Flowzero Korea & Global Except_Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Flowzero Pakistan & India & Global except _Onboard_Ops` | `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Germany_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Germany_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Global Except_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Global Except_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Global_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Global_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Global_Onboard_Ops_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `India_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `India_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Indonesia_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Indonesia_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Korea_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Korea_Onboard__BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL`, `VIEW_COMMENTS` |
| `Pakistan_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Pakistan_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Taiwan (Province of China)_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |
| `Taiwan (Province of China)_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL`, `APPROVE_TASK`, `EDIT_COMMENT`, `EDIT_TASK`, `REJECT_TASK`, `TERMINATE_TASK` |

### `UPLOAD_FILE`

| Role | Allowed actions |
| --- | --- |
| `Bangladesh_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Bangladesh_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `China_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `China_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Germany_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Germany_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global Except_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global Except_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Onboard_Ops_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `India_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `India_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Indonesia_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Indonesia_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Korea_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Korea_Onboard__BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Pakistan_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Pakistan_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Taiwan (Province of China)_Onboard_BatchOps` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Taiwan (Province of China)_Onboard_Ops` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### `WORKFLOW_MANAGEMENT`

| Role | Allowed actions |
| --- | --- |
| `DEV_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `Global_Designer_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |
| `PSS_RO` | `ACCESS_FMO_POST_TRADE_PORTAL` |

### Roles With No Feature Grants

| Role | Feature/action grants |
| --- | --- |
| `FLOWZERO Application Admin` | (none) |
| `FLOWZERO Application User` | (none) |
| `FLOWZERO Consumer` | (none) |
| `FLOWZERO PSS User` | (none) |
| `FMCES_ User` | (none) |
| `FMCES_ADMIN` | (none) |

These definitions are preserved explicitly. A role alone does not expose FlowZero tile 108, which requires a matching subject.

## Stamp

Portal entity: `STAMP_STATIC`. EMS2 XML: 458 grants. Stamp remains on EMS2 in the worked example.

Status: proposed EMS3 definitions. These tables are not evidence of completed registration.

| Feature / subject | `CHECKER` | `MAKER` | `STATIC_STAMP` | `VIEW_ONLY` |
| --- | --- | --- | --- | --- |
| `Audit` | `Read` | `Read` | `Read` | `Read` |
| `CFETS_BusinessCenter_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_CCS_Index_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_CCS_Schedule_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_CCS_USDcurrency_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_FX_TraderId_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_IRS_Index_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_IRS_MDS_SD_SWAP_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `CFETS_Rates_TraderId_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `Dummy_UVT_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_Cashflow_Suspension_Status_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_CortexIndex_Mapping_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_Product_Codes_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_Products_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_Restricted_Product_Portfolio_STL` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `FMRPStella_Schedule_Enrichment_Eligibility` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `Mapping Query` | `Write` | `Write` | `Write` | `Read` |
| `RDM_CMPS` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_FSS` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_MAS54B` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_Monitored_Non_Markets_Staff` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_RateSetter-ALM` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_RateSetter-BondsLoans` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_RateSetter-Derivatives` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_RateSetter-FX` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_T-Capital` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `RDM_T-Mgmt` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `S2BX_DropCopyPortfolio` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `S2BX_RestrictedPortfolio_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `S2BX_TCID_to_Portfolio_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `S2BX_cptyTCID_to_FMID_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
| `Traiana_FMID_Counterparty_Broker_Mapping` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Create`, `Delete`, `Edit`, `Read` | `Approve`, `Create`, `Delete`, `Edit`, `Read` | `Read` |
