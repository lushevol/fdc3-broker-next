import React from "react";
import { renderToString } from "react-dom/server";
import {
  Button,
  BuilderButton,
  Loader,
  PageLoader,
  Snackbar,
  Dialog,
  EmptyState,
  ErrorFallback,
  LoadingOverlay,
  Input,
  Select,
  RatanDesignProvider,
} from "ratan-design-origin";
import MenuItem from "@mui/material/MenuItem";
import { createRatanTheme } from "ratan-design-origin/theme";

if (typeof window !== "undefined" || typeof document !== "undefined")
  throw new Error("SSR proof must run without a DOM");
const html = renderToString(
  <RatanDesignProvider>
    <Loader text="Loading trades" />
    <EmptyState title="No server payments" description="No records" />
    <ErrorFallback title="Server error" action={<Button>Retry</Button>} />
    <LoadingOverlay open>Server processing</LoadingOverlay>
    <PageLoader text="Loading workspace" />
    <Snackbar open message={<strong>Saved</strong>} />
    <Dialog open disablePortal titleComponents="Server dialog">Server details</Dialog>
    <Button>Server action</Button>
    <BuilderButton label="Table" anchorEl={null}>Server options</BuilderButton>
    <Input variant="outlined" label="Reference" />
    <Select variant="outlined" label="Currency" value="USD">
      <MenuItem value="USD">USD</MenuItem>
    </Select>
  </RatanDesignProvider>
);
if (
  !html.includes("Server action") ||
  !html.includes("Loading trades") ||
  !html.includes("Saved") ||
  !html.includes("No server payments") ||
  !html.includes("Server error") ||
  !html.includes("Server processing") ||
  createRatanTheme().ratan.designGeneration !== "legacy"
)
  throw new Error("SSR contract failed");
console.log("DOM-free package import and server render passed");
if (!renderToString(<Dialog open disablePortal titleComponents="Server dialog">Server details</Dialog>).includes("Server details")) {
  throw new Error("Standalone dialog SSR lost content");
}
