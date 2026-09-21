import React from "react";
import { createRoot } from "react-dom/client";
import { RatanDesignProvider } from "ratan-design-origin";
import "ratan-design-origin/styles.css";
import { Dates } from "./dates";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <RatanDesignProvider mode="light" designGeneration="legacy">
    <main>
      <h1>Ratan Design Date Controls</h1>
      <Dates />
    </main>
  </RatanDesignProvider>,
);
