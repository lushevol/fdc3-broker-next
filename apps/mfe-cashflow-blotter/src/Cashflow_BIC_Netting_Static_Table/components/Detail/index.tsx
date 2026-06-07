import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import {
  closeDialog,
  DetailMode,
} from "src/Cashflow_BIC_Netting_Static_Table/store/detail.slice";
import {
  BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB,
  BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB,
} from "src/Root/analysis/const";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { AuditById } from "./AuditById";
import { a11yProps, CustomTabPanel } from "./components/CustomTabPanel";
import { RuleDetail } from "./RuleDetail";

export const BicNettingStaticDetailDialog = () => {
  const dispatch = useAppDispatch();
  const { openDialog, mode } = useAppSelector((state) => state.detail);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (openDialog) {
      setTabIndex(0);
    }
  }, [openDialog]);

  const handleTabIndexChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabIndex(newValue);
  };

  return (
    <MuiDialog
      open={openDialog}
      onClose={() => dispatch(closeDialog())}
      data-testid="bic-netting-static-detail-dialog"
      width={820}
      height={520}
      isResizeble={true}
      enableResize
      enableMaximize
      title={
        mode === DetailMode.Edit ? (
          <Tabs
            value={tabIndex}
            onChange={handleTabIndexChange}
            aria-label="Rule Details Tabs"
          >
            <Tab
              label="Rule Detail"
              data-testid={
                BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB
              }
              {...a11yProps(0)}
            />
            <Tab
              label="Rule History"
              data-testid={
                BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB
              }
              {...a11yProps(1)}
            />
          </Tabs>
        ) : (
          "Create New Rule"
        )
      }
    >
      <CustomTabPanel value={tabIndex} index={0}>
        <RuleDetail />
      </CustomTabPanel>
      {mode === DetailMode.Edit && (
        <CustomTabPanel value={tabIndex} index={1}>
          <AuditById />
        </CustomTabPanel>
      )}
    </MuiDialog>
  );
};
