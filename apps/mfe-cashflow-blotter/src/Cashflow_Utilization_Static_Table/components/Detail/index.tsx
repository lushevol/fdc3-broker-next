import { css, styled, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import {
  UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB,
  UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB,
} from "src/Root/analysis/const";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { closeDialog, DetailMode } from "../../store/detail.slice";
import { AuditById } from "./AuditById";
import { a11yProps, CustomTabPanel } from "./components/CustomTabPanel";
import { RuleDetail } from "./RuleDetail";

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .MuiDialogContent-root {
      height: 100%;
    }
  `
);

export const UtilizationStaticDetailDialog = () => {
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
    <StyledMuiDialog
      key={mode}
      open={openDialog}
      onClose={() => dispatch(closeDialog())}
      data-testid="utilization-static-detail-dialog"
      width={600}
      height={mode === DetailMode.Edit ? 500 : 370}
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
                UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB
              }
              {...a11yProps(0)}
            />
            <Tab
              label="Rule History"
              data-testid={
                UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB
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
    </StyledMuiDialog>
  );
};
