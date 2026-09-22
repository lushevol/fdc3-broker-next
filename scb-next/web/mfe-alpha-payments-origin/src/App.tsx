import { useCallback, useEffect, useMemo, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  EmptyState,
  ErrorFallback,
  Loader,
  LoadingButton,
  SearchInput,
  Select
} from "ratan-design-origin";

import {
  acknowledgePaymentCase,
  getPaymentCases,
  PaymentCase,
  PaymentCaseStatus
} from "./api";
import "./styles.css";

const amountFormatter = new Intl.NumberFormat("en-SG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatStatus(status: PaymentCase["status"]): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function App(): React.ReactElement {
  const [cases, setCases] = useState<PaymentCase[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentCaseStatus | "ALL">("ALL");
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setError(null);
    setCases(null);
    try {
      setCases(await getPaymentCases());
    } catch {
      setError("Payment investigations could not be loaded.");
    }
  }, []);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  const summary = useMemo(
    () => ({
      open: cases?.filter(({ status }) => status === "OPEN").length ?? 0,
      reviewing: cases?.filter(({ status }) => status === "REVIEWING").length ?? 0,
      acknowledged: cases?.filter(({ status }) => status === "ACKNOWLEDGED").length ?? 0
    }),
    [cases]
  );
  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (cases ?? []).filter((paymentCase) => {
      const matchesStatus = statusFilter === "ALL" || paymentCase.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          paymentCase.id,
          paymentCase.direction,
          paymentCase.currency,
          paymentCase.counterparty,
          paymentCase.priority
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [cases, query, statusFilter]);

  const acknowledge = useCallback(async (id: string) => {
    setAcknowledgingId(id);
    setActionError(null);
    try {
      const updatedCase = await acknowledgePaymentCase(id, "mock.alpha-payments");
      setCases((currentCases) =>
        currentCases?.map((paymentCase) =>
          paymentCase.id === updatedCase.id ? updatedCase : paymentCase
        ) ?? null
      );
    } catch {
      setActionError(`Case ${id} could not be acknowledged.`);
    } finally {
      setAcknowledgingId(null);
    }
  }, []);

  if (error) {
    return (
      <main className="alpha-app">
        <div className="alpha-app__state" role="alert">
          <ErrorFallback
            title="Unable to load payment investigations"
            description={error}
            action={
              <Button
                type="button"
                variant="outlined"
                aria-label="Retry loading payment investigations"
                onClick={() => void loadCases()}
              >
                Retry
              </Button>
            }
          />
        </div>
      </main>
    );
  }

  if (!cases) {
    return (
      <main className="alpha-app">
        <div className="alpha-app__state">
          <Loader size={26} text="Loading payment investigations" />
        </div>
      </main>
    );
  }

  return (
    <main className="alpha-app">
      <header className="alpha-app__header">
        <div>
          <p className="alpha-app__eyebrow">Alpha Payments</p>
          <h1>Payment Investigation</h1>
          <p>{cases.length} active cases</p>
        </div>
        <span className="alpha-app__live"><span aria-hidden="true" /> Live operations</span>
      </header>

      <section className="alpha-app__summary" aria-label="Case summary">
        <div aria-label="Total cases"><span>Total queue</span><strong>{cases.length}</strong></div>
        <div aria-label="Open cases"><span>Open</span><strong>{summary.open}</strong></div>
        <div aria-label="Reviewing cases"><span>Reviewing</span><strong>{summary.reviewing}</strong></div>
        <div aria-label="Acknowledged cases"><span>Acknowledged</span><strong>{summary.acknowledged}</strong></div>
      </section>

      <section className="alpha-app__queue" aria-label="Payment investigation queue">
        <div className="alpha-app__queue-heading">
          <div>
            <h2>Investigation queue</h2>
            <p>Prioritised exceptions requiring operations review</p>
          </div>
          <span>{filteredCases.length} {filteredCases.length === 1 ? "result" : "results"}</span>
        </div>

        <div className="alpha-app__filters">
          <SearchInput
            className="alpha-app__search"
            type="search"
            value={query}
            variant="outlined"
            size="small"
            placeholder="Search case or counterparty"
            handleClear={() => setQuery("")}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{ htmlInput: { "aria-label": "Search cases" } }}
          />
          <Select
            formControlClassName="alpha-app__status-filter"
            label="Filter by status"
            value={statusFilter}
            variant="outlined"
            size="small"
            onChange={(event) =>
              setStatusFilter(event.target.value as PaymentCaseStatus | "ALL")
            }
          >
            <MenuItem value="ALL">All statuses</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="REVIEWING">Reviewing</MenuItem>
            <MenuItem value="ACKNOWLEDGED">Acknowledged</MenuItem>
          </Select>
        </div>
        {actionError ? <div className="alpha-app__action-error" role="alert">{actionError}</div> : null}

        <div className="alpha-app__table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Case</th>
                <th scope="col">Direction</th>
                <th scope="col">Counterparty</th>
                <th scope="col">Amount</th>
                <th scope="col">Age</th>
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="alpha-app__sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((paymentCase) => (
                <tr key={paymentCase.id}>
                  <th scope="row">{paymentCase.id}</th>
                  <td>{paymentCase.direction}</td>
                  <td>{paymentCase.counterparty}</td>
                  <td className="alpha-app__amount">
                    <span>{paymentCase.currency}</span> {amountFormatter.format(paymentCase.amount)}
                  </td>
                  <td>{paymentCase.ageMinutes}m</td>
                  <td><span className={`alpha-app__priority alpha-app__priority--${paymentCase.priority.toLowerCase()}`}>{paymentCase.priority}</span></td>
                  <td><span className={`alpha-app__status alpha-app__status--${paymentCase.status.toLowerCase()}`}>{formatStatus(paymentCase.status)}</span></td>
                  <td className="alpha-app__action">
                    {paymentCase.status === "ACKNOWLEDGED" ? (
                      <span className="alpha-app__complete" aria-label={`${paymentCase.id} complete`}>Done</span>
                    ) : (
                      <LoadingButton
                        type="button"
                        variant="outlined"
                        color="success"
                        size="small"
                        aria-label={`Acknowledge ${paymentCase.id}`}
                        loading={acknowledgingId === paymentCase.id}
                        loadingPosition="startIcon"
                        onClick={() => void acknowledge(paymentCase.id)}
                      >
                        {acknowledgingId === paymentCase.id ? "Saving" : "Acknowledge"}
                      </LoadingButton>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 ? (
                <tr>
                  <td className="alpha-app__empty" colSpan={8}>
                    <EmptyState
                      className="alpha-app__empty-state"
                      title={
                        cases.length === 0
                          ? "No payment investigations are currently assigned."
                          : "No cases match the active filters."
                      }
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
