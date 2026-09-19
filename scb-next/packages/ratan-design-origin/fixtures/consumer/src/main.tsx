import React from "react";
import { createRoot } from "react-dom/client";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  LoadingOverlay,
  LoadingButton,
  Input,
  Label,
  LabelMenuItem,
  SearchInput,
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
  const [tradeSearch, setTradeSearch] = React.useState("");
  const [overlayOpen, setOverlayOpen] = React.useState(false);
  const [overlayActionCount, setOverlayActionCount] = React.useState(0);
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
          <SearchInput
            variant="outlined"
            label="Trade search"
            value={tradeSearch}
            onChange={(event) => setTradeSearch(event.target.value)}
            handleClear={() => setTradeSearch("")}
            clearButtonLabel="Clear trade search"
          />
          <SearchInput
            variant="outlined"
            label="Disabled trade search"
            value="Locked"
            disabled
            handleClear={() => undefined}
            clearButtonLabel="Clear disabled trade search"
          />
          <SearchInput
            variant="outlined"
            label="Read-only trade search"
            value="Retained"
            slotProps={{ input: { readOnly: true } }}
            handleClear={() => undefined}
            clearButtonLabel="Clear read-only trade search"
          />
          <Select
            variant="outlined"
            label="Currency"
            value={currency}
            onChange={(event) => setCurrency(String(event.target.value))}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="SGD">SGD</MenuItem>
          </Select>
          <Label label="Group by" value="Group by">
            <LabelMenuItem value="Counterparty">Counterparty</LabelMenuItem>
            <LabelMenuItem value="Status">Status</LabelMenuItem>
          </Label>
          <Select
            native
            variant="outlined"
            label="Settlement status"
            defaultValue="Pending"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </Select>
          <Select
            native
            id="explicit-settlement-status"
            labelId="explicit-settlement-status-label"
            variant="outlined"
            label="Explicit settlement status"
            defaultValue="Settled"
          >
            <option value="Settled">Settled</option>
            <option value="Failed">Failed</option>
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
        <section className="overlay-demo" aria-labelledby="overlay-demo-title">
          <h2 id="overlay-demo-title">Loading overlay behavior</h2>
          <Button onClick={() => setOverlayOpen(true)}>Start loading overlay</Button>
          <div className="overlay-target">
            <Button onClick={() => setOverlayActionCount((count) => count + 1)}>
              Underlying overlay action
            </Button>
            <output aria-label="Underlying overlay action count">
              {overlayActionCount}
            </output>
            <LoadingOverlay
              open={overlayOpen}
              data-testid="consumer-loading-overlay"
              backdropProps={{ sx: { position: "absolute" } }}
            >
              <div className="overlay-status">
                <span>Processing overlay demo</span>
                <Button onClick={() => setOverlayOpen(false)}>Finish loading</Button>
              </div>
            </LoadingOverlay>
          </div>
        </section>
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
