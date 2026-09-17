import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog, Button, Input } from "../src";

function TradeDialog() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return <>
    <Button variant="outlined" onClick={() => setOpen(true)}>Trade details</Button>
    <Dialog open={open} titleComponents="Trade details" onClose={close}
      onCloseButton={close} fullWidth maxWidth="sm" dividers
      actionComponents={<><Button variant="outlined" onClick={close}>Cancel</Button>
        <Button variant="contained" onClick={close}>Confirm</Button></>}>
      <Input variant="outlined" label="Reference" defaultValue="ABC123" fullWidth />
      <Input variant="outlined" label="Counterparty" defaultValue="SCB" fullWidth />
    </Dialog>
  </>;
}

const meta: Meta<typeof TradeDialog> = { title: "Feedback/Dialog", component: TradeDialog };
export default meta;
export const TradeDetails: StoryObj<typeof TradeDialog> = {};
