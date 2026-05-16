import {
  asRecord,
  asString,
  type ToolRenderProps,
} from '../../compositor';
import { getFdc3ChatActionDefinitions } from '../shared/declarations';

function getFdc3ActionDetails(actionId: unknown) {
  if (typeof actionId !== 'string') {
    return undefined;
  }

  return getFdc3ChatActionDefinitions().find((action) => action.id === actionId);
}

export function Fdc3ApprovalTool({
  args,
  interrupt,
  resume,
  result,
}: ToolRenderProps & {
  interrupt?: { type: 'human'; payload: unknown };
  resume?: (payload: { confirmed: boolean }) => void;
}) {
  const approvalResult = asRecord(result);
  const confirmed = approvalResult?.confirmed;
  const actionDetails = getFdc3ActionDetails(args.actionId);
  const contextPreview = asRecord(args.contextPreview) ?? actionDetails?.defaultContext;
  const approvalTitle =
    asString(args.approvalTitle) ??
    actionDetails?.approvalTitle ??
    'FDC3 action';
  const approvalBody =
    asString(args.approvalBody) ?? actionDetails?.approvalBody ?? '';
  const intent = asString(args.intent) ?? actionDetails?.intent ?? 'Unknown';

  if (typeof confirmed === 'boolean') {
    return (
      <div
        className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          confirmed
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-rose-200 bg-rose-50 text-rose-900'
        }`}
      >
        <div className="font-medium">
          {confirmed ? 'FDC3 action approved' : 'FDC3 action cancelled'}
        </div>
        <div className="mt-1 text-xs opacity-80">{approvalTitle}</div>
      </div>
    );
  }

  if (interrupt) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
        <div className="text-sm font-semibold text-amber-900">{approvalTitle}</div>
        <div className="mt-2 text-sm text-amber-800">{approvalBody}</div>
        <div className="mt-3 grid gap-1 text-xs text-amber-900">
          <div>
            <span className="font-semibold">Intent:</span> {intent}
          </div>
          {typeof args.actionId === 'string' ? (
            <div>
              <span className="font-semibold">Action:</span> {args.actionId}
            </div>
          ) : null}
          {typeof args.question === 'string' ? (
            <div>
              <span className="font-semibold">Question:</span> {args.question}
            </div>
          ) : null}
        </div>
        {contextPreview ? (
          <div className="mt-3 rounded-xl border border-amber-200 bg-white/70 p-3">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-900">
              Context Preview
            </div>
            <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700">
              {JSON.stringify(contextPreview, null, 2)}
            </pre>
          </div>
        ) : null}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => resume?.({ confirmed: true })}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => resume?.({ confirmed: false })}
            className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-amber-900">{approvalTitle}</div>
      <div className="mt-1 text-amber-800">{approvalBody}</div>
      <div className="mt-2 text-xs text-amber-900">
        <span className="font-semibold">Intent:</span> {intent}
      </div>
    </div>
  );
}
