export type PaymentCaseStatus = "OPEN" | "REVIEWING" | "ACKNOWLEDGED";

export interface PaymentCase {
  id: string;
  direction: "Inbound" | "Outbound";
  currency: string;
  amount: number;
  counterparty: string;
  priority: "Critical" | "High" | "Standard";
  ageMinutes: number;
  status: PaymentCaseStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

interface CasesResponse {
  tenantId: "alpha-payments";
  total: number;
  items: PaymentCase[];
}

const CASES_PATH = "/api/alpha-payments/v1/cases";

export async function getPaymentCases(): Promise<PaymentCase[]> {
  const response = await fetch(CASES_PATH);
  if (!response.ok) {
    throw new Error(`Payment cases request failed with status ${response.status}`);
  }
  const body = (await response.json()) as CasesResponse;
  return body.items;
}

export async function acknowledgePaymentCase(id: string, actor: string): Promise<PaymentCase> {
  const response = await fetch(`${CASES_PATH}/${encodeURIComponent(id)}/acknowledge`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ actor })
  });
  if (!response.ok) {
    throw new Error(`Payment acknowledgement failed with status ${response.status}`);
  }
  const body = (await response.json()) as { item: PaymentCase };
  return body.item;
}
