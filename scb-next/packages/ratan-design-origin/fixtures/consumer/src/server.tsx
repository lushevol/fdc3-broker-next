import React from "react";
import { renderToString } from "react-dom/server";
import {
  Button,
  BuilderButton,
  Loader,
  PageLoader,
  Snackbar,
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
    <PageLoader text="Loading workspace" />
    <Snackbar open message={<strong>Saved</strong>} />
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
  createRatanTheme().ratan.designGeneration !== "legacy"
)
  throw new Error("SSR contract failed");
console.log("DOM-free package import and server render passed");
