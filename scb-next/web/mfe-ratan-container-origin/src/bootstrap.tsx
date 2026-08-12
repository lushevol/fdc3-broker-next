import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./ratanstatic";
const root = document.getElementById("root");
if (!root) throw new Error("Ratan root element is missing");
createRoot(root).render(
  <React.StrictMode>
    <App module="/cashflow_blotter_cn" tile="/cashflow_cn" />
  </React.StrictMode>,
);
