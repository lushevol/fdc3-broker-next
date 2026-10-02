import React from "react";
import { createRoot } from "react-dom/client";
import { LicenseInfo } from "@mui/x-date-pickers-pro";
import { RatanDesignProvider } from "ratan-design-origin";
import "ratan-design-origin/styles.css";
import { Dates } from "./dates";
import "./styles.css";

const muiXLicenseKey = (import.meta as ImportMeta & {
  env?: { VITE_MUI_X_LICENSE_KEY?: string };
}).env?.VITE_MUI_X_LICENSE_KEY;
if (muiXLicenseKey) LicenseInfo.setLicenseKey(muiXLicenseKey);

createRoot(document.getElementById("root")!).render(
  <RatanDesignProvider mode="light" designGeneration="legacy">
    <main>
      <h1>Ratan Design Date Controls</h1>
      <Dates />
    </main>
  </RatanDesignProvider>,
);
