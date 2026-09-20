import React from "react";
import { createRoot } from "react-dom/client";
import MenuItem from "@mui/material/MenuItem";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  Button,
  Dialog,
  LoadingOverlay,
  LoadingButton,
  Input,
  Label,
  LabelMenuItem,
  ResetButton,
  SearchButton,
  SearchConditionContainer,
  SearchInput,
  Select,
  ToggleButton,
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
  const [criterionActionCount, setCriterionActionCount] = React.useState(0);
  const [criterionNote, setCriterionNote] = React.useState("");
  const [dialogVariant, setDialogVariant] = React.useState<
    "title" | "custom" | "manual" | null
  >(null);
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
            <LoadingButton loading loadingPosition="startIcon">
              Import trades
            </LoadingButton>
            <SearchButton loading>Search trades</SearchButton>
            <SearchButton data-testid="search-action">Search action</SearchButton>
            <SearchButton data-testid="search-error" color="error">
              Search error
            </SearchButton>
            <ResetButton data-testid="reset-action">Reset action</ResetButton>
            <ResetButton data-testid="reset-error" color="error">
              Reset error
            </ResetButton>
            <ResetButton data-testid="reset-disabled" disabled>
              Reset disabled
            </ResetButton>
            <ToggleButtonGroup exclusive value="selected" aria-label="Action view">
              <ToggleButton data-testid="toggle-selected" value="selected">
                Selected view
              </ToggleButton>
              <ToggleButton data-testid="toggle-action" value="available">
                Available view
              </ToggleButton>
              <ToggleButton value="disabled" disabled>
                Disabled view
              </ToggleButton>
            </ToggleButtonGroup>
            <Button onClick={() => setLoading(false)}>Cancel</Button>
            <Button disabled>Approve</Button>
          </div>
        </form>
        <output aria-label="Selected currency">{currency}</output>
        <section className="criteria-demo" aria-labelledby="criteria-demo-title">
          <h2 id="criteria-demo-title">Search criteria behavior</h2>
          <SearchConditionContainer id="consumer-search-criteria">
            {[
              "Status confirmed",
              "Currency USD",
              "Market Singapore",
              "Desk Treasury",
              "Product FX forward",
            ].map((criterion) => (
              <Button
                key={criterion}
                data-criterion={criterion}
                onClick={() => setCriterionActionCount((count) => count + 1)}
                sx={{ minWidth: 176 }}
              >
                {criterion}
              </Button>
            ))}
            <Input
              data-criterion="note"
              label="Criterion note"
              variant="outlined"
              value={criterionNote}
              onChange={(event) => setCriterionNote(event.target.value)}
              sx={{ minWidth: 176 }}
            />
          </SearchConditionContainer>
          <output aria-label="Criterion action count">{criterionActionCount}</output>
        </section>
        <section className="dialog-demo" aria-labelledby="dialog-demo-title">
          <h2 id="dialog-demo-title">Dialog naming behavior</h2>
          <div className="actions">
            <Button onClick={() => setDialogVariant("title")}>Open titled dialog</Button>
            <Button onClick={() => setDialogVariant("custom")}>Open custom dialog</Button>
            <Button onClick={() => setDialogVariant("manual")}>Open manual dialog</Button>
          </div>
          <Dialog
            open={dialogVariant === "title"}
            titleComponents="Settlement details"
            titleProps={{ id: "consumer-settlement-title" }}
            onCloseButton={() => setDialogVariant(null)}
          >
            Settlement content
          </Dialog>
          <Dialog
            open={dialogVariant === "custom"}
            header={<h2 id="consumer-custom-title">Position details</h2>}
            onClose={() => setDialogVariant(null)}
          >
            Position content
          </Dialog>
          <Dialog
            open={dialogVariant === "manual"}
            header={null}
            titleComponents="Suppressed title"
            aria-label="Manually named dialog"
            onClose={(_event, reason) => {
              if (reason === "escapeKeyDown") setDialogVariant(null);
            }}
          >
            Manual content
          </Dialog>
        </section>
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
              fontSize: newStyleTokens.typography.fontSize,
              boxShadow: newStyleTokens.shadow.focus,
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
