import React from "react";
import { createRoot } from "react-dom/client";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  LoadingButton,
  Input,
  Select,
  RatanDesignProvider,
} from "ratan-design-origin";
import type { DesignGeneration } from "ratan-design-origin/theme";
import { newStyleTokens } from "ratan-design-origin/tokens";
import "ratan-design-origin/styles.css";
import "./styles.css";

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [generation, setGeneration] =
    React.useState<DesignGeneration>("legacy");
  const [currency, setCurrency] = React.useState("USD");
  const [loading, setLoading] = React.useState(false);
  const [reference, setReference] = React.useState("");
  return (
    <RatanDesignProvider mode={mode} designGeneration={generation}>
      <main>
        <header>
          <h1>Ratan Design Origin</h1>
          <div className="appearance">
            <label>
              Mode
              <select
                aria-label="Mode"
                value={mode}
                onChange={(event) => setMode(event.target.value as typeof mode)}
              >
                <option>light</option>
                <option>dark</option>
              </select>
            </label>
            <label>
              Design
              <select
                aria-label="Design"
                value={generation}
                onChange={(event) =>
                  setGeneration(event.target.value as DesignGeneration)
                }
              >
                <option>legacy</option>
                <option>webkit</option>
              </select>
            </label>
          </div>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setLoading(true);
          }}
        >
          <Input
            variant="outlined"
            label="Reference"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
          <Input variant="outlined" label="Account" labelPosition="left" />
          <Select
            variant="outlined"
            label="Currency"
            value={currency}
            onChange={(event) => setCurrency(String(event.target.value))}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="SGD">SGD</MenuItem>
          </Select>
          <Input
            variant="outlined"
            label="Amount"
            error
            helperText="Enter a positive amount"
          />
          <Input
            variant="outlined"
            label="Approved by"
            disabled
            value="Pending"
          />
          <div className="actions">
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Submit
            </LoadingButton>
            <Button onClick={() => setLoading(false)}>Cancel</Button>
            <Button disabled>Approve</Button>
          </div>
        </form>
        <output aria-label="Selected currency">{currency}</output>
        {generation === "webkit" && (
          <div
            className="token-surface"
            style={{
              color: newStyleTokens.color.text,
              background: newStyleTokens.color.surface,
            }}
          >
            Payment review
          </div>
        )}
      </main>
    </RatanDesignProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
