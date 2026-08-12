import { InfoOutlined } from "@mui/icons-material";
import { css, IconButton, styled, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { BreakPoint } from "src/Cashflow_CN/Main/style";
import { CASHFLOW_DETAILS_COUNTERPARTY_ICON } from "src/Root/analysis/const";
import {
  CounterpartyDetailsV2,
  MuiDialog,
} from "src/Root/import/ratancomponents";

const CounterpartDetailsDialog = styled(MuiDialog)(
  css`
    .MuiDialog-paper {
      margin-top: 0;
      .MuiDialogContent-root {
        padding: 10px 13px 10px 10px !important;
      }
    }
  `
);

interface CounterPartyProps {
  data: any;
}

export const CounterParty = ({ data }: CounterPartyProps) => {
  const [open, setOpen] = useState(false);
  const biggerThanLaptop = useMediaQuery(`(min-width:${BreakPoint.Laptop}px)`);
  return (
    <>
      <IconButton
        aria-label="delete"
        size="small"
        className="popover-btn"
        id="cashflow-counterparty-icon"
        data-testif={CASHFLOW_DETAILS_COUNTERPARTY_ICON}
        disabled={!data}
        onClick={() => setOpen(true)}
      >
        <InfoOutlined sx={{ fontSize: "12px" }} />
      </IconButton>
      <CounterpartDetailsDialog
        open={open}
        enableResize={true}
        onClose={() => setOpen(false)}
        width={700}
        height={biggerThanLaptop ? 650 : 360}
        title="Counterparty Detail"
      >
        <CounterpartyDetailsV2 tradeDetails={data} disableRightClick />
      </CounterpartDetailsDialog>
    </>
  );
};
