import React from "react";
import { createRoot } from "react-dom/client";
import App from "./application";
const root = document.getElementById("root");
if (!root) throw new Error("Cashflow root element is missing");
createRoot(root).render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      <App tile="/cashflow_cn" />
    </React.Suspense>
  </React.StrictMode>,
);
