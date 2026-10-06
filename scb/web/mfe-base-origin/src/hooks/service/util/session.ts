import { AxiosRequestConfig, CanceledError } from "axios";

type SessionConfig = AxiosRequestConfig & {
  sessionGeneration?: number;
  releaseSession?: () => void;
};

let generation = 0;
const pending = new Set<AbortController>();

export const getSessionGeneration = () => generation;

export const invalidateSession = () => {
  // Invalidate synchronously. React can process logout state after a response.
  generation += 1;
  pending.forEach((controller) => controller.abort());
  pending.clear();
};

export const prepareSessionRequest = (config: AxiosRequestConfig) => {
  const request = config as SessionConfig;
  if (/\/auth\/v[23]\/sso\/login(?:\?|$)/.test(request.url ?? "")) {
    invalidateSession();
  }
  request.sessionGeneration = generation;
  // Keep server logout running. Aborting it could leave the server session live.
  if (
    !/\/auth\/v[23]\/sso\//.test(request.url ?? "") ||
    request.url?.includes("/logout")
  )
    return;
  const controller = new AbortController();
  const originalSignal = request.signal;
  const cancel = () => controller.abort();
  if (originalSignal?.aborted) cancel();
  else originalSignal?.addEventListener?.("abort", cancel, { once: true });
  request.signal = controller.signal;
  pending.add(controller);
  request.releaseSession = () => {
    pending.delete(controller);
    originalSignal?.removeEventListener?.("abort", cancel);
  };
};

export const releaseSessionRequest = (config?: AxiosRequestConfig) => {
  (config as SessionConfig | undefined)?.releaseSession?.();
};

export const isCurrentSession = (config?: AxiosRequestConfig) => {
  const owner = (config as SessionConfig | undefined)?.sessionGeneration;
  return owner === undefined || owner === generation;
};

export const staleSessionError = () =>
  new CanceledError("Request belongs to an earlier login");
