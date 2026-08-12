import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Base host root element is missing");

ReactDOMClient.createRoot(rootElement).render(
  <React.StrictMode>
    <App version="1.0.0" />
  </React.StrictMode>,
);
