import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, EmptyState, ErrorFallback, LoadingOverlay } from "../src";

function States() {
  return <EmptyState title="No matching payments" description="No records found"
    wrapperProps={{ sx: { display: "flex", justifyContent: "center", py: 4 } }}
    contentProps={{ sx: { textAlign: "center", maxWidth: "100%" } }}
    action={<Button variant="outlined">Create payment</Button>} />;
}
const meta: Meta<typeof States> = { title: "Feedback/Presentation", component: States };
export default meta;
export const Empty: StoryObj<typeof States> = {};
export const Error: StoryObj<typeof States> = {
  render: () => <ErrorFallback title="Payment unavailable" description="Contact application support"
    action={<Button variant="outlined" href="mailto:support@example.test">Contact support</Button>} />,
};
export const Loading: StoryObj<typeof States> = {
  render: () => <div style={{ position: "relative", height: 240 }}>
    <LoadingOverlay open>Processing payments</LoadingOverlay>
  </div>,
};
