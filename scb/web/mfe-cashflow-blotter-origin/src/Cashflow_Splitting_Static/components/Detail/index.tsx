import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import {
  closeDialog,
  DetailMode,
} from "src/Cashflow_Splitting_Static/store/detail.slice";
import {
  AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB,
  AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB,
} from "src/Root/analysis/const";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { AuditById } from "./AuditById";
import { a11yProps, CustomTabPanel } from "./components/CustomTabPanel";
import { RuleDetail } from "./RuleDetail";

export const SplittingStaticDetailDialog = () => {
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
      data-testid="splitting-static-detail-dialog"
      minWidth={700}
      minHeight={500}
      width={750}
      height={580}
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
                AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB
              }
              {...a11yProps(0)}
            />
            <Tab
              label="Rule History"
              data-testid={
                AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB
              }
              {...a11yProps(1)}
            />
          </Tabs>
        ) : (
          <div>Create New Rule</div>
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
