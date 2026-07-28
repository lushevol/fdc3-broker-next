import { css, styled } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { CASHFLOW_DETAILS_DIALOG } from "src/Root/analysis/const";
import { ErrorBoundry } from "src/Root/import";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { DetailsBody, HeaderTabs, SWIFT_MESSAGE_TAB } from "./detailsBody";

interface CashflowDetailsDialogProps {
  isOpen: boolean;
  details: CNCashflow;
  onClose: () => void;
  onQueryCashflow: (cashflowIds: string[], isPass?: boolean) => void;
  onOpenTradeDetails: () => Promise<void>;
  defaultActiveKey: string;
  refreshCashflow?: () => Promise<any>;
}

const StyledMuiDialog = styled(MuiDialog)(
  () => css`
    .MuiDialogTitle-root {
      .MuiGrid-container {
        .MuiGrid-item:first-child {
          .MuiTabs-root {
            min-height: 16px;
            .MuiTab-root {
              min-height: 16px;
              padding: 8px 16px;
            }
          }
        }
        .MuiGrid-item:nth-child(2) {
          z-index: 1;
        }
      }
    }
    .MuiDialogContent-root {
      padding: 0;
    }
    .MuiPaper-rounded {
      min-width: unset;
    }
    * {
      user-select: text;
    }
    ul {
      padding-inline-start: 0;
    }
  `
);

const CashflowDetailsDialog = memo<CashflowDetailsDialogProps>(
  ({
    isOpen,
    details,
    onClose,
    onQueryCashflow,
    onOpenTradeDetails,
    defaultActiveKey,
    refreshCashflow,
  }) => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey);
    const [hiddenTabs, setHiddenTabs] = useState(
      new Set<string>([SWIFT_MESSAGE_TAB])
    );
    const handleSetTabVisible = useCallback((tabname, visible) => {
      if (visible) {
        setHiddenTabs((tabs) => {
          tabs.delete(tabname);
          return new Set(tabs);
        });
      } else {
        setHiddenTabs((tabs) => {
          tabs.add(tabname);
          return new Set(tabs);
        });
      }
    }, []);
    return (
      <StyledMuiDialog
        className="cashflow-detail-dialog"
        minWidth={1920}
        minHeight={900}
        width={1920}
        height={950}
        enableResize
        enableMaximize
        dividers
        open={isOpen}
        onClose={onClose}
        data-testid={CASHFLOW_DETAILS_DIALOG}
        title={
          <HeaderTabs
            hiddenTabs={hiddenTabs}
            activeKey={activeKey}
            onTabClick={setActiveKey}
          />
        }
      >
        <ErrorBoundry>
          <DetailsBody
            details={details}
            activeKey={activeKey}
            refreshCashflow={refreshCashflow}
            onQueryCashflow={onQueryCashflow}
            onOpenTradeDetails={onOpenTradeDetails}
            onTabVisibleChange={handleSetTabVisible}
            onClose={onClose}
          />
        </ErrorBoundry>
      </StyledMuiDialog>
    );
  }
);

export default CashflowDetailsDialog;
